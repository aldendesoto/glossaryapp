import { GlossaryTerm } from "../types"
import { Badge } from "./ui/badge"

interface TermListProps {
  terms: GlossaryTerm[];
}

/**
 * Displays the list of glossary terms
 * 
 * To customize term display:
 * - Modify the card layout and styling
 * - Add inline editing (see firebase.ts updateTerm function)
 * - Change how tags are displayed
 */
export function TermList({ terms }: TermListProps) {

  if (terms.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No terms match your filters</p>
        <p className="text-sm mt-2">Try adjusting your search or tag filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {terms.map((term) => (
        <div
          key={term.id}
          id={`term-${term.term.charAt(0).toUpperCase()}`}
          className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
        >
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{term.term}</h3>
            <p className="text-sm text-muted-foreground">{term.definition}</p>
            {term.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {term.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-[#E5E4E2] border-transparent text-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
