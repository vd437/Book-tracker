
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@/types/book";
import StarRating from "./StarRating";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, className }) => {
  const truncateNotes = (notes: string, maxLength: number = 30) => {
    if (notes.length <= maxLength) return notes;
    return `${notes.substring(0, maxLength)}...`;
  };

  return (
    <Link to={`/books/${book.id}`}>
      <Card className={cn(
        "h-full hover:shadow-md transition-shadow cursor-pointer transform hover:scale-[1.02] transition-transform",
        className
      )}>
        <div className="relative h-48 w-full overflow-hidden">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={`Cover for ${book.title}`} 
              className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
            />
          ) : (
            <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <BookOpen size={40} className="text-gray-400 dark:text-gray-600" />
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold line-clamp-2 text-book-dark dark:text-gray-100 mb-1">{book.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">by {book.author}</p>
          <div className="mb-3">
            <StarRating rating={book.rating} />
          </div>
          {book.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-2">{truncateNotes(book.notes)}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default BookCard;
