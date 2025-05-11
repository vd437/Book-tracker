
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooks } from "@/context/BookContext";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowDown } from "lucide-react";
import StarRating from "@/components/StarRating";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BookForm from "@/components/BookForm";

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBook, updateBook, deleteBook } = useBooks();
  const navigate = useNavigate();

  const book = getBook(id || "");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!book) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-medium text-gray-700 mb-4">Book not found</h2>
        <Button onClick={() => navigate("/books")} className="bg-book-purple hover:bg-book-darkPurple">
          Back to My Books
        </Button>
      </div>
    );
  }

  const handleUpdateBook = (updatedBook: Book) => {
    updateBook(updatedBook);
    setIsEditDialogOpen(false);
  };

  const handleDeleteBook = () => {
    deleteBook(book.id);
    navigate("/books");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button 
        onClick={() => navigate("/books")} 
        variant="ghost" 
        className="mb-6 text-gray-500 hover:text-book-purple"
      >
        <ArrowDown className="rotate-90 mr-1" size={16} /> Back to Books
      </Button>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-book-dark">{book.title}</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditDialogOpen(true)}
              className="text-book-darkPurple border-book-darkPurple hover:bg-book-light"
            >
              <Edit size={16} className="mr-1" /> Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-book-red border-book-red hover:bg-red-50"
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <p className="text-gray-500">by <span className="font-semibold">{book.author}</span></p>
              <div className="mt-2">
                <StarRating rating={book.rating} size={24} />
              </div>
            </div>
            <div className="text-gray-500 text-sm mt-4 md:mt-0">
              Added on {formatDate(book.dateAdded)}
            </div>
          </div>
          
          <div className="pt-4">
            <h2 className="font-semibold text-lg mb-2">My Notes</h2>
            <Card className="bg-book-light border-none">
              <CardContent className="p-4">
                {book.notes ? (
                  <p className="text-gray-700 whitespace-pre-line">{book.notes}</p>
                ) : (
                  <p className="text-gray-400 italic">No notes added for this book.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <BookForm 
            defaultValues={book} 
            onSubmit={handleUpdateBook} 
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Update"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{book.title}" from your collection. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBook} className="bg-book-red hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookDetailsPage;
