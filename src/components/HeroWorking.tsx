import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";

const HeroWorking = () => {
  const { t, language, setLanguage } = useI18n();

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/message/D4AOECDSG35YE1', '_blank');
  };

  const scrollToWork = () => {
    const el = document.getElementById('videos-brands');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setLanguage('he')}
            className={`h-8 px-3 text-xs font-medium rounded-full transition-all ${
              language === 'he'
                ? 'bg-white text-black shadow-sm'
                : 'text-white hover:bg-white/20'
            }`}
          >
            עב
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`h-8 px-3 text-xs font-medium rounded-full transition-all ${
              language === 'en'
                ? 'bg-white text-black shadow-sm'
                : 'text-white hover:bg-white/20'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Hero Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/story5.jpg"
        onError={(e) => {
          console.error('Hero video failed to load:', e);
        }}
        onLoadedData={(e) => {
          const video = e.currentTarget;
          video.play().catch((err) => {
            console.log('Autoplay prevented, user interaction required');
          });
        }}
      >
        <source src="/video-glam.webm" type="video/webm" />
        <source src="/video-glam.mov" type="video/mp4" />
      </video>
      
      {/* Fallback poster image - only shows if video fails to load */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-1]"
        style={{ backgroundImage: 'url(/story5.jpg)' }}
      />
      
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 py-12">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <img 
            src="/shani-logo2.png" 
            alt="Shani Social Media" 
            className="mx-auto h-28 md:h-40 lg:h-48 xl:h-56 drop-shadow-2xl" 
          />
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {language === 'he' 
            ? "ניהול סושיאל + צלמת סושיאל +וידאו שמביא תוצאות"
            : "Social + Video that drives results"
          }
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {language === 'he' 
            ? "טיקטוק/רילס שמייצרים באזז ופניות. הפקה + ניהול + שיפור."
            : "TikTok/Reels that create buzz and inquiries. Production + management + iteration."
          }
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <Button 
            onClick={handleWhatsAppClick}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-3"
            size="lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.309"/>
            </svg>
            {language === 'he' ? "בואו נתחיל לעבוד יחד" : "Let's work together"}
          </Button>
          
          <Button 
            variant="outline"
            onClick={scrollToWork}
            className="bg-transparent border-2 border-white/60 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl text-lg backdrop-blur-sm transition-all duration-300"
            size="lg"
          >
            {language === 'he' ? "לצפייה בעבודות" : "See my work"}
          </Button>
        </motion.div>
        {/* Micro-proof chips */}
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-sm backdrop-blur-sm border border-white/20">
            {language === 'he' ? '7+ מיליון צפיות' : '7+M views'}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-sm backdrop-blur-sm border border-white/20">
            {language === 'he' ? '40%+ עליה בפניות' : '40%+ lift in inquiries'}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-sm backdrop-blur-sm border border-white/20">
            {language === 'he' ? 'מותגים מקומיים סומכים' : 'Trusted by local brands'}
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroWorking;
