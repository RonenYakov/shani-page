import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";

const ProcessTimeline = () => {
  const { t, language } = useI18n();
  
  const steps = language === 'he' 
    ? ["היכרות","קונספטים","הפקה","פרסום","דיווח ושיפור"]
    : ["Discovery","Concepts","Production","Publishing","Report & iterate"];

  const stepIcons = [
    "💬", // Discovery Call
    "📋", // Strategy & Calendar  
    "🎬", // Production
    "📱", // Publishing & Management
    "📊"  // Reporting & Iteration
  ];

  return (
    <section id="process" className="py-10 md:py-14 px-6 bg-sand/30">
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
            {language === 'he' ? 'איך אני עובדת' : 'How I Work'}
          </h2>
          <p className="text-xl text-light-brown max-w-2xl mx-auto">
            {language === 'he' 
              ? 'חודש פיילוט זמין — דליברבלס ברורים, ממשיכים רק אם מרוצים'
              : 'Pilot month available — clear deliverables, continue only if happy'
            }
          </p>
        </motion.div>

        {/* Timeline - Desktop Horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-light-brown via-gold to-light-brown rounded-full -translate-y-1/2" />
            
            {/* Steps */}
            <div className="relative flex justify-between items-center">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center max-w-xs"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* Step Icon */}
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-warm mb-4 ring-4 ring-white relative z-10">
                    <span className="text-2xl">{stepIcons[index]}</span>
                  </div>
                  
                  {/* Step Number */}
                  <div className="text-sm font-semibold text-gold mb-2">
                    {language === 'he' ? `שלב ${index + 1}` : `Step ${index + 1}`}
                  </div>
                  
                  {/* Step Title */}
                  <h3 className="text-lg font-semibold text-cinematic-black text-center leading-tight">
                    {step}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline - Mobile Vertical */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: language === 'he' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Step Icon */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-warm flex-shrink-0">
                <span className="text-xl">{stepIcons[index]}</span>
              </div>
              
              <div className="flex-1">
                {/* Step Number */}
                <div className="text-sm font-semibold text-gold mb-1">
                  {language === 'he' ? `שלב ${index + 1}` : `Step ${index + 1}`}
                </div>
                
                {/* Step Title */}
                <h3 className="text-lg font-semibold text-cinematic-black">
                  {step}
                </h3>
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
          <p className="text-light-brown text-lg">
            {language === 'he' 
              ? 'מוכנים להתחיל? השלב הראשון תמיד חינם'
              : 'Ready to start? First step is always free'
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
