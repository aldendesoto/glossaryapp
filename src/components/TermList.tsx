import { GlossaryTerm } from "../types"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { deleteTerm } from "../firebase"

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
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this term?")) {
      try {
        await deleteTerm(id);
      } catch (error) {
        console.error("Error deleting term:", error);
        alert("Failed to delete term. Please try again.");
      }
    }
  };

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
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(term.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
