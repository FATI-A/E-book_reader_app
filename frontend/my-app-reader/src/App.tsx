import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import BookDetailsPage from "./components/BookDetailsPage";
import BookContentPage from "./components/BookContentPage";
import AllBooks from "./components/AllBook";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books/:id" element={<BookDetailsPage />} />
      <Route path="/bookcontent" element={<BookContentPage />} />
       <Route path="/allbooks" element={<AllBooks />} />
    </Routes>
  );
}

export default App
