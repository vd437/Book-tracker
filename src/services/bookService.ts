
import { Book } from "../types/book";

const STORAGE_KEY = "my-reading-tracker-books";

export const bookService = {
  getBooks: (): Book[] => {
    const booksJson = localStorage.getItem(STORAGE_KEY);
    if (!booksJson) return [];
    
    try {
      return JSON.parse(booksJson);
    } catch (err) {
      console.error("Error parsing books from localStorage:", err);
      return [];
    }
  },

  saveBook: (book: Book): Book => {
    const books = bookService.getBooks();
    
    // If the book already exists (editing), update it
    const existingBookIndex = books.findIndex(b => b.id === book.id);
    if (existingBookIndex >= 0) {
      books[existingBookIndex] = book;
    } else {
      // Otherwise add as new book
      books.push(book);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return book;
  },

  getBookById: (id: string): Book | undefined => {
    const books = bookService.getBooks();
    return books.find(book => book.id === id);
  },

  deleteBook: (id: string): void => {
    let books = bookService.getBooks();
    books = books.filter(book => book.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  },
  
  searchBooks: (query: string): Book[] => {
    const books = bookService.getBooks();
    if (!query.trim()) return books;
    
    const lowerQuery = query.toLowerCase();
    return books.filter(
      book => 
        book.title.toLowerCase().includes(lowerQuery) || 
        book.author.toLowerCase().includes(lowerQuery)
    );
  },
  
  getBooksByAuthor: (author: string): Book[] => {
    const books = bookService.getBooks();
    return books.filter(book => book.author.toLowerCase() === author.toLowerCase());
  },

  getStatistics: () => {
    const books = bookService.getBooks();
    
    // Total number of books
    const totalBooks = books.length;
    
    // Average rating
    const averageRating = books.length > 0 
      ? parseFloat((books.reduce((acc, book) => acc + book.rating, 0) / books.length).toFixed(1)) 
      : 0;
    
    // Most frequent author
    const authorCount: Record<string, number> = {};
    books.forEach(book => {
      authorCount[book.author] = (authorCount[book.author] || 0) + 1;
    });
    
    let favoriteAuthor = "";
    let maxCount = 0;
    
    Object.entries(authorCount).forEach(([author, count]) => {
      if (count > maxCount) {
        favoriteAuthor = author;
        maxCount = count;
      }
    });
    
    // Get all authors with book counts
    const authors = Object.entries(authorCount).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
    
    return {
      totalBooks,
      averageRating,
      favoriteAuthor: favoriteAuthor || "No books yet",
      favoriteAuthorCount: maxCount,
      authors
    };
  }
};
