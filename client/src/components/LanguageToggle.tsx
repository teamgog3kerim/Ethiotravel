import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <Button
        variant={i18n.language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => i18n.language !== "en" && toggleLanguage()}
        className="px-3 py-1 text-sm font-medium transition-all"
        data-testid="button-lang-en"
      >
        EN
      </Button>
      <Button
        variant={i18n.language === "ar" ? "default" : "ghost"}
        size="sm"
        onClick={() => i18n.language !== "ar" && toggleLanguage()}
        className="px-3 py-1 text-sm font-medium transition-all"
        data-testid="button-lang-ar"
      >
        العربية
      </Button>
    </div>
  );
}
