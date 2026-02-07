import { useState } from 'react';

interface BrandingBannerProps {
    images: string[];
    className?: string;
}

export default function BrandingBanner({ images, className = '' }: BrandingBannerProps) {
    const [imageError, setImageError] = useState(false);

    if (images.length === 0 || imageError) {
        return null;
    }

    const bannerImage = images[0];

    return (
        <div className={`relative overflow-hidden rounded-lg ${className}`}>
            <div className="relative aspect-[16/5] w-full">
                <img
                    src={bannerImage}
                    alt="Banner"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                />
            </div>
        </div>
    );
}
