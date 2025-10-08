import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSimple = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/message/D4AOECDSG35YE1', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: 'url(/story1.jpg)' }}
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
            className="mx-auto h-24 md:h-32 lg:h-40 drop-shadow-2xl" 
          />
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          Social Media Management + Video Content that makes your brand stand out
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Authentic short-form videos for TikTok & Instagram, embedded in a lean, ROI-focused content plan. Opening first client slots.
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
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            size="lg"
          >
            Message me on WhatsApp
          </Button>
          
          <Button 
            variant="outline"
            className="border-2 border-white/60 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl text-lg backdrop-blur-sm transition-all duration-300"
            size="lg"
          >
            Book a Free Call
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSimple;
