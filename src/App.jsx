import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./components/MovieDetails";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/movie/:id" element={<MovieDetails />}></Route>
    </Routes>
  );
};

export default App;
