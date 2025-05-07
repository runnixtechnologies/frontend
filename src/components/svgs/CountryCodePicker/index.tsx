import { useState, useMemo } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { countriesWithFlags } from "@/lib/data"

type Country = (typeof countriesWithFlags)[number]

interface Props {
  value: string | null // ISO code, e.g. "NG"
  onChange: (iso: string) => void // react‑hook‑form’s field.onChange
  placeholder?: string // default dial‑code
}

export function CountryCodePicker({
  value,
  onChange,
  placeholder = "+234",
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  /* ---------- memoised filtering ---------- */
  const filtered: Country[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return countriesWithFlags
    return countriesWithFlags.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.phone.includes(q)
    )
  }, [query])

  /* ---------- helpers ---------- */
  const selected = countriesWithFlags.find((c) => c.code === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[95px] border-none bg-transparent hover:bg-transparent justify-between pr-2 [&_.flag]:hidden"
        >
          <span className="truncate">
            {selected ? selected.phone : placeholder}
          </span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[260px]">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search country"
            value={query}
            onValueChange={setQuery}
            className="h-10"
          />
          <CommandList className="max-h-64 overflow-y-auto">
            {filtered.map((c) => (
              <CommandItem
                key={c.code}
                value={c.code}
                onSelect={() => {
                  onChange(c.code)
                  setOpen(false)
                  setQuery("")
                }}
                className="flex items-center gap-2"
              >
                <span className="flag">{c.flag}</span>
                <span className="grow text-sm">{c.label}</span>
                <span className="text-muted-foreground">{c.phone}</span>
                {value === c.code && (
                  <CheckIcon className="ml-auto h-4 w-4 text-primary" />
                )}
              </CommandItem>
            ))}
            {!filtered.length && (
              <p className="p-3 text-sm text-muted-foreground">No match.</p>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
