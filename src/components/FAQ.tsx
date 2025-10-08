import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqData from "@/content/faq.json";

const FAQ = () => {
  const { t, language } = useI18n();

  return (
    <section id="faq" className="py-12 md:py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-cinematic-black mb-6">
            {t('faq.title')}
          </h2>
          <p className="text-xl text-light-brown max-w-2xl mx-auto">
            {language === 'he' 
              ? 'תשובות לשאלות הכי נפוצות שמקבלת'
              : 'Answers to the most common questions I get'
            }
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-sand/20 rounded-2xl px-6 border-0 shadow-sm hover:shadow-warm transition-all duration-300"
              >
                <AccordionTrigger className="text-left py-6 font-semibold text-cinematic-black text-lg hover:no-underline hover:text-gold transition-colors">
                  {faq.question[language]}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-gray-700 leading-relaxed">
                  {faq.answer[language]}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-light-brown text-lg mb-6">
            {language === 'he' 
              ? 'יש לכם שאלה נוספת?'
              : 'Have another question?'
            }
          </p>
          <p className="text-gray-600">
            {language === 'he' 
              ? 'שלחו לי הודעה ואענה תוך 24 שעות'
              : 'Send me a message and I\'ll respond within 24 hours'
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
