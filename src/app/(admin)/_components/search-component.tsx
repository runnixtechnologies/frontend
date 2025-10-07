"use client"

import { useState, useEffect, useId, useRef, useCallback } from "react"
import { SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchComponentProps {
  /** Debounced callback fired after `delay`ms of idle typing OR immediately on Enter. */
  onSearch: (query: string) => void
  /** Controlled value (optional). If provided, the component becomes controlled. */
  value?: string
  /** Controlled value change callback (optional). */
  onValueChange?: (query: string) => void
  /** Initial value for uncontrolled mode. */
  initialQuery?: string
  placeholder?: string
  className?: string
  autoFocus?: boolean
  /** Debounce delay in ms. */
  delay?: number
  /** Called when user clicks the clear button or presses Escape. */
  onClear?: () => void
}

export function SearchComponent({
  onSearch,
  value,
  onValueChange,
  initialQuery = "",
  placeholder = "Search",
  className,
  autoFocus = false,
  delay = 300,
  onClear,
}: SearchComponentProps) {
  const inputId = useId()
  const isControlled = value !== undefined
  const [inner, setInner] = useState(initialQuery)
  const query = isControlled ? value! : inner

  // track focus for subtle styling (optional)
  const [isFocused, setIsFocused] = useState(autoFocus)

  // IME composition guard (don’t debounce while composing)
  const composingRef = useRef(false)

  // keep uncontrolled state in sync if initialQuery changes
  useEffect(() => {
    if (!isControlled) setInner(initialQuery)
  }, [initialQuery, isControlled])

  // debounced search
  useEffect(() => {
    if (composingRef.current) return
    const timer = setTimeout(() => {
      onSearch(query)
    }, delay)
    return () => clearTimeout(timer)
  }, [query, delay, onSearch])

  const setQuery = useCallback(
    (next: string) => {
      if (isControlled) {
        onValueChange?.(next)
      } else {
        setInner(next)
      }
    },
    [isControlled, onValueChange]
  )

  const handleClear = useCallback(() => {
    // avoid redundant onSearch if already empty
    if (query !== "") {
      setQuery("")
      onSearch("")
    }
    onClear?.()
  }, [query, setQuery, onSearch, onClear])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // immediate search on Enter
      onSearch(query)
    } else if (e.key === "Escape") {
      handleClear()
    }
  }

  return (
    <div
      role="search"
      className={cn(
        "relative flex items-center",
        isFocused ? "ring-0 ring-[#E6E6E6] ring-offset-0" : "",
        className
      )}
    >
      <SearchIcon
        aria-hidden="true"
        className="absolute left-2 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#666666]"
      />

      <Input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="h-[30px] border-0 bg-[#F7F9FA] p-2 pl-7 pr-7 shadow-none focus-visible:ring-0 text-xs/[120%] font-figtree text-[#999999] tracking-normal [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onCompositionStart={() => {
          composingRef.current = true
        }}
        onCompositionEnd={(e) => {
          composingRef.current = false
          onSearch((e.target as HTMLInputElement).value)
        }}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        aria-label={placeholder}
        inputMode="search"
        autoComplete="off"
      />

      {query && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          title="Clear search"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0"
          onClick={handleClear}
        >
          <X className="h-3 w-3 text-[#666666]" aria-hidden="true" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
