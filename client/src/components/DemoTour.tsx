import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronRight, ChevronLeft, Zap } from "lucide-react";

interface DemoStep {
  title: string;
  description: string;
  details: string[];
  path: string;
  emoji: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    title: "🏠 Главная страница",
    description: "Добро пожаловать на сайт колледжа!",
    details: ["Все основные разделы доступны", "Новости и объявления", "Красивый дизайн с анимациями"],
    path: "/",
    emoji: "🏫",
  },
  {
    title: "📰 Новости",
    description: "Последние новости и события",
    details: ["Просмотр всех новостей", "Полная информация о событиях", "Дата публикации"],
    path: "/news",
    emoji: "📰",
  },
  {
    title: "📅 Расписание",
    description: "Расписание занятий",
    details: ["Видимость расписания для студентов", "Все пары с временем", "Информация о кабинетах"],
    path: "/schedule",
    emoji: "📅",
  },
  {
    title: "👥 О колледже",
    description: "Информация о колледже",
    details: ["История и миссия", "Структура учреждения", "Достижения"],
    path: "/about",
    emoji: "🎓",
  },
  {
    title: "📞 Контакты",
    description: "Все контакты и информация",
    details: ["Телефоны отделов", "Email контакты", "Адрес и режим работы"],
    path: "/contacts",
    emoji: "☎️",
  },
  {
    title: "🔐 Аутентификация",
    description: "Вход в систему",
    details: ["Вход для студентов", "Вход для преподавателей", "Вход для администраторов"],
    path: "/auth",
    emoji: "🔑",
  },
];

const ADMIN_DEMO_STEPS: DemoStep[] = [
  {
    title: "📊 Статистика",
    description: "Полная аналитика сайта",
    details: ["Количество студентов и преподавателей", "Новости и объявления", "Активность пользователей"],
    path: "/admin",
    emoji: "📈",
  },
  {
    title: "📚 Управление расписанием",
    description: "Редактирование расписания",
    details: ["Добавление новых занятий", "Выбор пар из списка (7 пар)", "Редактирование и удаление"],
    path: "/admin",
    emoji: "✏️",
  },
  {
    title: "👥 Управление пользователями",
    description: "Контроль учетных записей",
    details: ["Добавление новых пользователей", "Изменение ролей и данных", "Удаление пользователей"],
    path: "/admin",
    emoji: "👨‍💼",
  },
  {
    title: "👫 Управление группами",
    description: "Работа с группами студентов",
    details: ["Создание групп", "Добавление студентов", "Управление составом"],
    path: "/admin",
    emoji: "👨‍🎓",
  },
];

interface DemoTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoTour({ isOpen, onClose }: DemoTourProps) {
  const [, setLocation] = useLocation();
  const [currentSection, setCurrentSection] = useState<"main" | "admin">("main");
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const steps = currentSection === "main" ? DEMO_STEPS : ADMIN_DEMO_STEPS;
  const stepData = steps[currentStep];
  const totalInSection = steps.length;
  const totalAllSteps = DEMO_STEPS.length + ADMIN_DEMO_STEPS.length;
  const currentAllStep = currentSection === "main" ? currentStep + 1 : DEMO_STEPS.length + currentStep + 1;

  useEffect(() => {
    if (isOpen && stepData) {
      setLocation(stepData.path);
    }
  }, [currentStep, currentSection, isOpen, stepData, setLocation]);

  const handleNext = () => {
    if (currentStep < totalInSection - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    } else if (currentSection === "main") {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSection("admin");
        setCurrentStep(0);
        setIsTransitioning(false);
      }, 300);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 300);
    } else if (currentSection === "admin") {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSection("main");
        setCurrentStep(DEMO_STEPS.length - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentSection("main");
      setCurrentStep(0);
    }
  }, [isOpen]);

  const progressPercent = (currentAllStep / totalAllSteps) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20">
        {/* Закрыть */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-red-500/20 transition-all duration-200 z-50"
        >
          <X size={24} className="text-red-400 hover:text-red-300" />
        </button>

        {/* Прогресс бар */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-900 to-slate-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Основное содержимое */}
        <div className="pt-8 px-8 pb-8 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto scrollbar-hide">
          {/* Заголовок секции */}
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                {currentSection === "main" ? "Часть 1: Основные функции" : "Часть 2: Администратор"}
              </span>
              <h1 className="text-4xl font-black text-white">
                {stepData.emoji} {stepData.title}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {currentAllStep}
              </div>
              <div className="text-sm text-gray-400">из {totalAllSteps}</div>
            </div>
          </div>

          {/* Основное описание */}
          <div
            className={`transition-all duration-500 transform ${
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              {stepData.description}
            </p>

            {/* Детали */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stepData.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3 hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="flex gap-2">
                    <span className="text-purple-400 font-bold flex-shrink-0">✓</span>
                    <span className="text-sm text-gray-300">{detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Визуальное отображение */}
          <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-purple-500/20 overflow-hidden group">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-pulse" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
            </div>
            <div className="relative h-full flex items-center justify-center">
              <div
                className={`text-7xl transition-all duration-500 transform ${
                  isTransitioning ? "scale-0" : "scale-100"
                } animate-bounce`}
              >
                {stepData.emoji}
              </div>
            </div>
          </div>

          {/* Навигация по шагам */}
          <div className="flex flex-wrap gap-2 pt-2">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentStep(idx);
                    setIsTransitioning(false);
                  }, 300);
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                  idx === currentStep
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/50 scale-105"
                    : idx < currentStep
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 border border-gray-600/30"
                }`}
              >
                {step.emoji}
              </button>
            ))}
          </div>

          {/* Кнопки действия */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handlePrev}
              variant="outline"
              className="flex-1 bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-700/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={currentStep === 0 && currentSection === "main"}
            >
              <ChevronLeft size={18} className="mr-1" />
              Назад
            </Button>

            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 group"
            >
              {currentSection === "admin" && currentStep === ADMIN_DEMO_STEPS.length - 1 ? (
                <>
                  <Zap size={18} className="mr-2" />
                  Готово!
                </>
              ) : currentSection === "main" && currentStep === DEMO_STEPS.length - 1 ? (
                <>
                  Админ-панель
                  <ChevronRight size={18} className="ml-2" />
                </>
              ) : (
                <>
                  Дальше
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
