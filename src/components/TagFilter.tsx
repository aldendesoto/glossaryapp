import { Badge } from "./ui/badge"
import { Switch } from "./ui/switch"
import { TagFilterLogic } from "../types"

interface TagFilterProps {
  availableTags: string[];
  selectedTags: Set<string>;
  onTagToggle: (tag: string) => void;
  logic: TagFilterLogic;
  onLogicChange: (logic: TagFilterLogic) => void;
}

/**
 * Tag filter component with AND/OR logic selector
 * 
 * To customize tag behavior:
 * - Modify the tag display style in the Badge component
 * - Change the logic selector UI (currently a Select dropdown)
 * - Adjust tag extraction logic in App.tsx (getAllTags function)
 */
export function TagFilter({
  availableTags,
  selectedTags,
  onTagToggle,
  logic,
  onLogicChange,
}: TagFilterProps) {
  const sortedTags = [...availableTags].sort();

  if (sortedTags.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No tags available. Add terms with tags to see them here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Filter by tags:</label>
        <Switch
          checked={logic === "AND"}
          onCheckedChange={(checked) => onLogicChange(checked ? "AND" : "OR")}
          leftLabel="OR"
          rightLabel="AND"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag) => {
          const isSelected = selectedTags.has(tag);
          return (
            <Badge
              key={tag}
              variant="outline"
              className={`cursor-pointer bg-[#E5E4E2] border-transparent text-foreground hover:bg-[#E5E4E2]/80 transition-colors ${
                isSelected ? "ring-2 ring-primary ring-offset-1" : ""
              }`}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
