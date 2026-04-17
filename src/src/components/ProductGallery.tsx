"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  videoUrl?: string;
  modelName: string;
}

export function ProductGallery({ images, videoUrl, modelName }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomedIn, setZoomedIn] = useState(false);

  // Combine images + video indicator
  const hasVideo = !!videoUrl;
  const totalMedia = images.length + (hasVideo ? 1 : 0);
  const isVideoSelected = hasVideo && selectedIndex === images.length;

  return (
    <div className="space-y-3">
      {/* Main display */}
      <div
        className="relative aspect-square card overflow-hidden cursor-zoom-in"
        onClick={() => !isVideoSelected && setZoomedIn(!zoomedIn)}
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
