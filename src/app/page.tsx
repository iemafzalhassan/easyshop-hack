import BannerSlider from "@/components/BannerSlider";
import BekaryCategories from "@/components/BekaryCategories";
import BooksCategory from "@/components/BooksCategory";
import FeaturedProducts from "@/components/FeaturedProducts";
import ShopCategories from "@/components/ShopCategories";
import HeroSlider from "@/components/heros/HeroSlider";
import dynamic from "next/dynamic";

const heroImages = [
  {
    bgImg: "/heroImages/clothing1.png",
  },
  {
    bgImg: "/heroImages/gadget1.png",
  },
  {
    bgImg: "/heroImages/makeup2.png",
  },
  {
    bgImg: "/heroImages/furniture1.png",
  },
  {
    bgImg: "/heroImages/clothing2.png",
  },
  {
    bgImg: "/heroImages/book1.png",
  },
  {
    bgImg: "/heroImages/clothing3.png",
  },
  {
    bgImg: "/heroImages/grocery.png",
  },
];

const banners = [
  {
    img: "/bannerImages/banner1.png",
  },
  {
    img: "/bannerImages/banner2.png",
  },
  {
    img: "/bannerImages/banner3.png",
  },
  {
    img: "/bannerImages/banner4.png",
  },
  {
    img: "/bannerImages/banner5.png",
  },
];

export default function Home({
  searchParams,
}: {
  searchParams: {
    featured: string;
  };
}) {
  return (
    <main>
      <HeroSlider heroImages={heroImages} />
      <BannerSlider bannerImages={banners} />
      <ShopCategories />
      <BooksCategory />
      <BekaryCategories />
      <FeaturedProducts featured={searchParams.featured} />
    </main>
  );
}

// Replace document-based image loading with Next.js Image component
import Image from 'next/image';

// Example usage in your component:
<Image
  src="/heroImages/clothing1.png"
  alt="Clothing"
  width={1200}
  height={600}
  priority
/>

// Remove static BooksCategory import
// import BooksCategory from "@/components/BooksCategory";

// Update dynamic import section
const DynamicBooksCategory = dynamic(
  () => import('@/components/BooksCategory'),
  { 
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

// In your main component JSX, replace:
// <BooksCategory />
<DynamicBooksCategory />
