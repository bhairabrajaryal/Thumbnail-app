
import React from 'react';
import type { Thumbnail } from '../types';
import { DownloadIcon } from './icons';

interface ThumbnailCardProps {
  thumbnail: Thumbnail;
}

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ thumbnail }) => {
  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // We can't use fetch for cross-origin images to create a blob URL,
    // so we rely on the download attribute. For modern browsers, this is sufficient.
    // For older browsers or strict CORS policies, this might open the image in a new tab.
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-brand-dark-gray shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2">
      <img
        src={thumbnail.url}
        alt={`${thumbnail.resolution} thumbnail`}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-xl font-bold text-white text-center mb-2">{thumbnail.resolution}</h3>
        <a
          href={thumbnail.url}
          download={thumbnail.filename}
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Download</span>
        </a>
      </div>
       <div className="absolute bottom-0 left-0 bg-black/50 text-white px-3 py-1 text-sm font-semibold group-hover:opacity-0 transition-opacity duration-300">
          {thumbnail.resolution}
      </div>
    </div>
  );
};

export default ThumbnailCard;
