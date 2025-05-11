import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Book } from "@/types/book";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  rating: z.number().min(1).max(5),
  notes: z.string(),
  coverImage: z.string().optional(),
  dateAdded: z.string().optional(),
});

interface BookFormProps {
  defaultValues?: Partial<Book>;
  onSubmit: (book: Book) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const BookForm: React.FC<BookFormProps> = ({
  defaultValues = {},
  onSubmit,
  onCancel,
  submitLabel = "Save",
}) => {
  const [coverPreview, setCoverPreview] = useState<string | null>(defaultValues.coverImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: defaultValues.id || "",
      title: defaultValues.title || "",
      author: defaultValues.author || "",
      rating: defaultValues.rating || 0,
      notes: defaultValues.notes || "",
      coverImage: defaultValues.coverImage || "",
      dateAdded: defaultValues.dateAdded || "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Image must be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPG, PNG and WebP images are supported",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageData = event.target.result as string;
        setCoverPreview(imageData);
        form.setValue("coverImage", imageData);
        setIsUploading(false);
        toast({
          title: "Image uploaded",
          description: "Cover image has been uploaded successfully"
        });
      }
    };
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "Failed to process the image",
        variant: "destructive"
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const clearCoverImage = () => {
    setCoverPreview(null);
    form.setValue("coverImage", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const book: Book = {
      id: values.id || uuidv4(),
      title: values.title,
      author: values.author,
      rating: values.rating,
      notes: values.notes,
      coverImage: values.coverImage,
      dateAdded: values.dateAdded || new Date().toISOString(),
    };
    onSubmit(book);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Cover Image Field */}
        <FormItem className="mb-4">
          <FormLabel>Book Cover</FormLabel>
          <div className="flex items-center justify-center">
            {coverPreview ? (
              <div className="relative w-32 h-40 mb-2">
                <img
                  src={coverPreview}
                  alt="Book cover preview"
                  className="w-32 h-40 object-cover rounded-md shadow-md animate-fade-in"
                />
                <button
                  type="button"
                  onClick={clearCoverImage}
                  className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <X size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <div 
                onClick={triggerFileInput}
                className="w-32 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer hover:border-book-purple dark:hover:border-book-vivid transition-colors duration-200 relative overflow-hidden"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 size={24} className="mb-1 animate-spin text-book-purple dark:text-book-vivid" />
                    <span className="mt-2 text-xs">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload size={24} className="mb-1" />
                    <span className="text-xs text-center px-2">Add Cover</span>
                    <input 
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </FormItem>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the book title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Enter the author's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="p-1">
                  <StarRating 
                    rating={field.value} 
                    editable={true} 
                    onRatingChange={(rating) => field.onChange(rating)} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your thoughts about the book..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="bg-book-purple hover:bg-book-darkPurple dark:bg-book-vivid dark:hover:bg-book-darkPurple">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookForm;
