# Glossary App

A modern, interactive glossary web application built with React, TypeScript, Tailwind CSS, shadcn/ui, and Firebase. Search, filter, and manage your glossary terms with real-time updates and CSV import capabilities.

## Features

- 🔍 **Real-time Search** - Filter terms and definitions as you type
- 🏷️ **Tag Filtering** - Filter by tags with AND/OR logic
- 🔤 **Letter Navigation** - Jump to terms starting with specific letters
- 📤 **CSV Import** - Bulk import terms from CSV files
- 🗑️ **Delete Terms** - Remove terms directly from the UI
- 🔄 **Real-time Updates** - Automatic UI updates when data changes
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **React 18** - Modern React with functional components and hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Firebase Firestore** - Real-time database for persistence
- **Papa Parse** - CSV parsing library

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Firebase project (free tier works great)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd glossaryapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Firebase**
   
   a. Go to [Firebase Console](https://console.firebase.google.com/)
   
   b. Create a new project (or use an existing one)
   
   c. Enable **Firestore Database**:
      - Go to "Firestore Database" in the left sidebar
      - Click "Create database"
      - Start in "test mode" for development (or configure security rules)
   
   d. Get your Firebase config:
      - Go to Project Settings (gear icon) > General
      - Scroll to "Your apps" section
      - Click the web icon (`</>`) to add a web app
      - Copy the `firebaseConfig` object
   
   e. Update `src/firebase.ts`:
      - Open `src/firebase.ts`
      - Replace the `firebaseConfig` object with your config:
      ```typescript
      const firebaseConfig = {
        apiKey: "your-api-key",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "your-app-id"
      };
      ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist` directory. Deploy this to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## CSV Import Format

The app expects CSV files with 3 columns:

1. **Term** (string) - The glossary term name
2. **Definition** (string) - The definition/description
3. **Tags** (comma-separated) - Tags separated by commas (e.g., `ai, ml, agents`)

### Example CSV

```csv
React, A JavaScript library for building user interfaces, frontend, javascript, ui
TypeScript, A typed superset of JavaScript, programming, javascript, types
Firebase, A platform for building mobile and web applications, backend, database, cloud
```

### Import Process

1. Click "Choose CSV File" in the CSV Uploader section
2. Select your CSV file
3. The app will:
   - Parse the CSV
   - Skip duplicate terms (case-insensitive matching)
   - Show you how many terms were added vs skipped
   - Automatically update the UI with new terms

## Project Structure

```
glossaryapp/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   └── select.tsx
│   │   ├── SearchBar.tsx    # Search input component
│   │   ├── TagFilter.tsx    # Tag filtering with AND/OR logic
│   │   ├── LetterNav.tsx    # A-Z letter navigation
│   │   ├── TermList.tsx     # Display list of terms
│   │   └── CsvUploader.tsx  # CSV import component
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn helper)
│   ├── firebase.ts          # Firebase config and helpers
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Customization

### Changing the Data Model

To add new fields to glossary terms:

1. Update `src/types.ts` - Add fields to the `GlossaryTerm` interface
2. Update `src/firebase.ts` - Modify Firebase helpers to handle new fields
3. Update `src/components/CsvUploader.tsx` - Adjust CSV parsing for new columns
4. Update `src/components/TermList.tsx` - Display new fields in the UI

### Customizing Tag Behavior

- **Tag display**: Modify `src/components/TagFilter.tsx` and `src/components/TermList.tsx`
- **Tag extraction**: Change the `getAllTags` logic in `src/App.tsx`
- **Tag filtering logic**: The AND/OR selector is in `src/components/TagFilter.tsx`

### Customizing Letter Navigation

- **Scroll behavior**: Modify `handleLetterClick` in `src/App.tsx`
- **Letter display**: Update `src/components/LetterNav.tsx`
- **Available letters**: Change how `availableLetters` is calculated in `src/App.tsx`

### Styling

- **Global styles**: Edit `src/index.css`
- **Component styles**: Modify Tailwind classes in component files
- **Theme colors**: Update CSS variables in `src/index.css` (`:root` and `.dark`)

## Firebase Security Rules

For development, you can use permissive rules. For production, configure proper security rules in Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /terms/{termId} {
      // Development: allow all
      allow read, write: if true;
      
      // Production: configure based on your auth needs
      // allow read: if true; // Public read
      // allow write: if request.auth != null; // Authenticated write
    }
  }
}
```

## Contributing

This project is designed to be forked and customized. Feel free to:

- Fork the repository
- Add new features
- Customize the UI
- Improve the code
- Share your improvements

## License

This project is open source and available for anyone to use and modify.

## Example CSV File

Here's a sample CSV you can use to test the import:

```csv
API,Application Programming Interface - a set of protocols for building software,backend,programming
CSS,Cascading Style Sheets - used for styling web pages,frontend,web,styling
HTML,HyperText Markup Language - the standard markup language for web pages,frontend,web,markup
JavaScript,A programming language for web development,programming,javascript,frontend
React,A JavaScript library for building user interfaces,frontend,javascript,ui,library
TypeScript,A typed superset of JavaScript,programming,javascript,types
```

Save this as `sample-terms.csv` and import it to get started!

## Support

If you encounter any issues:

1. Check that Firebase is properly configured
2. Ensure all dependencies are installed
3. Check the browser console for errors
4. Verify your CSV format matches the expected structure

Happy glossary building! 🎉
