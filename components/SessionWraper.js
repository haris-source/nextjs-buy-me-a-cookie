 "use client"
 import { SessionProvider } from "next-auth/react";
 
 export const SessionWraper = ({children}) => {
   return (
     <SessionProvider>
        {children}
     </SessionProvider>
   )
 }
 