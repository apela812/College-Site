import { PageTransition } from "@/components/layout/PageTransition";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, History, Target, Award } from "lucide-react";

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
          {/* medical students studying */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover-card-fx">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <History size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Богатая история</h3>
            <p className="text-muted-foreground leading-relaxed">
              Основанный более 50 лет назад, колледж выпустил тысячи специалистов, 
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
