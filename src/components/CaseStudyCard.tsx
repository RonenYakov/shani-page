import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

interface CaseStudyCardProps {
  caseStudy: {
    id: string;
    category: string;
    title: { he: string; en: string };
    problem: { he: string; en: string };
    action: { he: string; en: string };
    result: { he: string; en: string };
    videoUrl: string;
    tools: string[];
  };
  onVideoClick: (videoUrl: string, title: string) => void;
  index: number;
}

const CaseStudyCard = ({ caseStudy, onVideoClick, index }: CaseStudyCardProps) => {
  const { t, language } = useI18n();

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-warm hover:shadow-cinematic transition-all duration-500 hover:-translate-y-2 group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      {/* Video Thumbnail */}
      <div 
        className="relative aspect-video bg-gradient-to-br from-light-brown/20 to-gold/20 cursor-pointer"
        onClick={() => onVideoClick(caseStudy.videoUrl, caseStudy.title[language])}
      >
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300">
          <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Play className="w-6 h-6 text-cinematic-black ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Category Badge */}
        <Badge className="absolute top-4 left-4 bg-gold text-cinematic-black font-semibold">
          {caseStudy.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-cinematic-black mb-4 leading-tight">
          {caseStudy.title[language]}
        </h3>
        
        <div className="space-y-3 text-sm mb-4">
          <div>
            <span className="text-gold font-medium">
              {language === 'he' ? 'האתגר' : 'Challenge'}: 
            </span>
            <span className="text-gray-700">{caseStudy.problem[language]}</span>
          </div>
          
          <div>
            <span className="text-gold font-medium">
              {language === 'he' ? 'הפתרון' : 'Solution'}: 
            </span>
            <span className="text-gray-700">{caseStudy.action[language]}</span>
          </div>
          
          <div>
            <span className="text-gold font-medium">
              {language === 'he' ? 'התוצאה' : 'Result'}: 
            </span>
            <span className="text-gray-700">{caseStudy.result[language]}</span>
          </div>
        </div>

        {/* Tools Used */}
        <div className="flex flex-wrap gap-2 mb-4">
          {caseStudy.tools.map((tool, toolIndex) => (
            <span
              key={toolIndex}
              className="px-2 py-1 text-xs bg-sand text-light-brown rounded-full"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* Watch Button */}
        <Button
          onClick={() => onVideoClick(caseStudy.videoUrl, caseStudy.title[language])}
          className="w-full bg-cinematic-black hover:bg-cinematic-black/90 text-white transition-all duration-300"
        >
          {language === 'he' ? 'צפה בסרטון' : 'Watch Video'}
        </Button>
      </div>
    </motion.div>
  );
};

export default CaseStudyCard;
