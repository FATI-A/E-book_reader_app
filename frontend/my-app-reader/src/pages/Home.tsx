import React, { useMemo, useState } from "react";
import booksDataJson from "../data/books.json";
import genresDataJson from "../data/genres.json";

import HeaderBar from "../components/HeaderBar";
import SearchBar from "../components/SearchBar";
import SectionHeader from "../components/SectionHeader";
import GenreChips from "../components/GenreChips";
import type { Genre } from "../components/GenreChips";
import BooksGrid from "../components/BooksGrid";
import type { Book } from "../components/BookCard";

export default function Home() {
  const [search, setSearch] = useState("");

  const safeBooks = useMemo(() => {
    const raw = booksDataJson as any;
    return {
      newReleases: (raw?.newReleases ?? []) as Book[],
      recommended: (raw?.recommended ?? []) as Book[],
    };
  }, []);

  const safeGenres = useMemo(() => {
    const raw = genresDataJson as any;
    return (Array.isArray(raw) ? raw : []) as Genre[];
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return safeBooks;

    const filterBooks = (arr: Book[]) =>
      arr.filter(
        (b) =>
          (b?.title ?? "").toLowerCase().includes(q) ||
          (b?.author ?? "").toLowerCase().includes(q)
      );

    return {
      newReleases: filterBooks(safeBooks.newReleases),
      recommended: filterBooks(safeBooks.recommended),
    };
  }, [search, safeBooks]);

  return (
    <div className="min-h-screen bg-white bg-white text-base sm:text-[17px] lg:text-[18px]">
      {/* full width */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <HeaderBar />
        <SearchBar value={search} onChange={setSearch} />

        <section className="mt-8">
          <SectionHeader title="Popular genre" />
          <GenreChips genres={safeGenres} />
        </section>

        <section className="mt-10">
          <SectionHeader title="New releases" />
          <BooksGrid books={filtered.newReleases} />
        </section>

        <section className="mt-10 pb-10">
          <SectionHeader title="Recommended releases" />
          <BooksGrid books={filtered.recommended} />
        </section>

        {filtered.newReleases.length === 0 && filtered.recommended.length === 0 && (
          <p className="mt-6 text-sm text-gray-500">
            Aucun livre trouvé. Vérifie le format de <code>books.json</code>.
          </p>
        )}
      </div>
    </div>
  );
}
