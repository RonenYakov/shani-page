import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";
import CaseStudyCard from "./CaseStudyCard";
import VideoModal from "./VideoModal";
import caseStudiesData from "@/content/caseStudies.json";

const CaseStudies = () => {
  const { t, language } = useI18n();
  const [selectedVideo, setSelectedVideo] = useState<{url: string, title: string} | null>(null);

  const handleVideoClick = (videoUrl: string, title: string) => {
    setSelectedVideo({ url: videoUrl, title });
  };

  return (
    <section id="case-studies" className="py-12 md:py-16 px-6 bg-gradient-to-b from-white to-cream">
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
            {language === 'he' ? 'עבודות שביצעתי' : 'My Work'}
          </h2>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudiesData.slice(0, 6).map((caseStudy, index) => (
            <CaseStudyCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              onVideoClick={handleVideoClick}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ""}
        title={selectedVideo?.title}
      />
    </section>
  );
};

export default CaseStudies;
