import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { Star, Quote } from "lucide-react";
import testimonialsData from "@/content/testimonials.json";

const Testimonials = () => {
  const { t, language } = useI18n();

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

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-warm hover:shadow-cinematic transition-all duration-500 hover:-translate-y-2 relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-cinematic-black" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, starIndex) => (
                  <Star key={starIndex} className="w-5 h-5 text-gold fill-current" />
                ))}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content[language]}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-light-brown to-gold rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {testimonial.name[language].charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-cinematic-black">
                    {testimonial.name[language]}
                  </div>
                  <div className="text-light-brown text-sm">
                    {testimonial.role[language]}
                  </div>
                </div>
              </div>
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
