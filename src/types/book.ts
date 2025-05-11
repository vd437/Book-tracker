
export interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  notes: string;
  coverImage?: string; // Base64 encoded image or URL
  dateAdded: string; // ISO string format
}
