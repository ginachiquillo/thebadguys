import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import KPISection from '@/components/KPISection';
import ProfileLists from '@/components/ProfileLists';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <HeroSection />
      <KPISection />
      <ProfileLists />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
