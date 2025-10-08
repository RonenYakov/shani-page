import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import VideoModal from "./VideoModal";
import caseStudiesData from "@/content/caseStudies.json";

type Category = "Awareness" | "Consideration" | "Conversion";

const WorkCategories = () => {
  const { t, language } = useI18n();
  const [collection, setCollection] = useState<'brands' | 'events'>('brands');
  const [selectedVideo, setSelectedVideo] = useState<{url: string, title: string} | null>(null);

  const categoryHe: Record<Category, string> = {
    Awareness: 'מודעות',
    Consideration: 'בחינה',
    Conversion: 'המרה'
  };

  const filteredCaseStudies = caseStudiesData.filter(cs => (cs as any).collection === collection);

  const handleVideoClick = (videoUrl: string, title: string) => {
    setSelectedVideo({ url: videoUrl, title });
  };

  return (
    <section id="work" className="py-12 md:py-16 px-4 sm:px-6 bg-cinematic-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-cream mb-3">
            {language === 'he' ? 'סוגי פרויקטים' : 'Types of Projects'}
          </h2>
          <p className="text-base md:text-lg text-light-brown">
            {language === 'he' ? 'ממודעות ועד המרה – בוחרים קטגוריה וצופים בדוגמאות' : 'From awareness to conversion – pick a category and watch examples'}
          </p>
        </div>

        {/* Collection toggle */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setCollection('brands')}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${collection==='brands' ? 'bg-white text-cinematic-black' : 'bg-transparent border border-white/40 text-white/80'}`}
          >
            {language==='he' ? 'מותגים' : 'Brands'}
          </button>
          <button
            onClick={() => setCollection('events')}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${collection==='events' ? 'bg-white text-cinematic-black' : 'bg-transparent border border-white/40 text-white/80'}`}
          >
            {language==='he' ? 'אירועים' : 'Events'}
          </button>
        </div>

        {/* No stage tabs: restore simple split Brands/Events like before */}
        <div className="mb-4" />

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredCaseStudies.map((caseStudy) => (
            <div key={caseStudy.id} className="bg-white rounded-2xl overflow-hidden shadow-warm">
              {/* Video preview */}
              <div className="relative">
                <video
                  className="w-full aspect-video object-cover"
                  src={caseStudy.videoUrl}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  onClick={() => handleVideoClick(caseStudy.videoUrl, caseStudy.title[language])}
                />
                <Badge className="absolute top-3 left-3 bg-gold text-cinematic-black">
                  {language==='he' ? categoryHe[caseStudy.category as Category] : caseStudy.category}
                </Badge>
              </div>

              {/* Text */}
              <div className="p-5">
                <h3 className="text-lg md:text-xl font-semibold text-cinematic-black mb-2">
                  {caseStudy.title[language]}
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">{t('cs.problem')}:</span> {caseStudy.problem[language]}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{t('cs.result')}:</span> {caseStudy.result[language]}
                </p>

                {/* Tools */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {caseStudy.tools.map((tool, toolIndex) => (
                    <span key={toolIndex} className="px-2 py-1 text-xs bg-sand/50 text-cinematic-black rounded-full">
                      {tool}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => handleVideoClick(caseStudy.videoUrl, caseStudy.title[language])}
                  className="w-full mt-4 bg-cinematic-black text-white hover:bg-cinematic-black/90"
                >
                  {language === 'he' ? 'צפייה בסרטון' : 'Watch video'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ''}
        title={selectedVideo?.title}
      />
    </section>
  );
};

export default WorkCategories;
