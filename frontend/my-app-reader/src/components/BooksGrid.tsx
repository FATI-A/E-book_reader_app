import React from "react";
import BookCard from "./BookCard";
import type { Book } from "./BookCard";

export default function BooksGrid({ books }: { books: Book[] }) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {books.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
}
