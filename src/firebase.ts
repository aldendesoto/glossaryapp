/**
 * Firebase configuration and database helpers
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use an existing one)
 * 3. Enable Firestore Database (start in test mode for development)
 * 4. Go to Project Settings > General > Your apps > Web app
 * 5. Copy the Firebase config object
 * 6. Replace the firebaseConfig object below with your config
 * 
 * SECURITY NOTE:
 * For production, configure Firestore security rules properly.
 * For development/testing, you can use permissive rules temporarily:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /terms/{termId} {
 *       allow read, write: if true; // PERMISSIVE - only for development!
 *     }
 *   }
 * }
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  query, 
  onSnapshot, 
  getDocs,
  addDoc, 
  deleteDoc, 
  doc,
  Timestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { GlossaryTerm } from './types';

// TODO: Replace this with your Firebase config from the Firebase Console
// Go to Project Settings > General > Your apps > Web app to get your config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // In development, you might want to show a helpful error message
  throw new Error('Firebase not configured. Please add your Firebase config to src/firebase.ts');
}

/**
 * Subscribe to all terms in the glossary
 * Returns an unsubscribe function
 */
export function subscribeToTerms(
  callback: (terms: GlossaryTerm[]) => void
): () => void {
  const termsRef = collection(db, 'terms');
  const q = query(termsRef);

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const terms: GlossaryTerm[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      terms.push({
        id: doc.id,
        term: data.term || '',
        definition: data.definition || '',
        tags: data.tags || [],
        createdAt: data.createdAt?.toMillis() || Date.now(),
      });
    });
    callback(terms);
  }, (error) => {
    console.error('Error subscribing to terms:', error);
    callback([]);
  });
}

/**
 * Add a single term to Firestore
 */
export async function addTerm(term: Omit<GlossaryTerm, 'id' | 'createdAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'terms'), {
      term: term.term.trim(),
      definition: term.definition.trim(),
      tags: term.tags.map(tag => tag.trim()).filter(tag => tag.length > 0),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding term:', error);
    throw error;
  }
}

/**
 * Add multiple terms from CSV import
 * Skips duplicates based on exact term name match (case-insensitive)
 * Returns count of new terms added
 */
export async function addTermsFromCSV(
  rows: Array<{ term: string; definition: string; tags: string[] }>
): Promise<{ added: number; skipped: number }> {
  // First, get existing terms to check for duplicates (one-time read)
  const termsRef = collection(db, 'terms');
  const q = query(termsRef);
  const snapshot = await getDocs(q);
  
  const existingTerms: GlossaryTerm[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    existingTerms.push({
      id: doc.id,
      term: data.term || '',
      definition: data.definition || '',
      tags: data.tags || [],
      createdAt: data.createdAt?.toMillis() || Date.now(),
    });
  });
  
  const existingTermNames = new Set(
    existingTerms.map(t => t.term.toLowerCase().trim())
  );

  let added = 0;
  let skipped = 0;

  // Process each row
  for (const row of rows) {
    const termName = row.term.trim();
    if (!termName) {
      skipped++;
      continue;
    }

    // Check for duplicate (case-insensitive)
    if (existingTermNames.has(termName.toLowerCase())) {
      skipped++;
      continue;
    }

    try {
      await addTerm({
        term: termName,
        definition: row.definition.trim(),
        tags: row.tags,
      });
      added++;
      existingTermNames.add(termName.toLowerCase()); // Prevent duplicates in same batch
    } catch (error) {
      console.error('Error adding term from CSV:', error);
      skipped++;
    }
  }

  return { added, skipped };
}

/**
 * Delete a term by ID
 */
export async function deleteTerm(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'terms', id));
  } catch (error) {
    console.error('Error deleting term:', error);
    throw error;
  }
}

/**
 * Update an existing term
 * Optional: Use this if you want to add inline editing
 */
/**
 * Update an existing term
 * Optional: Use this if you want to add inline editing
 */
export async function updateTerm(id: string, updates: Partial<Omit<GlossaryTerm, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const { updateDoc } = await import('firebase/firestore');
    const termRef = doc(db, 'terms', id);
    
    const updateData: any = {};
    if (updates.term !== undefined) updateData.term = updates.term.trim();
    if (updates.definition !== undefined) updateData.definition = updates.definition.trim();
    if (updates.tags !== undefined) {
      updateData.tags = updates.tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
    await updateDoc(termRef, updateData);
  } catch (error) {
    console.error('Error updating term:', error);
    throw error;
  }
}
