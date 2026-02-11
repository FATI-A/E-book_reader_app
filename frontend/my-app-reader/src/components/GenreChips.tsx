import React from "react";

interface GenreChipsProps {
  genres: { id: number; name: string }[];
}

const GenreChips: React.FC<GenreChipsProps> = ({ genres }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {genres.map((genre) => (
        <span
          key={genre.id}
          className="glass px-4 py-2 rounded-full cursor-pointer"
        >
          {genre.name}
        </span>
      ))}
    </div>
  );
};

export default GenreChips;