import React, { useState } from 'react';
import axios from 'axios';
import SlideCard from './SlideCard';
import styles from './SlideCardGallery.module.css';

interface SlideData {
  imageUrl: string;
  title: string;
  description: string;
}

interface SlideCardGalleryProps {
  initialSlides: SlideData[];
}

const SlideCardGallery: React.FC<SlideCardGalleryProps> = ({ initialSlides }) => {
  const [slides, setSlides] = useState<SlideData[]>(initialSlides);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const slidesPerPage = 1;

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const getImages = async () => {
    try {
      const response = await axios.get('https://api.unsplash.com/photos', {
        params: {
          client_id: 'FiwsnNGLpExnTJ833sQ6dSSjpvCFglp-FoPnCEGCWCg',
          per_page: 50
        }
      });
      const newSlides = response.data.map((image: any) => ({
        imageUrl: image.urls.raw,
        title: image.alt_description || 'Untitled',
        description: `Photo by ${image.user?.name || 'Unknown'}`
      }));
      setSlides(newSlides);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const searchCollections = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get('https://api.unsplash.com/search/collections', {
        params: {
          client_id: 'FiwsnNGLpExnTJ833sQ6dSSjpvCFglp-FoPnCEGCWCg',
          query: searchQuery,
          page: 1
          
        }   
      });
      const newSlides = response.data.results.map((collection: any) => ({
        imageUrl: collection.cover_photo.urls.raw,
        title: collection.title,
        description: `Collection by ${collection.user.name}`
      }));
      setSlides(newSlides);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error searching collections:', error);
    }
  };

  const currentSlide = slides[currentPage];

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.controlsContainer}>
        <button onClick={getImages} className={styles.getImagesButton}>
          Get Images
        </button>
        <form onSubmit={searchCollections} className={styles.searchForm}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </div>
      <div className={styles.slideContainer}>
        {currentSlide && (
          <SlideCard
            imageUrl={`${currentSlide.imageUrl}&w=1200&h=800&fit=crop`}
            title={currentSlide.title}
            description={currentSlide.description}
          />
        )}
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={prevPage} disabled={currentPage === 0} className={styles.navButton}>
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === slides.length - 1}
          className={styles.navButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SlideCardGallery;