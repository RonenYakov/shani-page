import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { Button } from "@/components/ui/button";
import StoriesGalleryModal from "./StoriesGalleryModal";

const About = () => {
  const { language } = useI18n();

  const [open, setOpen] = useState(false);

  return (
    <section
      id="about"
      className="py-12 md:py-16 px-6"
      style={{
        position: 'relative',
        zIndex: 10,
        background: 'var(--color-cream)',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -8px 40px rgba(26,24,20,0.10)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-cinematic-black mb-6">
              {language === 'he' ? 'קצת עליי' : 'About Me'}
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {language === 'he' 
                ? "אני שני, יוצרת תוכן ומנהלת סושיאל מדיה. אני מאמינה שכל מותג יש לו סיפור ייחודי שמחכה להיספר. המומחיות שלי היא ליצור תוכן וידאו אותנטי שמתחבר לקהל ומניע פעולה."
                : "I'm Shani, a content creator and social media manager. I believe every brand has a unique story waiting to be told. My expertise is creating authentic video content that connects with audiences and drives action."
              }
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {language === 'he' 
                ? "המטרה שלי היא לעזור לעסקים לבנות נוכחות חזקה ברשתות החברתיות דרך סיפורים אמיתיים ותוכן שמדבר אל הלב."
                : "My goal is to help businesses build a strong social media presence through authentic stories and content that speaks to the heart."
              }
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-sand/50 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-cinematic-black">
                  {language === 'he' ? 'תוכן UGC' : 'UGC Content'}
                </span>
              </div>
              <div className="bg-sand/50 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-cinematic-black">
                  {language === 'he' ? 'סרטוני טיקטוק' : 'TikTok Videos'}
                </span>
              </div>
              <div className="bg-sand/50 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-cinematic-black">
                  {language === 'he' ? 'רילס אינסטגרם' : 'Instagram Reels'}
                </span>
              </div>
              <div className="bg-sand/50 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-cinematic-black">
                  {language === 'he' ? 'אירועים' : 'Events'}
                </span>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center gap-2 bg-gradient-to-r from-gold to-amber-400 hover:from-amber-400 hover:to-gold text-cinematic-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-cinematic-black/60" />
              {language === 'he' ? 'צפו בגלריית הסטוריז' : 'View Stories Gallery'}
            </Button>

          </motion.div>

          {/* Photos */}
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Main Photo */}
              <div className="col-span-2 rounded-2xl overflow-hidden shadow-warm">
                <img
                  src="/profile.webp"
                  alt="Shani - Content Creator"
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Two smaller photos */}
              <div className="rounded-xl overflow-hidden shadow-warm">
                <img
                  src="/story2.webp"
                  alt="Behind the scenes"
                  className="w-full h-32 object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-warm">
                <img
                  src="/story5.webp"
                  alt="Content creation"
                  className="w-full h-32 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <StoriesGalleryModal isOpen={open} onClose={() => setOpen(false)} />

    </section>
  );
};

export default About;
