
import React, { useState, useCallback } from 'react';
import { Thumbnail } from './types';
import { extractVideoId } from './utils/youtube';
import ThumbnailCard from './components/ThumbnailCard';
import { YouTubeIcon, LinkIcon, ErrorIcon, LoadingIcon, CopyIcon, CheckIcon, DownloadIcon } from './components/icons';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [thumbnails, setThumbnails] = useState<Thumbnail[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isBatchDownloading, setIsBatchDownloading] = useState<boolean>(false);

  const handleCopyUrl = useCallback(async () => {
    if (!url || isCopied) return;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  }, [url, isCopied]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a YouTube URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setThumbnails(null);

    // Simulate a short delay for better UX
    setTimeout(() => {
      const videoId = extractVideoId(url);

      if (videoId) {
        const resolutions = [
          { name: 'Maximum', code: 'maxresdefault' },
          { name: 'Standard Definition', code: 'sddefault' },
          { name: 'High Quality', code: 'hqdefault' },
          { name: 'Medium Quality', code: 'mqdefault' },
          { name: 'Default', code: 'default' },
        ];

        const generatedThumbnails: Thumbnail[] = resolutions.map(res => ({
          resolution: res.name,
          url: `https://img.youtube.com/vi/${videoId}/${res.code}.jpg`,
          filename: `thumbnail-${videoId}-${res.code}.jpg`
        }));
        
        setThumbnails(generatedThumbnails);
      } else {
        setError('Invalid YouTube URL. Please check the link and try again.');
        setThumbnails(null);
      }
      setIsLoading(false);
    }, 500);
  }, [url]);

  const handleBatchDownload = async () => {
    if (!thumbnails || isBatchDownloading) return;
    
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    setIsBatchDownloading(true);

    for (const thumb of thumbnails) {
        try {
            const link = document.createElement('a');
            link.href = thumb.url;
            link.download = thumb.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            await sleep(300); // Add a small delay between downloads
        } catch (err) {
            console.error(`Failed to download ${thumb.filename}:`, err);
        }
    }
    setIsBatchDownloading(false);
  };


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 selection:bg-brand-red selection:text-white">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <YouTubeIcon className="w-20 h-20 text-brand-red" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Thumbnail Downloader
            </h1>
          </div>
          <p className="text-lg text-brand-light-gray max-w-2xl mx-auto">
            Paste any YouTube video link below to instantly generate and download its thumbnail in all available resolutions.
          </p>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LinkIcon className="w-6 h-6 text-brand-light-gray" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="w-full bg-brand-dark-gray border-2 border-transparent focus:border-brand-red focus:ring-brand-red rounded-lg py-4 pl-12 pr-[210px] text-lg text-white placeholder-gray-500 transition-all duration-300 ease-in-out"
              />
              <div className="absolute inset-y-0 right-0 flex items-center p-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  disabled={!url || isLoading || isCopied}
                  className="flex items-center justify-center h-full aspect-square text-brand-light-gray rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                  aria-label="Copy URL to clipboard"
                  title="Copy URL"
                >
                  {isCopied ? <CheckIcon className="w-6 h-6 text-green-400" /> : <CopyIcon className="w-6 h-6" />}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-full px-6 bg-brand-red text-white font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <LoadingIcon />
                  ) : (
                    'Get Thumbnails'
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative flex items-center gap-3" role="alert">
              <ErrorIcon className="w-6 h-6"/>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {thumbnails && (
            <>
              <div className="mb-6 text-center">
                <button
                  onClick={handleBatchDownload}
                  disabled={isBatchDownloading}
                  className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                  >
                  {isBatchDownloading ? (
                      <>
                        <LoadingIcon />
                        <span>Downloading All...</span>
                      </>
                  ) : (
                      <>
                        <DownloadIcon className="w-6 h-6" />
                        <span>Download All</span>
                      </>
                  )}
                </button>
                <p className="text-sm text-brand-light-gray mt-3 max-w-md mx-auto">
                    Note: Your browser may ask for permission to download multiple files. Please approve the request to get all thumbnails.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {thumbnails.map((thumb) => (
                  <ThumbnailCard key={thumb.resolution} thumbnail={thumb} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
       <footer className="text-center text-brand-light-gray mt-12 text-sm">
          <p>Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
