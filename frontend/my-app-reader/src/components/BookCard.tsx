import React from "react";
import { useNavigate } from "react-router-dom";
export type Book = {
  id: number;
  authors: string;
  categories: string;
  description: string;
  downloadCount: number;
  gutenbergId: number;
  imageUrl: string;
  language : string;
  pagerankScore: number;
  textUrl: string;
  title: string;
  topWords: string[];
  wordCount: number;
}

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer glass snap-start w-[220px] min-w-[220px] max-w-[220px] 
                 rounded-xl p-4 flex flex-col h-[360px] hover:scale-105 transition-transform"
    >
      <div className="relative rounded-lg overflow-hidden flex-[0_0_80%]">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gray-700" />
        )}
      </div>

      <div className="mt-auto space-y-1 min-h-[80px]">
        <h4 className="font-semibold line-clamp-2">{book.title}</h4>
        <p className="text-sm text-slate-400 line-clamp-1">{book.authors}</p>
      </div>
    </div>
  );
}