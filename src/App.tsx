import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import TaskManager from "./components/TaskManager";
import ChatGPTButton from "./components/GoogleGeminiButton";
import PomodoroTimer from "./components/PomodoroTimer";
import SlideCardGallery from "./components/SlideCardGallery";
import ThemeToggle from "./components/ThemeToggle";
import Movie from "./components/Movie";
import MovieDetail from "./components/MovieDetail";
import "./App.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
  };
  alt_description: string;
  user?: {
    name: string;
  };
}

const App: React.FC = () => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("https://api.unsplash.com/photos", {
          params: {
            client_id: "FiwsnNGLpExnTJ833sQ6dSSjpvCFglp-FoPnCEGCWCg",
            per_page: 20,
          },
        });
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-theme" : "light-theme";
  }, [isDarkMode]);

  const slideData = images.map((image) => ({
    imageUrl: image.urls.raw,
    title: image.alt_description || "Untitled",
    description: `Photo by ${image.user?.name || "Unknown"}`, // Adjusted description
  }));

  return (
    <Router>
      <div className={`app ${isDarkMode ? "dark-theme" : "light-theme"}`}>
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <div className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-center mb-4">My App</h1>
          <nav className="my-4">
            <NavLink to="/" className="mr-4">
              Home
            </NavLink>
            <NavLink to="/tasks" className="mr-4">
              Task Manager
            </NavLink>
            <NavLink to="/pomodoro" className="mr-4">
              Pomodoro
            </NavLink>
            <NavLink to="/chatgpt" className="mr-4">
              Asking
            </NavLink>
            <NavLink to="/gallery" className="mr-4">
              Gallery
            </NavLink>
            <NavLink to="/movie" className="mr-4">
              Movie
            </NavLink>
          </nav>
          <Routes>
            <Route path="/" element={<h2>Welcome to My App</h2>} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route path="/chatgpt" element={<ChatGPTButton />} />
            <Route
              path="/gallery"
              element={<SlideCardGallery initialSlides={slideData} />}
            />
            <Route path="/movie" element={<Movie />} />
            <Route path="/movie/:slug" element={<MovieDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
