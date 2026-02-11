import React, { useEffect, useState } from "react";
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

const AllBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageSize = 12;

    useEffect(() => {
        fetch(`http://localhost:8081/api/books/all?page=${page}&size=${pageSize}`)
            .then((res) => res.json())
            .then((data) => {
                setBooks(Array.isArray(data.content) ? data.content : []);
                setTotalPages(data.totalPages ?? 0);
            })
            .catch((err) => console.error("Erreur fetch all books:", err));
    }, [page]);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">

            <div className="bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 text-center relative">

                {/* Bouton Retour */}
                <button
                    onClick={() => window.history.back()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition"
                >
                    ← Retour
                </button>

                <h2 className="text-3xl font-bold">Tous les livres</h2>
                <p className="text-slate-300 mt-2">Explore notre collection complète de livres.</p>
            </div>

            {books.length === 0 ? (
                <p>Chargement des livres...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 px-4 mt-30">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                        >
                            <div className="h-60 overflow-hidden rounded-t-2xl">
                                <img
                                    src={book.imageUrl || "https://via.placeholder.com/300x400?text=No+Image"}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 flex flex-col justify-between h-40">
                                <div>
                                    <h3 className="text-lg font-semibold line-clamp-2">{book.title}</h3>
                                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">{book.authors}</p>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-slate-300 line-clamp-3">{book.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="px-4 py-2 bg-indigo-600 rounded disabled:opacity-50 hover:bg-indigo-500 transition"
                >
                    Précédent
                </button>

                <span className="px-4 py-2">
                    Page {page + 1} / {totalPages}
                </span>

                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 bg-indigo-600 rounded disabled:opacity-50 hover:bg-indigo-500 transition"
                >
                    Suivant
                </button>
            </div>

        </div>
    );
};

export default AllBooks;