import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { Zap, Clock, Eye, Heart } from "lucide-react";

const ValueProps = () => {
  const { t, language } = useI18n();
  
  const valueItems = language === 'he' 
    ? ["רעיונות עדכניים לפי טרנדים","זמני אספקה מהירים","תוכן קצר שמייצר צפיות ושיתופים","מחירים ידידותיים ללקוחות ראשונים"]
    : ["Trend-savvy creative ideas","Fast turnaround","Short-form built for watch-time & saves","Beginner-friendly pricing for first clients"];

  const icons = [
    <Zap className="w-8 h-8 text-gold" key="zap" />,
    <Clock className="w-8 h-8 text-gold" key="clock" />,
    <Eye className="w-8 h-8 text-gold" key="eye" />,
    <Heart className="w-8 h-8 text-gold" key="heart" />
  ];

  return (
    <section id="value" className="py-20 px-6 bg-gradient-to-b from-cream to-white">
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
            {t('value.title')}
          </h2>
          <p className="text-xl text-light-brown max-w-2xl mx-auto">
            {language === 'he' 
              ? 'מה שמייחד את הגישה שלי לניהול סושיאל מדיה'
              : 'What makes my social media management approach unique'
            }
          </p>
        </motion.div>

        {/* Value Props Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 text-center shadow-warm hover:shadow-cinematic transition-all duration-500 hover:-translate-y-2 group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {icons[index]}
              </div>
              
              {/* Value Proposition */}
              <p className="text-lg font-semibold text-cinematic-black leading-relaxed">
                {item}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-sand"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gold mb-2">50+</div>
            <div className="text-light-brown">
              {language === 'he' ? 'פרויקטים' : 'Projects'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gold mb-2">24h</div>
            <div className="text-light-brown">
              {language === 'he' ? 'זמן מענה' : 'Response Time'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gold mb-2">95%</div>
            <div className="text-light-brown">
              {language === 'he' ? 'שביעות רצון' : 'Satisfaction'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gold mb-2">3x</div>
            <div className="text-light-brown">
              {language === 'he' ? 'צמיחה ממוצעת' : 'Avg Growth'}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProps;
