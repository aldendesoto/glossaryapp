import { useState, useEffect, useMemo } from "react"
import { GlossaryTerm, TagFilterLogic } from "./types"
import { subscribeToTerms } from "./firebase"
import { SearchBar } from "./components/SearchBar"
import { TagFilter } from "./components/TagFilter"
import { LetterNav } from "./components/LetterNav"
import { TermList } from "./components/TermList"
import { CsvUploader } from "./components/CsvUploader"

/**
 * Main Glossary App Component
 * 
 * Filtering Pipeline:
 * 1. Load all terms from Firebase (real-time subscription)
 * 2. Apply search text filter (case-insensitive, matches term only)
 * 3. Apply tag filter (AND/OR logic based on selected tags)
 * 4. Apply letter filter (if a letter is selected)
 * 5. Sort alphabetically by term name
 * 6. Render filtered list
 */
function App() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [searchText, setSearchText] = useState("")
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [tagLogic, setTagLogic] = useState<TagFilterLogic>("OR")
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  // Subscribe to Firebase terms on mount
  useEffect(() => {
    const unsubscribe = subscribeToTerms((loadedTerms) => {
      setTerms(loadedTerms)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Extract all unique tags from terms
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    terms.forEach((term) => {
      term.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet)
  }, [terms])

  // Extract available first letters from terms
  const availableLetters = useMemo(() => {
    const letterSet = new Set<string>()
    terms.forEach((term) => {
      const firstLetter = term.term.charAt(0).toUpperCase()
      if (/[A-Z]/.test(firstLetter)) {
        letterSet.add(firstLetter)
      }
    })
    return letterSet
  }, [terms])

  // Combined filtering pipeline
  const filteredTerms = useMemo(() => {
    let filtered = [...terms]

    // 1. Apply search text filter (only searches term field)
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (term) =>
          term.term.toLowerCase().includes(searchLower)
      )
    }

    // 2. Apply tag filter
    if (selectedTags.size > 0) {
      if (tagLogic === "AND") {
        // Term must have ALL selected tags
        filtered = filtered.filter((term) => {
          const termTags = new Set(term.tags.map((t) => t.toLowerCase()))
          return Array.from(selectedTags).every((selectedTag) =>
            termTags.has(selectedTag.toLowerCase())
          )
        })
      } else {
        // OR: Term must have AT LEAST ONE selected tag
        filtered = filtered.filter((term) => {
          const termTags = new Set(term.tags.map((t) => t.toLowerCase()))
          return Array.from(selectedTags).some((selectedTag) =>
            termTags.has(selectedTag.toLowerCase())
          )
        })
      }
    }

    // 3. Apply letter filter
    if (selectedLetter) {
      filtered = filtered.filter((term) =>
        term.term.charAt(0).toUpperCase() === selectedLetter
      )
    }

    // 4. Sort alphabetically by term name
    filtered.sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }))

    return filtered
  }, [terms, searchText, selectedTags, tagLogic, selectedLetter])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        next.add(tag)
      }
      return next
    })
    // Reset letter filter when tags change (optional - remove if you want to keep letter)
    // setSelectedLetter(null)
  }

  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      // Clicking the same letter deselects it
      setSelectedLetter(null)
    } else {
      setSelectedLetter(letter)
      // Scroll to first term with that letter (if any)
      setTimeout(() => {
        const element = document.getElementById(`term-${letter}`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8 relative">
          <div className="absolute top-0 right-0">
            <CsvUploader />
          </div>
          <div className="text-center">
            <h1 className="mb-2">Glossary</h1>
            <p className="text-muted-foreground">
              A searchable, filterable glossary that you can fork and customize
            </p>
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar value={searchText} onChange={setSearchText} />
        </div>

        {/* Tag Filter */}
        <div className="mb-6">
          <TagFilter
            availableTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            logic={tagLogic}
            onLogicChange={setTagLogic}
          />
        </div>

        {/* Letter Navigation */}
        <div className="mb-6">
          <LetterNav
            onLetterClick={handleLetterClick}
            availableLetters={availableLetters}
            currentLetter={selectedLetter}
          />
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredTerms.length} of {terms.length} terms
        </div>

        {/* Term List */}
        <TermList terms={filteredTerms} />
      </div>
    </div>
  )
}

export default App
