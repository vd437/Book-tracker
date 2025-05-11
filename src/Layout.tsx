
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, BarChart2, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-book-light dark:bg-gray-900 transition-colors duration-300">
      {isAuthenticated && (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm py-4 transition-colors duration-300">
          <div className="container flex justify-between items-center">
            <Link 
              to="/" 
              className="text-book-purple dark:text-book-vivid text-2xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <BookOpen size={24} />
              My Reading Tracker
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <nav className="hidden md:flex space-x-4 mx-4">
                <NavLink to="/" current={location.pathname === "/"}>Home</NavLink>
                <NavLink to="/books" current={location.pathname.startsWith("/books")}>My Books</NavLink>
                <NavLink to="/stats" current={location.pathname === "/stats"}>Statistics</NavLink>
              </nav>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full h-9 w-9 overflow-hidden flex items-center justify-center bg-book-purple/10 dark:bg-book-vivid/20 hover:opacity-80 transition-opacity">
                    <Avatar>
                      <AvatarFallback className="bg-book-purple dark:bg-book-vivid text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-1 container my-6 animate-fade-in">
        {children}
      </main>
      
      {isAuthenticated && (
        <>
          <footer className="py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="container text-center text-sm text-gray-500 dark:text-gray-400">
              &copy; 2025 My Reading Tracker — Your personal book journal
            </div>
          </footer>
          
          {/* Mobile Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 transition-colors duration-300">
            <div className="flex justify-around">
              <MobileNavLink to="/" current={location.pathname === "/"} icon={<Home size={20} />} label="Home" />
              <MobileNavLink to="/books" current={location.pathname.startsWith("/books")} icon={<BookOpen size={20} />} label="Books" />
              <MobileNavLink to="/stats" current={location.pathname === "/stats"} icon={<BarChart2 size={20} />} label="Stats" />
              <MobileNavLink to="/account" current={location.pathname === "/account"} icon={<User size={20} />} label="Account" onClick={handleLogout} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  current: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, current }) => (
  <Link
    to={to}
    className={cn(
      "font-medium px-3 py-2 rounded-md transition-colors",
      current
        ? "text-book-purple dark:text-book-vivid bg-book-light dark:bg-gray-800"
        : "text-gray-600 dark:text-gray-300 hover:text-book-purple dark:hover:text-book-vivid hover:bg-gray-100 dark:hover:bg-gray-700"
    )}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  current: boolean;
  onClick?: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, icon, label, current, onClick }) => {
  if (onClick && label === "Account") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex flex-col items-center p-1 rounded-md transition-colors",
          current
            ? "text-book-purple dark:text-book-vivid"
            : "text-gray-500 dark:text-gray-400 hover:text-book-purple dark:hover:text-book-vivid"
        )}
      >
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </button>
    );
  }
  
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center p-1 rounded-md transition-colors",
        current
          ? "text-book-purple dark:text-book-vivid"
          : "text-gray-500 dark:text-gray-400 hover:text-book-purple dark:hover:text-book-vivid"
      )}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default Layout;
