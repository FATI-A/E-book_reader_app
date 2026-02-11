import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";

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

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`http://localhost:8081/api/books/${id}`);
        if (!response.ok) throw new Error("Livre introuvable");

        const data: Book = await response.json();
        setBook(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  useEffect(() => {
    if (!book) return;

    fetch(`http://localhost:8081/api/books/${book.gutenbergId}/suggestions`)
      .then((res) => res.json())
      .then((data: Book[]) => setRecommendedBooks(data))
      .catch((err) => console.error("Erreur fetch recommandations:", err));
  }, [book]);

  if (loading) return <div>Chargement du livre...</div>;
  if (error || !book) {
    return (
      <div className="cardSimple">
        <h2>Livre introuvable</h2>
        <Link className="btnSecondary" to="/">Retour</Link>
      </div>
    );
  }

  return (
    <div className="book-details-page">
      <>
        <div className="backRow">
          <Link to="/" className="btnSecondary">← Retour</Link>
        </div>

        <section className="heroCard">
          <div className="heroGrid">
            <div className="coverWrap">
              <img className="coverImg" src={book.imageUrl} alt={`Couverture : ${book.title}`} />
            </div>

            <div className="heroContent">
              <div className="breadcrumb">
                <span className="crumbStrong">Bibliothèque</span>
                <span className="crumbSep">›</span>
                <span className="crumb">{book.categories}</span>
              </div>

              <h1 className="title">{book.title}</h1>
              <div className="byline">Par {book.authors}</div>

              <div className="metaRow">
                <div className="metaItem">
                  <div className="metaLabel">Téléchargements</div>
                  <div className="metaValue">{book.downloadCount}</div>
                </div>
                <div className="metaItem">
                  <div className="metaLabel">Langue</div>
                  <div className="metaValue">{book.language}</div>
                </div>
              </div>

              <div className="ctaRow">
                <button
                  className="btnPrimary"
                  type="button"
                  onClick={() => navigate("/bookcontent", { state: { id: book.gutenbergId } })}
                >
                  <PlayIcon />
                  Lire le Livre
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="aboutCard mb-16">
          <h2 className="aboutTitle">À propos du livre</h2>
          <p className="aboutText">{book.description}</p>
        </section>

        <section className="mt-50 px-6">
          <h3 className="text-2xl font-bold mb-4">Vous pouvez aimé aussi</h3>
          <div className="relative">
            <button
              onClick={() => {
                const container = document.getElementById("recommendedBooks");
                if (container) container.scrollBy({ left: -250, behavior: "smooth" });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white text-3xl p-4 rounded-full hover:bg-white/40 transition"
            >
              ◀
            </button>

            <div
              id="recommendedBooks"
              className="flex gap-4 scroll-smooth pb-4 overflow-x-auto"
            >
              <div className="flex-none w-4 md:w-6 lg:w-8"></div>

              {recommendedBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => console.log("Livre cliqué :", book.title)}
                  className="glass rounded-xl p-2 hover:scale-105 transition-transform flex-none"
                >
                  <BookCard book={book} />
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const container = document.getElementById("recommendedBooks");
                if (container) container.scrollBy({ left: 250, behavior: "smooth" });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white text-3xl p-4 rounded-full hover:bg-white/40 transition"
            >
              ▶
            </button>
          </div>
        </section>
      </>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l12-7-12-7z" fill="currentColor" />
    </svg>
  );
}