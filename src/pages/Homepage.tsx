
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book, BookOpen, Star, Plus, BookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BookContext";
import BookCard from "@/components/BookCard";

const Homepage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { books } = useBooks();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Get recently added books
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-8">
      {isAuthenticated && (
        <>
          <div className="bg-gradient-to-r from-book-purple to-book-vivid dark:from-book-darkPurple dark:to-book-vivid rounded-lg p-8 text-white animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user?.name?.split(" ")[0] || "Reader"}!
            </h1>
            <p className="text-lg text-white/90 mb-6">
              Track, rate, and reflect on your reading journey
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/books">
                <Button className="bg-white text-book-purple hover:bg-gray-100 dark:hover:bg-gray-100">
                  <BookOpen className="mr-2 h-5 w-5" /> View My Books
                </Button>
              </Link>
              <Link to="/stats">
                <Button variant="outline" className="text-white border-white hover:bg-white/20">
                  <Star className="mr-2 h-5 w-5" /> Reading Stats
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold dark:text-white">Recently Added Books</h2>
              <Link to="/books">
                <Button variant="ghost" className="text-book-purple dark:text-book-vivid hover:text-book-darkPurple">
                  View All
                </Button>
              </Link>
            </div>
            
            {recentBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Your book collection is empty</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start tracking your reading journey by adding your first book.
                </p>
                <Link to="/books">
                  <Button className="bg-book-purple hover:bg-book-darkPurple dark:bg-book-vivid dark:hover:bg-book-darkPurple">
                    <Plus size={16} className="mr-1" /> Add Your First Book
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-book-light dark:bg-gray-700 text-book-purple dark:text-book-vivid mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">Track Your Reading</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Keep a record of all the books you've read in your personal library.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-book-light dark:bg-gray-700 text-book-purple dark:text-book-vivid mb-4">
                <Star size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">Rate & Review</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Give books your personal rating and write notes to remember your thoughts.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-book-light dark:bg-gray-700 text-book-purple dark:text-book-vivid mb-4">
                <BookText size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">Discover Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                See your reading patterns and track your favorite authors and genres.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Homepage;
