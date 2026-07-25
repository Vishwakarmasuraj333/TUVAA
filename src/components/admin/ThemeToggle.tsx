'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <button
        disabled
        className="p-2 rounded-full border bg-white dark:bg-[#17110d] border-[#eadfcf] dark:border-[#2a211a] text-[#120c08] dark:text-white transition-colors focus:outline-none cursor-not-allowed shadow-sm w-9 h-9 flex items-center justify-center opacity-50"
      >
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border bg-white dark:bg-[#17110d] border-[#eadfcf] dark:border-[#2a211a] text-[#120c08] dark:text-white hover:text-[#DB9E30] dark:hover:text-[#57a68f] hover:border-[#DB9E30] dark:hover:border-[#57a68f] transition-all focus:outline-none cursor-pointer shadow-sm w-9 h-9 flex items-center justify-center"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-4.5 w-4.5 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Sun className="h-4.5 w-4.5 transition-transform duration-300 hover:rotate-45" />
      )}
    </button>
  )
}
