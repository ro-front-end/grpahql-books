import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "../components/topbar/navBar";
import BooksList from "../components/books/booksList";
import Hero from "../components/hero";

function App() {
  return (
    <>
      <div className="p-4 bg-[#f6f6f6] ">
        <NavBar />
        <Routes>
          <Route path="/books-list" element={<BooksList />} />
          <Route path="/" element={<Hero />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
