
import React from "react";
import { useBooks } from "@/context/BookContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StarRating from "@/components/StarRating";
import { BookOpen, Star, User, BarChart2 } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const StatsPage: React.FC = () => {
  const { books, statistics } = useBooks();
  
  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = Array(5).fill(0);
    
    books.forEach((book) => {
      const ratingIndex = Math.floor(book.rating) - 1;
      if (ratingIndex >= 0 && ratingIndex < 5) {
        distribution[ratingIndex]++;
      }
    });
    
    return [1, 2, 3, 4, 5].map((rating, index) => ({
      rating: `${rating} star${rating !== 1 ? 's' : ''}`,
      count: distribution[index]
    }));
  };
  
  // Get top authors
  const getTopAuthors = () => {
    const authorCounts: Record<string, number> = {};
    
    books.forEach((book) => {
      authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    });
    
    return Object.entries(authorCounts)
      .map(([author, count]) => ({ name: author, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };
  
  const ratingDistribution = getRatingDistribution();
  const topAuthors = getTopAuthors();
  
  const COLORS = ['#9b87f5', '#8B5CF6', '#7E69AB', '#1EAEDB', '#ea384c'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Reading Statistics</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-book-purple" />
              <span className="text-3xl font-bold">{statistics.totalBooks}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-3xl font-bold mr-2">{statistics.averageRating}</span>
              <StarRating rating={statistics.averageRating} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Favorite Author</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-6 w-6 mr-2 text-book-purple" />
              <div>
                <div className="text-xl font-medium">{statistics.favoriteAuthor}</div>
                {statistics.favoriteAuthorCount > 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {statistics.favoriteAuthorCount} book{statistics.favoriteAuthorCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {books.length > 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-book-purple" />
                Rating Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="rating" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#9b87f5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {topAuthors.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-book-purple" />
                  Top Authors
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topAuthors}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {topAuthors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {books.length === 0 && (
        <div className="mt-10 text-center py-16 bg-card rounded-lg border border-border">
          <BarChart2 size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No statistics available</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Add some books to your collection to see statistics.
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
