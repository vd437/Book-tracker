
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, BookOpen, Search, Filter } from "lucide-react";
import { useBooks } from "@/context/BookContext";
import BookCard from "@/components/BookCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookForm from "@/components/BookForm";
import { Book } from "@/types/book";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { bookService } from "@/services/bookService";

const BooksPage: React.FC = () => {
  const { books, addBook } = useBooks();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchBy, setSearchBy] = useState<"all" | "title" | "author">("all");
  const [authorSearch, setAuthorSearch] = useState("");
  const [authorBooks, setAuthorBooks] = useState<Book[]>([]);
  const [authorStats, setAuthorStats] = useState<{ name: string, count: number } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults(books);
      return;
    }
    
    const lowerTerm = searchTerm.toLowerCase();
    
    let results: Book[] = [];
    if (searchBy === "all") {
      results = books.filter(
        book => book.title.toLowerCase().includes(lowerTerm) || 
               book.author.toLowerCase().includes(lowerTerm)
      );
    } else if (searchBy === "title") {
      results = books.filter(book => book.title.toLowerCase().includes(lowerTerm));
    } else {
      results = books.filter(book => book.author.toLowerCase().includes(lowerTerm));
    }
    
    setSearchResults(results);
  }, [searchTerm, books, searchBy]);
  
  // Search by specific author
  const handleAuthorSearch = () => {
    if (!authorSearch.trim()) return;
    
    const authorBooks = books.filter(
      book => book.author.toLowerCase().includes(authorSearch.toLowerCase())
    );
    
    setAuthorBooks(authorBooks);
    
    // Get author stats
    if (authorBooks.length > 0) {
      const authorName = authorBooks[0].author;
      const count = authorBooks.length;
      setAuthorStats({ name: authorName, count });
    } else {
      setAuthorStats(null);
    }
  };
  
  const clearAuthorSearch = () => {
    setAuthorSearch("");
    setAuthorBooks([]);
    setAuthorStats(null);
  };

  const handleAddBook = (book: Book) => {
    addBook(book);
    setIsAddBookOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-book-dark dark:text-white">My Books</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {books.length} {books.length === 1 ? "book" : "books"} in your collection
          </p>
        </div>
        <Button 
          onClick={() => setIsAddBookOpen(true)} 
          className="bg-book-purple hover:bg-book-darkPurple dark:bg-book-vivid dark:hover:bg-book-darkPurple"
        >
          <Plus size={16} className="mr-1" /> Add Book
        </Button>
      </div>

      <div className="mb-6 animate-fade-in">
        <Tabs defaultValue="browse">
          <TabsList className="mb-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="author">Author Search</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-20"
              />
              <div className="absolute right-2 top-2">
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value as "all" | "title" | "author")}
                  className="bg-transparent text-sm text-gray-500 dark:text-gray-400 border-none focus:ring-0"
                >
                  <option value="all">All</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                </select>
              </div>
            </div>

            {books.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
                <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Your book collection is empty</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start tracking your reading journey by adding your first book.
                </p>
                <Button 
                  onClick={() => setIsAddBookOpen(true)} 
                  className="bg-book-purple hover:bg-book-darkPurple dark:bg-book-vivid dark:hover:bg-book-darkPurple"
                >
                  <Plus size={16} className="mr-1" /> Add Your First Book
                </Button>
              </div>
            ) : searchResults.length === 0 && searchTerm ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
                <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No books found</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  No books match your search for "{searchTerm}".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                {(searchTerm ? searchResults : books).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="author">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter author name..."
                    value={authorSearch}
                    onChange={(e) => setAuthorSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={handleAuthorSearch}
                  className="bg-book-purple hover:bg-book-darkPurple dark:bg-book-vivid dark:hover:bg-book-darkPurple"
                >
                  Search
                </Button>
                {authorSearch && (
                  <Button 
                    variant="outline" 
                    onClick={clearAuthorSearch}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            {authorStats && (
              <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
                <h2 className="text-xl font-semibold text-book-dark dark:text-white mb-2">Author: {authorStats.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Books in your collection: <span className="font-semibold">{authorStats.count}</span>
                </p>
              </div>
            )}
            
            {authorSearch && authorBooks.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
                <Filter size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No books found</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  No books by author matching "{authorSearch}" in your collection.
                </p>
              </div>
            ) : authorBooks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                {authorBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <BookForm 
            onSubmit={handleAddBook} 
            onCancel={() => setIsAddBookOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksPage;
