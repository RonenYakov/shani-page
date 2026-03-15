import { useI18n } from "@/i18n/simple";

const Footer = () => {
  const year = new Date().getFullYear();
  const { language } = useI18n();
  return (
    <footer className="mt-16 border-t border-black/10 py-6">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs text-black/60">
          {language === 'he'
            ? <>© {year} כל הזכויות על כל התוכן באתר שייכות לשני בסה</>
            : <>© {year} All rights to all content on this site belong to Shani Basa</>}
        </p>
      </div>
    </footer>
  );
};

export default Footer;


