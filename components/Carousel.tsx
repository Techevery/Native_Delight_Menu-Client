"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

// import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

// Example images (replace with your own URLs)
const images = [
    'https://i.im.ge/2025/03/24/ph7ZuT.DGIx18St6MlJPG.jpeg',
    'https://i.im.ge/2025/03/24/ph7Rf0.DGIx18St6Ml-0JPG.jpeg',
    'https://i.im.ge/2025/03/24/ph7V8L.20250205-205749.jpeg',
    'https://i.im.ge/2025/03/24/ph7nPS.DGIx18St6MlJPG-copy.jpeg',
    'https://i.im.ge/2025/03/24/ph7Jdy.DGIx18St6Ml-0JPG-copy.jpeg',
    'https://i.im.ge/2025/03/24/ph74fz.IMG-6955-copy.jpeg',
    'https://i.im.ge/2025/03/23/ph1wZ1.lounge.jpeg',
    'https://i.im.ge/2025/03/23/ph1tbr.lounge-1-copy.jpeg',
    'https://i.im.ge/2025/03/23/phXbmm.Loaded-Jollof-rice.jpeg',
    'https://i.im.ge/2025/03/23/phXcZr.Asun-rice.jpeg',
    'https://i.im.ge/2025/03/23/phXRh0.20250104-233025.jpeg',
    'https://i.im.ge/2025/03/23/phX8oW.egusi-and-eba.jpeg',
    'https://i.im.ge/2025/03/23/ph10yC.IMG-8524-1.jpeg',
    'https://i.im.ge/2025/03/23/ph15Hq.milkshake.jpeg',
    'https://i.im.ge/2025/03/23/ph1yBW.small-chops.jpeg',
    'https://i.im.ge/2025/03/23/ph1Y1L.lounge-2-copy.jpeg',
]

export default function CarouselPlugin() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full lg:h-[-300px] md:h-screen max-w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {images.map((img, index) => (
                    <CarouselItem key={index} className="h-screen ">
                        <div className="relative w-full h-full">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${img})`,
                                    minHeight: "300px",
                                }}
                            />
                            {/* <Card className="relative bg-transparent shadow-none h-full flex items-center justify-center">
                                <CardContent className="flex flex-col items-center justify-center h-full bg-black/40">
                                    <span className="text-4xl font-semibold text-white drop-shadow-lg">
                                        {index + 1}
                                    </span>
                                </CardContent>
                            </Card> */}
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
