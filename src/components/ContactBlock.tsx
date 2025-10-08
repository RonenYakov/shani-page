import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar } from "lucide-react";
import { socials } from "@/content/socials";

const ContactBlock = () => {
  const { t, language } = useI18n();

  const handleWhatsAppClick = () => {
    const message = language === 'he' 
      ? 'היי שני! אני מעוניין/ת לשמוע עוד על השירותים שלך.'
      : 'Hi Shani! I\'d like to hear more about your services.';
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`${socials.whatsappUrl}?text=${encodedMessage}`, '_blank');
  };

  const handleCalendlyClick = () => {
    if (socials.calendlyUrl) {
      window.open(socials.calendlyUrl, '_blank');
    }
  };

  return (
    <section id="contact" className="py-12 md:py-16 px-6 bg-gradient-to-br from-cinematic-black via-cinematic-black to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-cream mb-6">
            {language === 'he' ? 'בואו נצמח יחד' : "Let's Grow Together"}
          </h2>
          <p className="text-xl text-light-brown max-w-2xl mx-auto leading-relaxed">
            {language === 'he' 
              ? 'מוכנים להפוך את הסושיאל שלכם לכלי צמיחה אמיתי? בואו נתחיל לעבוד יחד.'
              : 'Ready to turn your social media into a real growth tool? Let\'s start working together.'
            }
          </p>
        </motion.div>

        {/* Contact Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={handleWhatsAppClick}
            className="bg-gold hover:bg-gold/90 text-cinematic-black font-semibold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-3"
            size="lg"
          >
            <MessageCircle className="w-5 h-5" />
            {t('cta.whatsapp')}
          </Button>

          {socials.calendlyUrl && (
            <Button
              onClick={handleCalendlyClick}
              variant="outline"
              className="border-2 border-light-brown text-light-brown hover:bg-light-brown hover:text-cinematic-black font-semibold px-8 py-4 rounded-xl text-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-3"
              size="lg"
            >
              <Calendar className="w-5 h-5" />
              {t('cta.book')}
            </Button>
          )}
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-cream font-semibold mb-2">
              {language === 'he' ? 'מענה מהיר' : 'Quick Response'}
            </h3>
            <p className="text-light-brown text-sm">
              {language === 'he' ? 'תוך 24 שעות' : 'Within 24 hours'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-cream font-semibold mb-2">
              {language === 'he' ? 'שיחת היכרות' : 'Discovery Call'}
            </h3>
            <p className="text-light-brown text-sm">
              {language === 'he' ? '15 דקות חינם' : '15 minutes free'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gold text-2xl">🎯</span>
            </div>
            <h3 className="text-cream font-semibold mb-2">
              {language === 'he' ? 'תוכנית מותאמת' : 'Custom Strategy'}
            </h3>
            <p className="text-light-brown text-sm">
              {language === 'he' ? 'לכל עסק בנפרד' : 'For each business'}
            </p>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {socials.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-light-brown hover:text-gold hover:bg-white/20 transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          )}

          {socials.tiktok && (
            <a
              href={socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-light-brown hover:text-gold hover:bg-white/20 transition-all duration-300"
              aria-label="TikTok"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactBlock;
