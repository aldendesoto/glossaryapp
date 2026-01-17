/**
 * Core data model for glossary terms
 * 
 * To customize the data model, modify this interface and update:
 * - Firebase helpers in firebase.ts
 * - CSV parsing logic in CsvUploader.tsx
 * - TermList component to display new fields
 */
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  tags: string[];
  createdAt: number; // Unix timestamp
}

/**
 * Tag filter logic type
 * AND: term must have all selected tags
 * OR: term must have at least one selected tag
 */
export type TagFilterLogic = 'AND' | 'OR';
