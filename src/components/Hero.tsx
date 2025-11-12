import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { socials } from "@/content/socials";
import LanguageSwitcher from "./LanguageSwitcher";

const Hero = () => {
  const { t, language } = useI18n();

  const handleWhatsAppClick = () => {
    window.open(socials.whatsappUrl, '_blank');
  };

  const handleCalendlyClick = () => {
    if (socials.calendlyUrl) {
      window.open(socials.calendlyUrl, '_blank');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>

      {/* Background Poster Image - Eager load for LCP */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-poster.jpg)' }}
      />
      
      {/* Hero Video - High priority, auto preload */}
      <video
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero-poster.jpg"
        style={{ opacity: 0 }}
        onCanPlay={(e) => {
          const video = e.currentTarget;
          video.style.opacity = '1';
          video.play().catch(() => {});
        }}
        onLoadedData={(e) => {
          setTimeout(() => {
            const video = e.currentTarget;
            if (video.style.opacity === '0') {
              video.style.opacity = '1';
              video.play().catch(() => {});
            }
          }, 1000);
        }}
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 py-12">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-white/30 backdrop-blur-md ring-1 ring-white/40 shadow-2xl" /> 
            <img 
              src="/shani-logo2.png" 
              alt="Shani Social Media" 
              className="mx-auto h-24 md:h-32 lg:h-40 drop-shadow-2xl px-6 py-3" 
            />
          </div>
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-playfair font-bold text-white mb-6 leading-tight max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          {t('hero.headline')}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl lg:text-2xl text-cream/90 mb-10 leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          {t('hero.sub')}
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
        >
          <Button 
            onClick={handleWhatsAppClick}
            className="bg-gold hover:bg-gold/90 text-cinematic-black font-semibold px-8 py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            size="lg"
          >
            {t('cta.whatsapp')}
          </Button>
          
          {socials.calendlyUrl && (
            <Button 
              onClick={handleCalendlyClick}
              variant="outline"
              className="border-2 border-white/60 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl text-lg backdrop-blur-sm transition-all duration-300"
              size="lg"
            >
              {t('cta.book')}
            </Button>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="flex flex-col items-center gap-2 mt-16"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            y: [0, 8, 0]
          }}
          transition={{
            opacity: { delay: 1.2, duration: 0.5 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
        >
          <span className="text-sm tracking-wide text-white/70">
            {language === 'he' ? 'גללו למטה' : 'Scroll down'}
          </span>
          <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center bg-white/10 backdrop-blur-sm">
            <motion.div 
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1.5 h-4 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
