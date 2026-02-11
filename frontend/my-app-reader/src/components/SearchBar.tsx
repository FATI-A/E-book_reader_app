import React, { useState, useEffect } from "react";

const isRegex = (value: string) => {
  const regexSpecialChars = /[.*+?^${}()|[\]\\]/;

  if (!regexSpecialChars.test(value)) return false;
  try {
    new RegExp(value);
    return true;
  } catch {
    return false;
  }
};

const SearchBar: React.FC<{ onResults: (books: any[]) => void }> = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [dictionary, setDictionary] = useState<any>(null);

  // useEffect(() => {
  //   fetch(
  //     "https://app.unpkg.com/typo-js@1.2.4/dictionaries/en_US/en_US.aff"
  //   )
  //     .then((res) => res.text())
  //     .then((affData) => {
  //       fetch(
  //         "https://app.unpkg.com/typo-js@1.2.4/dictionaries/en_US/en_US.dic"
  //       )
  //         .then((res) => res.text())
  //         .then((dicData) => {
  //           const dict = new Typo("en_US", affData, dicData, {
  //             platform: "any",
  //           });
  //           setDictionary(dict);
  //         });
  //     });
  // }, []);

  const handleSearch = async (value: string) => {
    const encoded = encodeURIComponent(value);

    const url = isRegex(value)
      ? `http://localhost:8081/api/books/search-regex?expression=${encoded}`
      : `http://localhost:8081/api/books/search?keyword=${encoded}`;

    
    try {
      const res = await fetch(url);
      const data = await res.json();
      onResults(data);

      if (dictionary && value.length > 0) {
        const words = dictionary.suggest(value);
        setSuggestions(words.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Erreur recherche :", err);
      onResults([]);
      setSuggestions([]);
    }
  };

  const handleSelect = (word: string) => {
    setQuery(word);
    setSuggestions([]);
    handleSearch(word);
  }; // <-- ajoute cette accolade fermante

  return (
    <div className="relative w-full max-w-xl">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);

          if (value.length > 2) {
            handleSearch(value);
          } else {
            onResults([]);
            setSuggestions([]);
          }
        }}
        placeholder="Rechercher un livre, auteur ou genre..."
        className="w-full px-4 py-2 pl-10 rounded-xl bg-slate-900/60 
                   border border-slate-700 focus:outline-none 
                   focus:ring-2 focus:ring-indigo-500"
      />

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white text-black rounded-xl shadow-lg mt-1 z-10">
          {suggestions.map((word, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(word)}
            >
              {word}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;