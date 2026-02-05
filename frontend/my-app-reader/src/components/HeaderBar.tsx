import React from "react";
import { Home as HomeIcon, UserCircle2 } from "lucide-react";

export default function HeaderBar() {
  return (
    <header className="flex items-center justify-between py-5">
      <button
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow transition"
        aria-label="Home"
      >
        <HomeIcon className="h-6 w-6 text-gray-700" />
      </button>

      <h1 className="text-xl sm:text-2xl font-semibold tracking-wide">
        E-READER BOOK
      </h1>

      <button
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-sm hover:opacity-90 transition"
        aria-label="Profile"
      >
        <UserCircle2 className="h-6 w-6" />
      </button>
    </header>
  );
}
