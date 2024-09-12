import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Movie.module.css";

interface MovieItemNew {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  modified: {
    time: string;
  };
}

interface MovieItemOld {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  category: { id: string; name: string; slug: string }[];
  country: { id: string; name: string; slug: string }[];
  type: string;
  episode_current: string;
  quality: string;
  lang: string;
  time: string;
}

type MovieItem = MovieItemNew | MovieItemOld;

interface ApiResponseNew {
  status: boolean;
  items: MovieItemNew[];
}

interface ApiResponseOld {
  status: string;
  data: {
    items: MovieItemOld[];
    params: {
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
      };
    };
  };
}

type CategoryType = "moi-cap-nhat" | "phim-le" | "phim-bo" | "hoat-hinh";

const Movie: React.FC = () => {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentCategory, setCurrentCategory] =
    useState<CategoryType>("moi-cap-nhat");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMovies(currentCategory, currentPage);
  }, [currentCategory, currentPage]);

  const fetchMovies = async (category: CategoryType, page: number) => {
    setIsLoading(true);
    try {
      let url = "";
      switch (category) {
        case "moi-cap-nhat":
          url = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`;
          break;
        case "phim-le":
          url = `https://phimapi.com/v1/api/danh-sach/phim-le?page=${page}`;
          break;
        case "phim-bo":
          url = `https://phimapi.com/v1/api/danh-sach/phim-bo?page=${page}`;
          break;
        case "hoat-hinh":
          url = `https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=${page}`;
          break;
      }
      //console.log("Fetching from URL:", url);
      const response = await axios.get(url);
      //console.log("API Response:", response.data);

      if (category === "moi-cap-nhat") {
        const data = response.data as ApiResponseNew;
        if (data.status && Array.isArray(data.items)) {
          setMovies(data.items);
          setTotalPages(1);
        }
      } else {
        const data = response.data as ApiResponseOld;
        if (data.status === "success" && Array.isArray(data.data.items)) {
          setMovies(data.data.items);
          setTotalPages(data.data.params.pagination.totalPages);
        }
      }
      //console.log("Movies set:", movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchMovies = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(
          searchKeyword
        )}&limit=20`
      );
      const data = response.data as ApiResponseOld;
      if (data.status === "success" && Array.isArray(data.data.items)) {
        setMovies(data.data.items);
      } else {
        console.error("Invalid search response format:", data);
        setMovies([]);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: CategoryType) => {
    setCurrentCategory(category);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const renderMovieItem = (movie: MovieItem) => {
    const isNewFormat = "modified" in movie;
    let posterUrl;

    if (isNewFormat) {
      posterUrl = movie.poster_url;
    } else {
      // Đối với định dạng cũ (phim lẻ, phim bộ, hoạt hình)
      posterUrl = movie.poster_url.startsWith("http")
        ? movie.poster_url
        : `https://phimimg.com/${movie.poster_url}`;
    }


    return (
      <Link
        to={`/movie/${movie.slug}`}
        key={movie._id}
        className={styles.movieItem}
      >
        <img 
          src={posterUrl.startsWith("http") ? posterUrl : `https://phimimg.com/${posterUrl}`} 
          alt={movie.name} 
          className={styles.moviePoster} 
        />
        <h3>{movie.name}</h3>
        <p>{movie.origin_name}</p>
        <p>Năm: {movie.year}</p>
        {!isNewFormat && (
          <>
            <p>Thể loại: {movie.category.map((c) => c.name).join(", ")}</p>
            <p>Quốc gia: {movie.country.map((c) => c.name).join(", ")}</p>
            <p>Tập: {movie.episode_current}</p>
            <p>Chất lượng: {movie.quality}</p>
            <p>Ngôn ngữ: {movie.lang}</p>
            <p>Thời lượng: {movie.time}</p>
          </>
        )}
      </Link>
    );
  };

  return (
    <div className={styles.movieContainer}>
      <div className={styles.headBarContainer}>
        <div className={styles.searchContainer}>
          <form onSubmit={searchMovies} className={styles.searchForm}>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Tìm kiếm
            </button>
          </form>
        </div>

        <div className={styles.categoryButtons}>
          <button onClick={() => handleCategoryChange("moi-cap-nhat")}>
            Mới cập nhật
          </button>
          <button onClick={() => handleCategoryChange("phim-le")}>
            Phim lẻ
          </button>
          <button onClick={() => handleCategoryChange("phim-bo")}>
            Phim bộ
          </button>
          <button onClick={() => handleCategoryChange("hoat-hinh")}>
            Hoạt hình
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Đang tải...</div>
        ) : movies.length > 0 ? (
          <div className={styles.movieList}>{movies.map(renderMovieItem)}</div>
        ) : (
          <div>Không có phim nào được tìm thấy.</div>
        )}
      </div>

      <div className={styles.pagination}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default Movie;
