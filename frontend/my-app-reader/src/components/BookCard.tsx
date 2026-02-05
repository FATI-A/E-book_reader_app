import React from "react";
import { Card, CardContent } from "./ui/card";

export type Book = {
  id: number;
  title: string;
  author: string;
  cover: string;
};

export default function BookCard({ book }: { book: Book }) {
  return (
    <Card className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="p-3">
        <div className="relative overflow-hidden rounded-xl bg-gray-100">
          <div className="aspect-[3/4] w-full">
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        <div className="mt-3">
          <p className="line-clamp-1 text-base font-semibold text-gray-900">
            {book.title}
          </p>
          <p className="mt-1 line-clamp-1 text-sm font-medium text-gray-500">
            {book.author}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
