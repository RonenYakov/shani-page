import { useI18n } from '@/i18n/simple';
import { Button } from '@/components/ui/button';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
      <Button
        variant={language === 'he' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('he')}
        className={`h-8 px-3 text-xs font-medium rounded-full transition-all ${
          language === 'he'
            ? 'bg-white text-cinematic-black shadow-sm'
            : 'text-white hover:bg-white/20'
        }`}
      >
        עב
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className={`h-8 px-3 text-xs font-medium rounded-full transition-all ${
          language === 'en'
            ? 'bg-white text-cinematic-black shadow-sm'
            : 'text-white hover:bg-white/20'
        }`}
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
