import { PageTransition } from "@/components/layout/PageTransition";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Calendar, FileText, Activity, HeartPulse } from "lucide-react";

export default function Students() {
  const { t } = useI18n();

  return (
    <PageTransition className="pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t('students.title')}</h1>
            <p className="text-lg text-muted-foreground">
              Все необходимые ресурсы для успешной учебы и насыщенной студенческой жизни в одном месте.
            </p>
          </div>
          <div className="flex-1 w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg">
            {/* medical lab */}
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop" 
              alt="Lab" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card className="p-8 flex items-start gap-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover-card-fx cursor-pointer">
            <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg">
              <Calendar size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{t('students.schedule')}</h3>
              <p className="text-muted-foreground mb-4">Актуальное расписание занятий, зачетов и экзаменов для всех курсов.</p>
              <span className="text-primary font-medium hover:underline">Смотреть расписание →</span>
            </div>
          </Card>

          <Card className="p-8 flex items-start gap-6 bg-card border-border hover-card-fx cursor-pointer">
            <div className="bg-secondary/10 text-secondary p-4 rounded-2xl">
              <FileText size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Электронная библиотека</h3>
              <p className="text-muted-foreground mb-4">Доступ к методическим материалам, учебникам и статьям.</p>
              <span className="text-secondary font-medium hover:underline">Перейти в библиотеку →</span>
            </div>
          </Card>
        </div>

        <h2 className="text-2xl font-display font-bold mb-8">Внеучебная деятельность</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <Activity className="w-12 h-12 text-accent-foreground mx-auto mb-4" />
            <h4 className="font-bold text-lg mb-2">Спорт и здоровье</h4>
            <p className="text-sm text-muted-foreground">Спортивные секции, тренажерный зал и соревнования.</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <HeartPulse className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h4 className="font-bold text-lg mb-2">Волонтерство</h4>
            <p className="text-sm text-muted-foreground">Участие в добровольческом отряде «Медик».</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h4 className="font-bold text-lg mb-2">Студсовет</h4>
            <p className="text-sm text-muted-foreground">Организация мероприятий, КВН, творческие кружки.</p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

// Ensure Users icon is imported at top - adding it here for completeness
import { Users } from "lucide-react";
