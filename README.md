# Read, Rate, Reflect

**Read, Rate, Reflect** is a simple and organized web application designed to help users track books they've read, rate them, and write personal notes. You can [experience the live demo here](https://preview-4f4b8fe3--read-rate-reflect.lovable.app/). The app features a clean and user-friendly interface, allowing users to manage their reading journey smoothly and comfortably.

## Features

- **Add a book**: Enter the book title, author, rating (1-5 stars), and personal notes.
- **View book list**: Browse all added books in a simple, organized list displaying basic details.
- **View book details**: Click on any book to view its complete information including notes.
- **Edit or delete book**: Easily modify or remove books from your collection.
- **Responsive design**: Compatible with all devices (desktop, tablet, mobile).
- **Local storage**: User data is saved in **localStorage** to ensure retrieval when reopening the app.

## Project Structure

The project consists of several main directories containing subfolders for organizing code and components:

- **public**: Public files like favicon and image assets.
- **src**: Source files including:
  - **components**: Reusable UI components.
  - **context**: State management via context.
  - **hooks**: Custom helper hooks.
  - **lib**: Additional utility libraries.
  - **pages**: Core application pages.
  - **services**: Data or API handling services.
  - **types**: Type definitions (TypeScript).
  - Main files like: `App.tsx`, `main.tsx`, `index.css`, etc.

## Technologies Used

| Technology      | Description                                  |
|----------------|--------------------------------------------|
| TypeScript      | JavaScript-based language with type support |
| React (JSX)     | JavaScript library for building user interfaces |
| Vite            | Fast build tool and development server     |
| Tailwind CSS    | Utility-first CSS framework for design     |
| shadcn-ui       | UI component library                      |
| CSS             | For styling and design                    |

## How to Run

To run the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vd437/Book-tracker.git
