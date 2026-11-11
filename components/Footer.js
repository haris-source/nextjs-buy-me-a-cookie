import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white p-4 h-15 flex items-center justify-center shadow-inner">
      <div className="container mx-auto text-center">
        <p className="flex items-center justify-center gap-2 text-sm sm:text-base">
          <span>&copy; {new Date().getFullYear()} Get Me A Cookie</span>
          <span className="inline-block text-2xl animate-bounce">
            🍪
          </span>
          <span>All rights reserved.</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer