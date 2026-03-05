import { PageTransition } from "@/components/layout/PageTransition";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, History, Target, Award, ShieldAlert, BookOpen, Briefcase } from "lucide-react";

export default function About() {
  const { t } = useI18n();

  return (
    <PageTransition className="pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">{t('about.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('about.desc')}
          </p>
        </div>

        {/* Feature Image */}
        <div className="rounded-3xl overflow-hidden mb-20 shadow-2xl relative h-[400px] md:h-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=800&fit=crop" 
            alt="Students" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-3xl font-display font-bold mb-2">Современный подход к медицине</h2>
            <p className="max-w-xl opacity-90 text-white/90">
              Наши лаборатории оснащены новейшим оборудованием, что позволяет студентам 
              получать практические навыки, соответствующие мировым стандартам.
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover-card-fx">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <History size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Богатая история</h3>
            <p className="text-muted-foreground leading-relaxed">
              Основанный 15 июня 1990 года, колледж выпустил тысячи специалистов, 
              которые сегодня спасают жизни по всей стране.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover-card-fx">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Наша миссия</h3>
            <p className="text-muted-foreground leading-relaxed">
              Обеспечение здравоохранения компетентными, милосердными и 
              отвественными специалистами, готовыми к вызовам современности.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover-card-fx">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Достижения</h3>
            <p className="text-muted-foreground leading-relaxed">
              Наши студенты регулярно становятся победителями чемпионатов 
              «Профессионалы» (WorldSkills) в медицинских компетенциях.
            </p>
          </div>
        </div>

        {/* New Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div id="info" className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-primary w-8 h-8" />
              <h2 className="text-3xl font-display font-bold">Сведения об организации</h2>
            </div>
            <p className="text-muted-foreground">
              ГАПОУ "Альметьевский медицинский колледж" является ведущим образовательным учреждением юго-востока Татарстана. Мы осуществляем образовательную деятельность на основании лицензии и свидетельства о государственной аккредитации.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg border border-border/50">
                <span className="font-bold">Дата создания:</span> 1964 год
              </li>
              <li className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg border border-border/50">
                <span className="font-bold">Учредитель:</span> Министерство здравоохранения РТ
              </li>
              <li className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg border border-border/50">
                <span className="font-bold">Режим работы:</span> Пн-Сб, 08:00 - 17:00
              </li>
            </ul>
          </div>

          <div id="anticorruption" className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="text-destructive w-8 h-8" />
              <h2 className="text-3xl font-display font-bold">Антикоррупция</h2>
            </div>
            <p className="text-muted-foreground">
              В колледже ведется активная работа по противодействию коррупции. Мы придерживаемся принципов прозрачности и честности в образовательном процессе.
            </p>
            <div className="bg-destructive/5 border border-destructive/20 p-6 rounded-2xl">
              <h4 className="font-bold mb-2">Телефон "горячей линии":</h4>
              <p className="text-2xl font-display font-bold text-destructive">+7 (8553) 43-00-00</p>
              <p className="text-sm text-muted-foreground mt-2">Вы можете анонимно сообщить о фактах коррупции.</p>
            </div>
          </div>
        </div>

        <div id="activities" className="mb-20">
           <div className="flex items-center gap-3 mb-8">
              <Briefcase className="text-secondary w-8 h-8" />
              <h2 className="text-3xl font-display font-bold">Деятельность</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Образовательная", desc: "Реализация программ среднего профессионального образования." },
                { title: "Воспитательная", desc: "Формирование гармонично развитой личности и патриотизма." },
                { title: "Научная", desc: "Участие в конференциях, разработка методических пособий." },
                { title: "Медицинская", desc: "Практическая подготовка на базах лечебных учреждений." },
                { title: "Профориентационная", desc: "Работа со школьниками и будущими абитуриентами." },
                { title: "Международная", desc: "Обмен опытом и сотрудничество с зарубежными партнерами." }
              ].map((act, i) => (
                <div key={i} className="p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                  <h4 className="font-bold text-lg mb-2">{act.title}</h4>
                  <p className="text-muted-foreground text-sm">{act.desc}</p>
                </div>
              ))}
            </div>
        </div>

        {/* Bullet points */}
        <div className="mt-20 bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">Почему выбирают нас?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Высококвалифицированный преподавательский состав",
              "Современные симуляционные центры и лаборатории",
              "100% трудоустройство выпускников",
              "Насыщенная студенческая жизнь",
              "Возможность получения дополнительных компетенций",
              "Партнерство с ведущими клиниками региона"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="text-primary w-6 h-6 shrink-0 mt-0.5" />
                <span className="font-medium text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
