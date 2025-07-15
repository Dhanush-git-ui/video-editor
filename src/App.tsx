import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CinematicPortfolio from './components/CinematicPortfolio';
import VideoGalleryShowcase from './components/VideoGalleryShowcase';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CinematicPortfolio />} />
        <Route path="/gallery" element={<VideoGalleryShowcase />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;