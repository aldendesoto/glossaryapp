import { Button } from "./ui/button"

interface LetterNavProps {
  onLetterClick: (letter: string) => void;
  availableLetters: Set<string>;
  currentLetter: string | null;
}

/**
 * Alphabet letter navigation component
 * 
 * To customize letter navigation:
 * - Change the scroll behavior (currently filters by first letter)
 * - Modify the letter display style
 * - Adjust how availableLetters are calculated in App.tsx
 */
export function LetterNav({ onLetterClick, availableLetters, currentLetter }: LetterNavProps) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {letters.map((letter) => {
        const isAvailable = availableLetters.has(letter);
        const isActive = currentLetter === letter;
        
        return (
          <Button
            key={letter}
            variant={isActive ? "default" : isAvailable ? "outline" : "ghost"}
            size="sm"
            onClick={() => onLetterClick(letter)}
            disabled={!isAvailable}
            className="min-w-[2.5rem]"
          >
            {letter}
          </Button>
        );
      })}
    </div>
  );
}
