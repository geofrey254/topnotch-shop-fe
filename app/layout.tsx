import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

import { AppWrapper } from "@/providers/ProductProvider";
import { Providers } from "@/providers/SessionProvider";
import { CartProvider } from "@/providers/CartContext";
import { ShippingProvider } from "@/providers/ShippingContext";

export const metadata: Metadata = {
  title: "Topnotch Publishers",
  description: "Generated by create next app",
};

async function fetchProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`);
    if (!res.ok) {
      throw new Error("Failed to fetch Products");
    }

    const data = res.json();
    return data;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
}

async function fetchBooks() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?main_category=Books`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch Books in Products");
    }

    const data = res.json();
    return data;
  } catch (error) {
    console.error(
      "An unexpected error occured while trying to fetch Books Category:",
      error
    );
  }
}

async function fetchBanners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`);

    if (!res.ok) {
      throw new Error("Failed to fetch Banners");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("An unexpected error occured while fetching Banners:", error);
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await fetchProducts();
  const books = await fetchBooks();
  const banners = await fetchBanners();
  return (
    <Providers>
      <ShippingProvider>
        <CartProvider>
          <html lang="en">
            <body>
              <Navbar />
              <AppWrapper products={products} books={books} banners={banners}>
                {children}
              </AppWrapper>
              <Footer />
            </body>
          </html>
        </CartProvider>
      </ShippingProvider>
    </Providers>
  );
}
