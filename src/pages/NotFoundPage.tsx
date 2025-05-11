
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <BookOpen size={60} className="text-gray-300 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Oops! The page you're looking for isn't in our library.
      </p>
      <Link to="/">
        <Button className="bg-book-purple hover:bg-book-darkPurple">
          Return to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
