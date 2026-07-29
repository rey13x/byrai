import React from "react"

export function GradientHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent ${className}`}>
      {children}
    </h3>
  )
}

export default GradientHeading
