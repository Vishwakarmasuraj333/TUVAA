import EventPopup from "@/components/home/EventPopup";
import HeroSlider from "@/components/home/HeroSlider";
import WelcomeSection from "@/components/home/WelcomeSection";
import BBAMVolunteersSection from "@/components/home/BBAMVolunteersSection";
import EventsSection from "@/components/home/EventsSection";
import CommunityStreetCleaningSection from "@/components/home/CommunityStreetCleaningSection";
import ServicesPreviewSection from "@/components/home/ServicesPreviewSection";
import RecentNewsSection from "@/components/home/RecentNewsSection";
import StatsCounterSection from "@/components/home/StatsCounterSection";

export default function HomePage() {
  return (
    <div className="w-full relative">
      <EventPopup />
      <HeroSlider />
      <WelcomeSection />
      <BBAMVolunteersSection />
      <EventsSection />
      <CommunityStreetCleaningSection />
      <ServicesPreviewSection />
      <RecentNewsSection />
      <StatsCounterSection />
    </div>
  );
}
