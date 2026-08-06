import EventPopup from "@/components/home/EventPopup";
import HeroSlider from "@/components/home/HeroSlider";
import WelcomeSection from "@/components/home/WelcomeSection";
import BBAMVolunteersSection from "@/components/home/BBAMVolunteersSection";
import EventsSection from "@/components/home/EventsSection";
import CommunityStreetCleaningSection from "@/components/home/CommunityStreetCleaningSection";
import ServicesPreviewSection from "@/components/home/ServicesPreviewSection";
import RecentNewsSection from "@/components/home/RecentNewsSection";
import StatsCounterSection from "@/components/home/StatsCounterSection";
import { getAllNewsPosts } from "@/lib/news";
import { getAllServices } from "@/lib/services";

export const revalidate = 60;

export default async function HomePage() {
  const [rawNews, rawServices] = await Promise.all([
    getAllNewsPosts().catch(() => []),
    getAllServices().catch(() => []),
  ]);

  const initialNews = rawNews.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content || '',
    excerpt: post.excerpt,
    image: post.image,
    createdAt: typeof post.createdAt === 'string' ? post.createdAt : post.createdAt?.toISOString() || new Date().toISOString(),
  }));

  const initialServices = rawServices.slice(0, 3).map((s, idx) => ({
    num: `0${idx + 1}`,
    title: s.title.toUpperCase(),
    slug: s.slug,
  }));

  return (
    <div className="w-full relative">
      <EventPopup />
      <HeroSlider />
      <WelcomeSection />
      <BBAMVolunteersSection />
      <EventsSection />
      <CommunityStreetCleaningSection />
      <ServicesPreviewSection initialServices={initialServices.length > 0 ? initialServices : undefined} />
      <RecentNewsSection initialNews={initialNews.length > 0 ? initialNews : undefined} />
      <StatsCounterSection />
    </div>
  );
}

