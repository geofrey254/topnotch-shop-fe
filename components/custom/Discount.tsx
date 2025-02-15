"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsFillCartPlusFill } from "react-icons/bs";

interface OfferItem {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  imageUrl: string;
}

const offerItems: OfferItem[] = [
  {
    id: 1,
    name: "Physics Form 3",
    description: "books",
    price: 1500,
    discountPercentage: 20,
    imageUrl: "/books/phy3.png",
  },
  {
    id: 2,
    name: "Chemistry Form 2",
    description: "books",
    price: 1200,
    discountPercentage: 15,
    imageUrl: "/books/form2chem.png",
  },
  {
    id: 3,
    name: "Maths Form 2",
    description: "books",
    price: 2000,
    discountPercentage: 25,
    imageUrl: "/books/maths2.png",
  },
  {
    id: 4,
    name: "Maths Guru Book 2",
    description: "books",
    price: 2000,
    discountPercentage: 25,
    imageUrl: "/books/maths2.png",
  },
];

export default function HeroOffers() {
  const plugin = React.useRef(Autoplay({ delay: 3000 }));

  return (
    <section className="bg-white w-full px-4 py-8 md:py-4 lg:py-2 xl:px-24 2xl:px-32 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl xl:max-w-full my-2 mx-2 bg-[#fffcf7] p-4 border border-[#2b0909]">
        <h3 className="text-sm md:text-base xl:text-xl border-[#2b0909] w-max px-1 tracking-wider font-bold">
          Special Offers
        </h3>
      </div>
      <div className="w-full max-w-7xl xl:max-w-full mx-auto">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {offerItems.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-1/1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-2">
                  <Card className="w-full bg-[#fffcf7] border border-[#2b0909]">
                    <CardHeader className="relative p-0">
                      <div className="absolute top-2 left-2 z-10 bg-[#ff8080] text-white px-2 py-1 rounded-full text-sm font-bold">
                        {item.discountPercentage}% OFF
                      </div>
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        width={300}
                        height={200}
                        alt={item.name}
                        className="w-full h-48 object-contain rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-sm md:text-base xl:text-lg mb-2">
                        {item.name}
                      </CardTitle>
                      <p className="text-xs text-gray-600">
                        {item.description}
                      </p>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-sm md:text-base xl:text-lg font-bold">
                          Ksh.
                          {(
                            item.price *
                            (1 - item.discountPercentage / 100)
                          ).toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          Ksh.{item.price.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/shop"
                        className="flex items-center justify-center gap-3 w-full bg-[#ff8080] text-white px-1 md:px-5 py-1.5 md:py-2 rounded-md hover:bg-[#e67373] transition-colors md:mt-0 text-xs md:text-sm lg:text-base"
                      >
                        <BsFillCartPlusFill size={20} />
                        Add to Cart
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-[#ffbfbf] text-[#2b0909] absolute -top-9 md:-top-10 -translate-y-1/2 right-20 md:right-28 transform hover:bg-[#e67373] transition-colors" />
          <CarouselNext className="bg-[#ffbfbf] text-[#2b0909] absolute -top-9 md:-top-10 -translate-y-1/2 right-2 md:right-8 transform hover:bg-[#e67373] transition-colors" />
        </Carousel>
      </div>
    </section>
  );
}
