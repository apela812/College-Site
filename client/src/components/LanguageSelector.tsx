import { useEffect, useState } from "react";
import { useI18n, type Language } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export function LanguageSelector() {
  const { setLang } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Проверяем был ли язык выбран ранее
    const hasLanguageSelected = localStorage.getItem("almetmed-language");
    
    if (!hasLanguageSelected) {
      // Показываем диалог выбора языка только при первом входе
      setOpen(true);
    }
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    setLang(lang);
    localStorage.setItem("almetmed-language", lang);
    setOpen(false);
  };

  const languages: Array<{ code: Language; name: string; description: string }> = [
    { code: "ru", name: "Русский", description: "Russian" },
    { code: "en", name: "English", description: "Английский" },
    { code: "tt", name: "Татарча", description: "Tatar" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Globe size={24} />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Выберите язык / Select Language / Телне сайлагыз
          </DialogTitle>
          <DialogDescription className="text-center">
            Выберите язык интерфейса для работы с сайтом
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 mt-6">
          {languages.map((lang, idx) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Button
                onClick={() => handleLanguageSelect(lang.code)}
                className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 hover:border-primary/40 text-foreground"
              >
                <span className="text-lg font-bold">{lang.name}</span>
                <span className="text-xs text-muted-foreground">{lang.description}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Вы сможете изменить язык в любой момент, нажав на иконку глобуса в панели навигации
        </p>
      </DialogContent>
    </Dialog>
  );
}
