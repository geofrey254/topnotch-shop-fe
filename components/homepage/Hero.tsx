"use client";
import React from "react";
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
import Image from "next/image";
import Link from "next/link";
import Categories from "../custom/Categories";

import { useAppContext } from "@/providers/ProductProvider";
import { FaBoxOpen } from "react-icons/fa";

import AddToCart from "../buttons/AddToCart";

function Hero() {
  const context = useAppContext();
  const { bestSellers } = context;

  if (!bestSellers || bestSellers.length === 0) {
    return (
      <section className="bg-white w-full px-4 py-0 md:py-16 lg:py-0 xl:px-24 2xl:px-32 flex flex-col items-center justify-center border-t border-[#2b0909] my-0 md:my-4">
        <div className="w-full mt-2 md:mt-4 mb-6">
          <Categories />
        </div>
        <div className="flex w-full max-w-7xl xl:max-w-full my-2 mx-2 bg-[#fffcf7] p-4 border border-[#2b0909]">
          <h3 className="text-sm md:text-base xl:text-xl border-[#2b0909] w-max px-1 tracking-wider font-bold">
            Best Sellers
          </h3>
        </div>
        <div className="w-full max-w-7xl xl:max-w-full mx-auto">
          <div className="w-full max-w-7xl xl:max-w-full mx-auto flex flex-col items-center justify-center py-12">
            <FaBoxOpen className="text-6xl text-gray-400 mb-4" /> {/* Icon */}
            <h3 className="text-xl md:text-2xl font-semibold text-gray-600 mb-2">
              No Items Available
            </h3>
            <p className="text-sm md:text-base text-gray-500 text-center">
              Check back later for best seller items.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const firstTen = bestSellers?.slice(0, 9);
  return (
    <section className="bg-white w-full px-4 py-0 md:py-16 lg:py-0 xl:px-24 2xl:px-32 flex flex-col items-center justify-center border-t border-[#2b0909] my-0 md:my-4">
      <div className="w-full mt-2 md:mt-4 mb-6">
        <Categories />
      </div>
      <div className="flex w-full max-w-7xl xl:max-w-full my-2 mx-2 bg-[#fffcf7] p-4 border border-[#2b0909]">
        <h3 className="text-sm md:text-base xl:text-xl border-[#2b0909] w-max px-1 tracking-wider font-bold">
          Best Sellers
        </h3>
      </div>
      <div className="w-full max-w-7xl xl:max-w-full mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {firstTen.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-1/1 md:basis-1/2 lg:basis-1/4"
              >
                <div className="p-2">
                  <Card className="relative bg-[#fffcf7] border border-[#2b0909] w-[70vw] md:w-full md:h-[56vh]">
                    <CardHeader className="relative p-4">
                      <Image
                        src={
                          item.images.length > 0
                            ? item.images[0].image
                            : "/placeholder.svg"
                        }
                        width={300}
                        height={200}
                        alt={item.title}
                        className="w-full h-40 object-contain rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <Link href={`/product/${item.slug}`}>
                        <CardTitle className="text-sm md:text-base xl:text-lg mb-2">
                          {item.title}
                        </CardTitle>
                      </Link>
                      <p className="text-xs text-gray-600">
                        {item.main_category}
                      </p>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-sm md:text-base xl:text-lg font-bold">
                          KES {item.price}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="absolute -bottom-2 right-0">
                      <AddToCart productId={item.id} />
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

export default Hero;
