import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { Quote } from "lucide-react";
import testimonialsData from "@/content/testimonials.json";

// Eagerly import all screenshot images from the recommendations folder
const recommendationImages = Object.values(
  import.meta.glob("@/assets/recomendations/*.{png,jpg,jpeg,webp}", {
    eager: true,
    as: "url",
  })
) as string[];

const Testimonials = () => {
  const { language } = useI18n();
  
  // Use JSON testimonials for English, images for Hebrew
  const showEnglishTestimonials = language === 'en';

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
          {showEnglishTestimonials ? (
            // Show JSON testimonials for English
            (testimonialsData as any[]).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-warm hover:shadow-cinematic transition-all duration-500 hover:-translate-y-2 relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-cinematic-black" />
                </div>

                {/* Testimonial Content */}
                <div className="mb-4">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                    "{testimonial.content.en}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-amber-400 flex items-center justify-center text-cinematic-black font-bold text-lg">
                      {testimonial.name.en.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-cinematic-black">{testimonial.name.en}</h4>
                      <p className="text-sm text-light-brown">{testimonial.role.en}</p>
                    </div>
                  </div>
                  
                  {/* Stars */}
                  <div className="flex gap-1 mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Show image screenshots for Hebrew
            recommendationImages.map((src, index) => (
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
                  alt="המלצת לקוח"
                  className="w-full h-72 md:h-80 lg:h-96 object-contain rounded-xl border border-sand/50 bg-sand/10"
                  loading="lazy"
                />
              </motion.div>
            ))
          )}
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
