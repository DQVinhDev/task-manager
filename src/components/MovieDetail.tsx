import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import styles from "./Movie.module.css";

interface MovieDetailData {
  movie: {
    name: string;
    origin_name: string;
    content: string;
    thumb_url: string;
    poster_url: string;
    year: number;
    actor: string[];
    director: string[];
    category: { name: string }[];
    country: { name: string }[];
    episode_current: string;
    episode_total: string;
    time: string;
    quality: string;
    lang: string;
  };
  episodes: {
    server_name: string;
    server_data: {
      name: string;
      slug: string;
      filename: string;
      link_embed: string;
      link_m3u8: string;
    }[];
  }[];
}

const MovieDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movieData, setMovieData] = useState<MovieDetailData | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await axios.get(`https://phimapi.com/phim/${slug}`);
        console.log("API Response:", response.data); // Thêm dòng này
        setMovieData(response.data);
        if (response.data.episodes[0]?.server_data[0]) {
          setSelectedEpisode(
            response.data.episodes[0].server_data[0].link_m3u8
          );
        }
      } catch (error) {
        console.error("Error fetching movie detail:", error);
      }
    };

    if (slug) {
      fetchMovieDetail();
    }
  }, [slug]);

  if (!movieData) {
    return <div>Loading...</div>;
  }

  console.log("Movie Data:", movieData); // Thêm dòng này

  const { movie, episodes } = movieData;

  return (
    <div className={styles.movieDetail}>
      <h2>{movie.name}</h2>
      <div className={styles.movieDetailContent}>
        <div className={styles.posterColumn}>
          <img
            src={movie.poster_url}
            alt={movie.name}
            className={styles.detailPoster}
          />
        </div>
        <div className={styles.infoColumn}>
          <p>
            <strong>Tên gốc:</strong> {movie.origin_name}
          </p>
          <p>
            <strong>Năm:</strong> {movie.year}
          </p>
          <p>
            <strong>Thể loại:</strong>{" "}
            {movie.category.map((c) => c.name).join(", ")}
          </p>
          <p>
            <strong>Quốc gia:</strong>{" "}
            {movie.country.map((c) => c.name).join(", ")}
          </p>
          <p>
            <strong>Diễn viên:</strong> {movie.actor.join(", ")}
          </p>
          <p>
            <strong>Đạo diễn:</strong> {movie.director.join(", ")}
          </p>
          <p>
            <strong>Tập hiện tại:</strong> {movie.episode_current}
          </p>
          <p>
            <strong>Tổng số tập:</strong> {movie.episode_total}
          </p>
          <p>
            <strong>Thời lượng:</strong> {movie.time}
          </p>
          <p>
            <strong>Chất lượng:</strong> {movie.quality}
          </p>
          <p>
            <strong>Ngôn ngữ:</strong> {movie.lang}
          </p>
        </div>
      </div>
      <p>
        <strong>Nội dung:</strong> {movie.content}
      </p>
      {episodes.map((server, index) => (
        <div key={index}>
          <h3>{server.server_name}</h3>
          <div className={styles.episodeList}>
            {server.server_data.map((episode, episodeIndex) => (
              <button
                key={episodeIndex}
                onClick={() => setSelectedEpisode(episode.link_m3u8)}
                className={styles.episodeButton}
              >
                {episode.name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedEpisode && (
        <div className={styles.playerWrapper}>
          <ReactPlayer
            url={selectedEpisode}
            controls
            width="100%"
            height="100%"
            className={styles.reactPlayer}
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
