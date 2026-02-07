import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface BrandingCarouselProps {
    images: string[];
    className?: string;
}

export default function BrandingCarousel({ images, className = '' }: BrandingCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    const validImages = images.filter((_, index) => !imageErrors[index]);

    useEffect(() => {
        if (validImages.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [validImages.length]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    };

    const handleImageError = (index: number) => {
        setImageErrors({ ...imageErrors, [index]: true });
    };

    if (validImages.length === 0) {
        return null;
    }

    return (
        <div className={`relative overflow-hidden rounded-lg ${className}`}>
            <div className="relative aspect-[21/9] w-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            index === currentIndex && !imageErrors[index] ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="h-full w-full object-cover"
                            onError={() => handleImageError(index)}
                        />
                    </div>
                ))}
            </div>

            {validImages.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                        onClick={handlePrevious}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                        onClick={handleNext}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {validImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 w-2 rounded-full transition-all ${
                                    index === currentIndex ? 'bg-foreground w-6' : 'bg-foreground/50'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
