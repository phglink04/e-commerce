import Blog from "@/components/client/home/blog";
import FeatureSection from "@/components/client/home/feature-section";
import Feedback from "@/components/client/home/feedback";
import FeaturedProducts from "@/components/client/home/featured-products";
import FollowOnInstagram from "@/components/client/home/follow-on-instagram";
import HomeHeader from "@/components/client/home/header";
import ShopByCategory from "@/components/client/home/shop-by-category";
import { getFeaturedPlants } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredPlants = await getFeaturedPlants();

  return (
    <>
      <HomeHeader />
      <FeaturedProducts plants={featuredPlants} />
      <ShopByCategory />
      <Feedback />
      <FollowOnInstagram />
      <FeatureSection />
      <Blog />
    </>
  );
}
