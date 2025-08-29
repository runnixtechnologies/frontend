"use client"

import { useState, useEffect } from "react"
import { SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchComponentProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  initialQuery?: string
  autoFocus?: boolean
}

export function SearchItem({
  onSearch,
  placeholder = "Search",
  className,
  initialQuery = "",
  autoFocus = false,
}: SearchComponentProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(autoFocus)

  useEffect(() => {
    // Debounce search to avoid too many searches while typing
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div
      className={cn(
        "relative flex w-full items-center",
        isFocused ? "ring-0 ring-transparent ring-offset-0" : "",
        className
      )}
    >
      <SearchIcon className="absolute left-2 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#666666]" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[43px] border-[#DCDCDC] bg-transparent p-3  pl-7 pr-7 shadow-none focus-visible:ring-0 text-[16px]/[120%] font-figtree text-[#999999] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none -tracking-[1%]"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0"
          onClick={handleClear}
        >
          <X className="h-3 w-3 text-[#666666]" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
