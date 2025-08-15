/**
 * Types for the USCIS Data Literacy Handbook
 * Provides structured, accessible content for the official agency guide
 */

/**
 * Content element types that can be used in the handbook
 */
export type ContentElementType = 
  | 'paragraph' 
  | 'heading' 
  | 'subheading' 
  | 'list' 
  | 'image' 
  | 'table' 
  | 'callout' 
  | 'code' 
  | 'quote' 
  | 'interactive';

/**
 * Base content element interface
 */
export interface ContentElement {
  id: string;
  type: ContentElementType;
  ariaLabel?: string;
}

/**
 * Text-based content element
 */
export interface TextElement extends ContentElement {
  content: string;
  highlightTerms?: string[];
}

/**
 * Heading element for section titles
 */
export interface HeadingElement extends TextElement {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * List element for bulleted or numbered lists
 */
export interface ListElement extends ContentElement {
  type: 'list';
  items: string[];
  ordered: boolean;
  ariaLabel?: string;
}

/**
 * Image element with accessibility features
 */
export interface ImageElement extends ContentElement {
  type: 'image';
  src: string;
  altText: string; // Required for accessibility
  caption?: string;
  width?: string | number;
  height?: string | number;
}

/**
 * Table element with accessibility features
 */
export interface TableElement extends ContentElement {
  type: 'table';
  caption: string; // Required for accessibility
  headers: string[];
  rows: string[][];
  summary?: string; // Additional description for screen readers
}

/**
 * Callout element for important information
 */
export interface CalloutElement extends ContentElement {
  type: 'callout';
  title?: string;
  content: string;
  severity: 'info' | 'warning' | 'success' | 'error';
}

/**
 * Interactive element for quizzes, exercises, etc.
 */
export interface InteractiveElement extends ContentElement {
  type: 'interactive';
  interactiveType: 'quiz' | 'exercise' | 'flashcard' | 'decision-tree';
  content: any; // Specific structure depends on interactiveType
  instructions: string;
  ariaInstructions: string; // Clear instructions for screen readers
}

/**
 * Union type of all possible content elements
 */
export type HandbookContentElement =
  | TextElement
  | HeadingElement
  | ListElement
  | ImageElement
  | TableElement
  | CalloutElement
  | InteractiveElement;

/**
 * Handbook section structure
 */
export interface HandbookSection {
  id: string;
  title: string;
  slug: string;
  level: number;
  content: HandbookContentElement[];
  subsections?: HandbookSection[];
  keywords: string[]; // For search indexing
}

/**
 * Handbook chapter structure
 */
export interface HandbookChapter {
  id: string;
  title: string;
  slug: string;
  description: string;
  sections: HandbookSection[];
  order: number;
  icons?: string[];
}

/**
 * Complete handbook structure
 */
export interface Handbook {
  id: string;
  title: string;
  version: string;
  lastUpdated: string;
  chapters: HandbookChapter[];
  metadata: {
    author: string;
    department: string;
    contactEmail?: string;
    approvalDate: string;
    reviewDate: string;
  };
}

/**
 * User's handbook progress tracking
 */
export interface HandbookProgress {
  userId: string;
  lastVisitedChapter: string;
  lastVisitedSection: string;
  bookmarks: {
    chapterId: string;
    sectionId: string;
    note?: string;
    dateAdded: string;
  }[];
  completedSections: string[];
  readTime: number; // Total time spent reading in minutes
}
