import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { socials } from "@/content/socials";
import servicesData from "@/content/services.json";

const Services = () => {
  const { t, language } = useI18n();

  const handleWhatsAppClick = (packageName: string) => {
    const message = language === 'he' 
      ? `היי שני! אני מעוניין/ת בחבילת ${packageName}. אשמח לשמוע פרטים נוספים.`
      : `Hi Shani! I'm interested in the ${packageName} package. I'd love to hear more details.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`${socials.whatsappUrl}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="services" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-cinematic-black mb-6">
            {t('services.title')}
          </h2>
          <p className="text-xl text-light-brown max-w-2xl mx-auto">
            {language === 'he' 
              ? 'חבילות מותאמות לכל שלב בדרך - מהתחלה ועד צמיחה מואצת'
              : 'Tailored packages for every stage - from startup to accelerated growth'
            }
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              className={`relative bg-white rounded-2xl p-8 shadow-warm hover:shadow-cinematic transition-all duration-500 hover:-translate-y-2 ${
                service.popular ? 'ring-2 ring-gold scale-105' : ''
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Popular Badge */}
              {service.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-cinematic-black font-semibold px-4 py-1">
                  {language === 'he' ? 'הכי פופולרי' : 'Most Popular'}
                </Badge>
              )}

              {/* Package Name */}
              <h3 className="text-2xl font-playfair font-bold text-cinematic-black mb-2">
                {t(service.nameKey)}
              </h3>

              {/* Target Audience */}
              <p className="text-light-brown mb-4 text-sm">
                {service.targetAudience[language]}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-cinematic-black">
                  {language === 'he' ? service.price : service.priceEn}
                </span>
                <span className="text-light-brown">
                  {language === 'he' ? service.duration : service.durationEn}
                </span>
              </div>

              {/* Deliverables */}
              <ul className="space-y-3 mb-8">
                {service.deliverables[language].map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                onClick={() => handleWhatsAppClick(t(service.nameKey))}
                className="w-full bg-cinematic-black hover:bg-cinematic-black/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                {t('cta.whatsapp')}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-light-brown mb-6">
            {language === 'he' 
              ? 'לא בטוחים איזה חבילה מתאימה לכם?'
              : 'Not sure which package fits you?'
            }
          </p>
          <Button
            onClick={() => handleWhatsAppClick(language === 'he' ? 'ייעוץ' : 'consultation')}
            variant="outline"
            className="border-2 border-light-brown text-light-brown hover:bg-light-brown hover:text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300"
          >
            {language === 'he' ? 'בואו נדבר על זה' : "Let's discuss it"}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
