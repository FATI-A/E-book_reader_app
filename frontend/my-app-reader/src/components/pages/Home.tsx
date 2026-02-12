import React, { useEffect, useState } from "react";
import BookCard from "../BookCard";
import HeaderBar from "../HeaderBar";
import { useNavigate } from "react-router-dom";

interface Book {
  id: number;
  authors: string;
  categories: string;
  description: string;
  downloadCount: number;
  gutenbergId: number;
  imageUrl: string;
  language: string;
  pagerankScore: number;
  textUrl: string;
  title: string;
  topWords: string[];
  wordCount: number;
}

const Home: React.FC = () => {
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [categoryBooks, setCategoryBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/api/books/top-categories")
      .then((res) => res.json())
      .then((data: [string, number][]) => {
        console.log("Catégories reçues :", data);
        const topGenres = data.slice(0, 8).map((c) => c[0]);
        setGenres(topGenres);

        if (topGenres.length > 0) {
          setSelectedCategory(topGenres[0]);
          fetchCategoryBooks(topGenres[0]);
        }
      })
      .catch((err) => console.error("Erreur fetch top categories:", err));

    fetch("http://localhost:8081/api/books/popular")
      .then((res) => res.json())
      .then((data) => setPopularBooks(data))
      .catch((err) => console.error("Erreur fetch popular books:", err));
  }, []);

  const fetchCategoryBooks = (categoryName: string) => {
    setSelectedCategory(categoryName);
    fetch(`http://localhost:8081/api/books/category/${categoryName}`)
      .then((res) => res.json())
      .then((data) => setCategoryBooks(data))
      .catch((err) => console.error("Erreur fetch category books:", err));
  };


  return (
    <div
  className="min-h-screen text-white"
>
      {/* NAVBAR */}
      <HeaderBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}
        setSearchResults={setSearchResults} />

      <main className="max-w-7xl mx-auto p-6 space-y-12">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-5xl font-extrabold mb-4">
              Ton prochain coup de cœur t’attend
            </h2>
            <p className="text-slate-300 mb-6">
              Parcours les nouveautés, découvre des recommandations personnalisées et explore par genre.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/allbooks")}
                className="bg-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-500"
              >
                Explorer
              </button>
            </div>

          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80"
              className="w-full"
            />
          </div>
        </section>

        {searchResults.length > 0 && (
          <section className="mt-6 relative">
            <h3 className="text-2xl font-bold mb-4">Résultats de recherche</h3>

            <button
              onClick={() => {
                const container = document.getElementById("searchResults");
                if (container) container.scrollBy({ left: -250, behavior: "smooth" });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white text-3xl p-4 rounded-full hover:bg-white/40 transition"
            >
              ◀
            </button>
            <div
              id="searchResults"
              className="flex gap-4 overflow-x-hidden pb-4 scroll-smooth"
            >
              {searchResults.map((book) => (
                <div key={book.id} className="glass rounded-xl p-2 hover:scale-105 transition-transform flex-none">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const container = document.getElementById("searchResults");
                if (container) container.scrollBy({ left: 250, behavior: "smooth" });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white text-3xl p-4 rounded-full hover:bg-white/40 transition"
            >
              ▶
            </button>
          </section>
        )}
        {/* GENRES */}
        <section>
          <h3 className="text-2xl font-bold mb-4">Explorer par genre</h3>
          <div className="flex gap-3">
            {genres.map((genre, idx) => (
              <button
                key={idx}
                onClick={() => fetchCategoryBooks(genre)}
                className="flex-1 min-w-[160px] glass px-4 py-2 rounded-full cursor-pointer hover:bg-indigo-600 transition text-center break-words"

              >
                {genre}
              </button>
            ))}
          </div>
        </section>
        {categoryBooks.length > 0 && (
          <section className="mt-6">
            <h3 className="text-2xl font-bold mb-4"> Livres dans la catégorie {selectedCategory}</h3>
            <div className="relative">
              <button
                onClick={() => {
                  const container = document.getElementById("categoryBooks");
                  if (container) container.scrollBy({ left: -250, behavior: "smooth" });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white text-3xl p-4 rounded-full hover:bg-white/40 transition"
              >
                ◀
              </button>

              <div
                id="categoryBooks"
                className="flex gap-4 scroll-smooth pb-4 overflow-x-hidden"
              >
                {categoryBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => console.log("Livre cliqué :", book.title)}
                    className="glass rounded-xl p-2 hover:scale-105 transition-transform flex-none"
                  >
                    <BookCard book={book} />
                  </button>
                ))}
              </div>

              {/* Bouton droit */}
              <button
                onClick={() => {
                  const container = document.getElementById("categoryBooks");
                  if (container) container.scrollBy({ left: 250, behavior: "smooth" });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white text-3xl p-4 rounded-full hover:bg-white/40 transition"
              >
                ▶
              </button>
            </div>
          </section>
        )}

        {/* Populaire */}
        <section>
          <h3 className="text-2xl font-bold mb-4">Populaire</h3>
          <div className="relative">
            <button
              onClick={() => {
                const container = document.getElementById("popularBooks");
                if (container) container.scrollBy({ left: -250, behavior: "smooth" });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white text-3xl p-4 rounded-full hover:bg-white/40 transition"
            >
              ◀
            </button>

            <div
              id="popularBooks"
              className="flex gap-4 scroll-smooth pb-4 overflow-x-hidden"
            >
              {popularBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => console.log("Livre cliqué :", book.title)}
                  className="glass rounded-xl p-2 hover:scale-105 transition-transform"
                >
                  <BookCard book={book} />
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const container = document.getElementById("popularBooks");
                if (container) container.scrollBy({ left: 250, behavior: "smooth" });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white text-3xl p-4 rounded-full hover:bg-white/40 transition"
            >
              ▶
            </button>
          </div>
        </section>


        {/* NEWSLETTER */}
        <section className="glass rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Recevoir les nouveautés</h3>
          <p className="text-slate-300 mb-4">
            Inscris-toi pour recevoir nos recommandations chaque semaine.
          </p>
          <div className="flex justify-center gap-2">
            <input
              type="email"
              placeholder="ton@email.com"
              className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700"
            />
            <button className="bg-indigo-600 px-4 py-2 rounded-xl">S’inscrire</button>
          </div>
        </section>
      </main>

      <footer className="text-center text-slate-400 py-8">
        © 2026 BookFlow • Design moderne pour app de livres
      </footer>
    </div>
  );
};

export default Home;