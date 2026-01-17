import { Input } from "./ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Real-time search input component
 * Filters terms as the user types (searches term names only)
 */
export function SearchBar({ value, onChange, placeholder = "Search terms..." }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 h-14 text-lg font-semibold"
      />
    </div>
  )
}
