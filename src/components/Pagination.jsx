import { useEffect, useState } from "react";
import api from "../config/axios/axios";
import Spinner from "./Spinner";

const Pagination = ({
  setMovieList,
  movieListRef,
  currentPage,
  setCurrentPage,
  setSearchParams,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = 500;

  const fetchData = async (page) => {
    setIsLoading(true);

    try {
      if (page) {
        const endpoint = `discover/movie?sort_by=popularity.desc&page=${page}`;

        const response = await api.get(endpoint);
        const data = response.data;

        console.log(data);
        if (data.Response === "False") {
          setErrorMessage(data.Error || "Error fetching movies from the API");
          setMovieList([]);
          return;
        }

        //success
        setMovieList(data.results || []);
      }
    } catch (error) {
      console.error("Error fetching movies: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
    console.log(currentPage);
  }, [currentPage]);

  const goToPage = (page) => {
    setCurrentPage(page);
    setSearchParams({ page });
    setTimeout(() => {
      if (movieListRef.current) {
        movieListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="pagination">
          <div className="symbol">
            <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
              ⏮
            </button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              ◀
            </button>
          </div>
          <div className="pages">
            <button className="text-md font-bold text-white">
              {currentPage ? currentPage : "1"}
            </button>
          </div>
          <div className="symbol">
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              ▶
            </button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
              ⏭
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Pagination;
