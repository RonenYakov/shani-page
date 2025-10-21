import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { Quote } from "lucide-react";

// Eagerly import all screenshot images from the recommendations folder
const recommendationImages = Object.values(
  import.meta.glob("@/assets/recomendations/*.{png,jpg,jpeg,webp}", {
    eager: true,
    as: "url",
  })
) as string[];

const Testimonials = () => {
  const { language } = useI18n();

  return (
    <section id="testimonials" className="py-12 md:py-16 px-6 bg-sand/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-cinematic-black mb-6">
            {language === 'he' ? 'מה אומרים עליי' : 'What Clients Say'}
          </h2>
          <p className="text-xl text-light-brown max-w-2xl mx-auto">
            {language === 'he' 
              ? 'מה אומרים לקוחות שעבדו איתי'
              : 'What clients who worked with me say'
            }
          </p>
        </motion.div>

        {/* Testimonials Grid (now showing real screenshots) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendationImages.map((src, index) => (
            <motion.div
              key={src}
              className="bg-white rounded-2xl p-4 md:p-6 shadow-warm hover:shadow-cinematic transition-all duration-500 hover:-translate-y-2 relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              {/* Quote Icon keeps the welcoming vibe */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-cinematic-black" />
              </div>

              <img
                src={src}
                alt={language === 'he' ? 'המלצת לקוח' : 'Client recommendation'}
                className="w-full h-72 md:h-80 lg:h-96 object-contain rounded-xl border border-sand/50 bg-sand/10"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-light-brown text-lg mb-4">
            {language === 'he' 
              ? 'רוצים להצטרף לרשימת הלקוחות המרוצים?'
              : 'Want to join the list of satisfied clients?'
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
