import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface StoriesGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoriesGalleryModal = ({ isOpen, onClose }: StoriesGalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus the modal so keyboard navigation works immediately
  useEffect(() => {
    if (isOpen) {
      containerRef.current?.focus();
    }
  }, [isOpen]);

  const stories = [
    "/IMG_0763.webp",
    "/IMG_0765.webp",
    "/IMG_0767.webp",
    "/IMG_0768.webp",
    "/IMG_0778.webp",
    "/IMG_0780.webp",
    "/story1.webp",
    "/story2.webp",
    "/story3.webp",
    "/story5.webp",
    "/story6.webp",
    "/story7.webp",
    "/story9.webp",
    "/story10.webp",
    "/story11.webp",
    "/story12.webp",
    "/story13.webp",
    "/story14.webp",
    "/story15.webp"
  ];

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  // Close on escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') nextStory();
    if (e.key === 'ArrowLeft') prevStory();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            aria-label="Next story"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Story Image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-sm max-h-[80vh] mx-4"
          >
            <img
              src={stories[currentIndex]}
              alt={`Story ${currentIndex + 1}`}
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>

          {/* Story Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} / {stories.length}
            </span>
          </div>

          {/* Story Dots */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StoriesGalleryModal;
