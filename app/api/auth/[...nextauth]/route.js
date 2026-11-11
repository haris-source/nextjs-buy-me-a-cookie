import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
// import FacebookProvider from "next-auth/providers/facebook";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
       // ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET

    //   ? [

    //       GoogleProvider({

    //         clientId: process.env.GOOGLE_CLIENT_ID,

    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    //       }),

    //     ]

    //   : []),

    // ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET

    //   ? [

    //       FacebookProvider({

    //         clientId: process.env.FACEBOOK_CLIENT_ID,

    //         clientSecret: process.env.FACEBOOK_CLIENT_SECRET,

    //       }),

    //     ]

    //   : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        await connectDB();
        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).select("+password");

        if (!user || !user.password) {
          throw new Error("No user found with these credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image && !user.image.startsWith("data:") ? user.image : "",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        try {
          await connectDB();
          const normalizedEmail = user.email.toLowerCase().trim();
          let existing = await User.findOne({ email: normalizedEmail });

          if (!existing) {
            let baseUsername = (user.name || normalizedEmail.split("@")[0])
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]/g, "");

            let uniqueUsername = baseUsername;
            let count = 1;
            while (await User.findOne({ username: uniqueUsername })) {
              uniqueUsername = `${baseUsername}${count}`;
              count++;
            }

            await User.create({
              name: user.name || uniqueUsername,
              email: normalizedEmail,
              username: uniqueUsername,
              image: user.image || "",
              profilePic: user.image || "",
              provider: account.provider,
            });
          }
        } catch (err) {
          console.error("Error creating OAuth user:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        if (user.image && !user.image.startsWith("data:")) {
          token.picture = user.image;
        }
      }

      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.image && !session.user.image.startsWith("data:")) {
          token.picture = session.user.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.email) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;

        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email.toLowerCase() })
            .select("profilePic image name username")
            .lean();

          if (dbUser) {
            session.user.name = dbUser.name || token.name;
            session.user.username = dbUser.username || token.email.split("@")[0];
            session.user.image = dbUser.profilePic || dbUser.image || token.picture || "";
          }
        } catch (err) {
          console.error("Session lookup error:", err);
          session.user.image = token.picture || "";
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };