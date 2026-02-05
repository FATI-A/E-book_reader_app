import React from "react";

export type Genre = { id: number; name: string };

export default function GenreChips({
  genres,
  onClickGenre,
}: {
  genres: Genre[];
  onClickGenre?: (g: Genre) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {genres.map((g) => (
        <button
          key={g.id}
          type="button"
          onClick={() => onClickGenre?.(g)}
          className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
