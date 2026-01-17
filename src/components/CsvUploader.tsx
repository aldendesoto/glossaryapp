import { useState, useRef } from "react"
import { usePapaParse } from "react-papaparse"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Upload } from "lucide-react"
import { addTermsFromCSV } from "../firebase"

/**
 * CSV upload component for importing glossary terms
 * 
 * Expected CSV format (3 columns):
 * 1. Term (string)
 * 2. Definition (string)
 * 3. Tags (comma-separated list, e.g., "ai, ml, agents")
 * 
 * To customize CSV parsing:
 * - Modify the parseOptions in handleFileUpload
 * - Change how tags are split (currently by comma)
 * - Adjust duplicate detection logic in firebase.ts
 */
export function CsvUploader() {
  const { readString } = usePapaParse()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [result, setResult] = useState<{ added: number; skipped: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showStatusPanel, setShowStatusPanel] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus("Reading file...")
    setError(null)
    setResult(null)
    setShowStatusPanel(true)

    try {
      // Read file as text (10% progress)
      const text = await file.text()
      setUploadProgress(10)
      setUploadStatus("Parsing CSV...")

      readString(text, {
        header: false,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            setUploadProgress(30)
            setUploadStatus("Processing rows...")
            
            const rows = results.data as string[][]
            
            // Parse rows into term objects
            const terms = rows
              .map((row) => {
                if (!row || row.length < 3) return null
                
                const term = (row[0] || "").trim()
                const definition = (row[1] || "").trim()
                const tagsString = (row[2] || "").trim()
                
                if (!term) return null
                
                // Split tags by comma and trim each
                const tags = tagsString
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0)
                
                return {
                  term,
                  definition,
                  tags,
                }
              })
              .filter((term) => term !== null) as Array<{
                term: string
                definition: string
                tags: string[]
              }>

            if (terms.length === 0) {
              setError("No valid terms found in CSV. Expected format: term,definition,tags")
              setIsUploading(false)
              setUploadProgress(0)
              setUploadStatus("")
              return
            }

            setUploadProgress(50)
            setUploadStatus(`Uploading ${terms.length} terms to Firebase...`)

            // Upload to Firebase
            const uploadResult = await addTermsFromCSV(terms)
            
            setUploadProgress(100)
            setUploadStatus("Upload complete!")
            setResult(uploadResult)
            
            // Reset progress and hide status panel after a delay
            setTimeout(() => {
              setIsUploading(false)
              setUploadProgress(0)
              setUploadStatus("")
              setTimeout(() => {
                setShowStatusPanel(false)
                setResult(null)
              }, 2000)
            }, 1500)
          } catch (err) {
            console.error("Error parsing CSV:", err)
            setError(err instanceof Error ? err.message : "Failed to parse CSV file")
            setIsUploading(false)
            setUploadProgress(0)
            setUploadStatus("")
          }
        },
        error: (error) => {
          console.error("CSV parse error:", error)
          setError("Failed to parse CSV file. Please check the format.")
          setIsUploading(false)
          setUploadProgress(0)
          setUploadStatus("")
        },
      })
    } catch (err) {
      console.error("Error reading file:", err)
      setError("Failed to read file. Please try again.")
      setIsUploading(false)
      setUploadProgress(0)
      setUploadStatus("")
    }
  }

  return (
    <div className="relative group">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileUpload}
        className="hidden"
        disabled={isUploading}
      />
      <Button 
        variant="outline" 
        disabled={isUploading}
        onClick={handleButtonClick}
        type="button"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Import new terms"}
      </Button>

      {/* Hover tooltip with instructions */}
      <div className="absolute top-full right-0 mt-2 w-80 p-3 bg-popover border rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none">
        <p className="text-sm text-muted-foreground">
          Upload a CSV file with 3 columns: term, definition, tags (comma-separated)
        </p>
      </div>

      {/* Status panel (progress, errors, results) - shows during/after upload */}
      {showStatusPanel && (isUploading || error || result) && (
        <div className="absolute top-full right-0 mt-2 w-80 p-3 bg-popover border rounded-md shadow-lg z-10">
          {isUploading && (
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{uploadStatus}</span>
                <span className="text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md mb-3">
              {error}
            </div>
          )}

          {result && (
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">
                <strong>{result.added}</strong> new terms added
              </p>
              {result.skipped > 0 && (
                <p className="text-muted-foreground">
                  <strong>{result.skipped}</strong> terms skipped (duplicates or invalid)
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
