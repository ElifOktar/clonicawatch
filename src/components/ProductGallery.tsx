"use client";
import { useState, useRef } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  videoUrl?: string;
  modelName: string;
}

export function ProductGallery({ images, videoUrl, modelName }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomedIn, setZoomedIn] = useState(false);

  // Touch tracking for swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Combine images + video indicator
  const hasVideo = !!videoUrl;
  const totalMedia = images.length + (hasVideo ? 1 : 0);
  const isVideoSelected = hasVideo && selectedIndex === images.length;

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Go to next
      if (selectedIndex < totalMedia - 1) {
        setSelectedIndex(selectedIndex + 1);
        setZoomedIn(false);
      }
    } else if (isRightSwipe) {
      // Go to previous
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
        setZoomedIn(false);
      }
    }

    // Reset refs
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const goToPrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setZoomedIn(false);
    }
  };

  const goToNext = () => {
    if (selectedIndex < totalMedia - 1) {
      setSelectedIndex(selectedIndex + 1);
      setZoomedIn(false);
    }
  };

  return (
    <div className="space-y-3 w-full max-w-full min-w-0">
      {/* Main display */}
      <div
        className="relative w-full aspect-[4/5] md:aspect-square card overflow-hidden cursor-zoom-in max-h-[70vh] md:max-h-none"
        onClick={() => !isVideoSelected && setZoomedIn(!zoomedIn)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isVideoSelected ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={images[selectedIndex] || "/images/placeholder-watch.svg"}
            alt={`${modelName} — view ${selectedIndex + 1}`}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className={`object-cover transition-transform duration-500 ${
              zoomedIn ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
            }`}
            priority={selectedIndex === 0}
            onClick={() => setZoomedIn(!zoomedIn)}
          />
        )}

        {/* Image counter badge */}
        <div className="absolute bottom-3 right-3 bg-bg/70 backdrop-blur-sm text-ink text-xs px-2.5 py-1 rounded-full">
          {selectedIndex + 1} / {totalMedia}
        </div>

        {/* Mobile swipe arrows */}
        {totalMedia > 1 && !zoomedIn && (
          <>
            {selectedIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 md:hidden bg-bg/40 hover:bg-bg/60 text-gold p-2 rounded-full backdrop-blur-sm transition-colors"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {selectedIndex < totalMedia - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden bg-bg/40 hover:bg-bg/60 text-gold p-2 rounded-full backdrop-blur-sm transition-colors"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* Thumbnail strip — scrollable horizontal for 7-8+ images */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => { setSelectedIndex(i); setZoomedIn(false); }}
            className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all ${
              selectedIndex === i && !isVideoSelected
                ? "border-gold"
                : "border-line hover:border-gold/50"
            }`}
          >
            <Image
              src={img}
              alt={`${modelName} — thumbnail ${i + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}

        {/* Video thumbnail */}
        {hasVideo && (
          <button
            onClick={() => { setSelectedIndex(images.length); setZoomedIn(false); }}
            className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all ${
              isVideoSelected ? "border-gold" : "border-line hover:border-gold/50"
            }`}
          >
            <div className="absolute inset-0 bg-bg-elev flex items-center justify-center">
              <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="absolute bottom-0.5 right-0.5 text-[9px] text-ink-muted bg-bg/80 px-1 rounded">
              VIDEO
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
