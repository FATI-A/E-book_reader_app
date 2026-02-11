import React from "react";
import SearchBar from "./SearchBar";

interface HeaderBarProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchResults?: (books: any[]) => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  isDarkMode,
  setIsDarkMode,
  setSearchResults,
}) => {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-indigo-400">E-READER BOOK</h1>
        <SearchBar onResults={setSearchResults || (() => {})} />

        <label className="relative inline-flex items-center cursor-pointer ml-4">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
            className="sr-only"
          />
          <div
            className={`w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors ${
              isDarkMode ? "bg-indigo-600" : "bg-gray-300"
            }`}
          ></div>
          <span
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
              isDarkMode ? "translate-x-6" : "translate-x-0"
            }`}
          ></span>
        </label>

        <div className="w-[112px]" />
      </div>
    </header>
  );
};

export default HeaderBar;