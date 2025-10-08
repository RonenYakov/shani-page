import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { socials } from "@/content/socials";

const LeadMagnet = () => {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    contact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.business || !formData.contact) {
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: language === 'he' ? 'אנא מלאו את כל השדות' : 'Please fill all fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    // Create WhatsApp message
    const message = language === 'he' 
      ? `היי שני! אני ${formData.name} מ${formData.business}. אשמח לקבל 3 רעיונות תוכן חינם. אפשר ליצור איתי קשר ב: ${formData.contact}`
      : `Hi Shani! I'm ${formData.name} from ${formData.business}. I'd love to get 3 free content ideas. You can contact me at: ${formData.contact}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${socials.whatsappUrl}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Show success message
    toast({
      title: language === 'he' ? 'נשלח בהצלחה!' : 'Sent successfully!',
      description: language === 'he' 
        ? 'הודעה נפתחה בוואטסאפ. שלחו אותה ואחזור אליכם בקרוב!'
        : 'Message opened in WhatsApp. Send it and I\'ll get back to you soon!'
    });

    // Reset form
    setFormData({ name: '', business: '', contact: '' });
    setIsSubmitting(false);
  };

  return (
    <section id="lead-magnet" className="py-20 px-6 bg-gradient-to-br from-gold/10 via-cream to-sand/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white rounded-3xl p-8 md:p-12 shadow-cinematic relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-light-brown/20 to-transparent rounded-full translate-y-12 -translate-x-12" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h2
                className="text-3xl md:text-4xl font-playfair font-bold text-cinematic-black mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {t('lead.title')}
              </motion.h2>
              
              <motion.p
                className="text-lg text-gray-600 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {t('lead.body')}
              </motion.p>

              <motion.p
                className="text-gold font-semibold text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {t('lead.urgency')}
              </motion.p>
            </div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-cinematic-black font-medium mb-2 block">
                    {language === 'he' ? 'השם שלכם' : 'Your Name'}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={language === 'he' ? 'שם פרטי ומשפחה' : 'First and last name'}
                    className="border-light-brown/30 focus:border-gold focus:ring-gold/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="business" className="text-cinematic-black font-medium mb-2 block">
                    {language === 'he' ? 'העסק שלכם' : 'Your Business'}
                  </Label>
                  <Input
                    id="business"
                    name="business"
                    value={formData.business}
                    onChange={handleInputChange}
                    placeholder={language === 'he' ? 'שם העסק או התחום' : 'Business name or field'}
                    className="border-light-brown/30 focus:border-gold focus:ring-gold/20"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact" className="text-cinematic-black font-medium mb-2 block">
                  {language === 'he' ? 'איך ליצור קשר' : 'How to contact you'}
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder={language === 'he' ? 'טלפון או אימייל' : 'Phone or email'}
                  className="border-light-brown/30 focus:border-gold focus:ring-gold/20"
                  required
                />
              </div>

              <div className="text-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gold hover:bg-gold/90 text-cinematic-black font-semibold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isSubmitting 
                    ? (language === 'he' ? 'שולח...' : 'Sending...') 
                    : t('lead.cta')
                  }
                </Button>
              </div>
            </motion.form>

            {/* Fine Print */}
            <motion.p
              className="text-sm text-gray-500 text-center mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              {language === 'he' 
                ? 'לא נשלח ספאם. רק 3 רעיונות איכותיים שיעזרו לכם להתחיל.'
                : 'No spam. Just 3 quality ideas to help you get started.'
              }
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadMagnet;
