"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { getBanners } from "../libs/api" 
// Adjust the import path as necessary

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface Banner {
  _id: string;
  name: string;
  image?: {
    id: string;
    url: string;
  };
}

export default function CarouselPlugin() {
    const [banners, setBanners] = React.useState<Banner[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    React.useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true)
                const bannerData = await getBanners()
                setBanners(bannerData)
            } catch (err) {
                setError('Failed to load banners')
                console.error('Error fetching banners:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchBanners()
    }, [])

    console.log(banners)
    // Filter out banners without images or with invalid image URLs
    const validBanners = banners.filter(banner => 
        banner.image?.url && banner.image.url.trim() !== ''
    )
console.log(validBanners)
    if (loading) {
        return (
            <div className="w-full h-[300px] md:h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading banners...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full h-[300px] md:h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    if (validBanners.length === 0) {
        return (
            <div className="w-full h-[300px] md:h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-600">
                    <p>No banners available</p>
                </div>
            </div>
        )
    }

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full lg:h-[-300px] md:h-screen max-w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {validBanners.map((banner) => (
                    <CarouselItem key={banner._id} className="h-screen">
                        <div className="relative w-full h-full">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${banner.image?.url})`,
                                    minHeight: "300px",
                                }}
                            />
                            {/* Optional: Add accessible text for screen readers */}
                            <span className="sr-only">{banner.name}</span>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <style jsx global>{`
                @media (max-width: 768px) {
                    .h-screen {
                        height: 300px !important;
                    }
                }
            `}</style>
        </Carousel>
    )
}