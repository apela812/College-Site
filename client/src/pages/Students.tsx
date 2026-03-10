import { PageTransition } from "@/components/layout/PageTransition";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Calendar, FileText, Activity, HeartPulse, Users, Clock, MapPin, Phone, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop" 
              alt="Lab" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <Tabs defaultValue="schedule" className="mb-20">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-accent/20 rounded-2xl mb-8">
            <TabsTrigger value="schedule" className="py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="mr-2 w-5 h-5" />
              Расписание
            </TabsTrigger>
            <TabsTrigger value="media" className="py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="mr-2 w-5 h-5" />
              Медиа
            </TabsTrigger>
            <TabsTrigger value="contacts" className="py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Phone className="mr-2 w-5 h-5" />
              Контакты
            </TabsTrigger>
            <TabsTrigger value="resources" className="py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="mr-2 w-5 h-5" />
              Ресурсы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="mt-0">
            <Card className="p-8 border-border/50 bg-card rounded-3xl">
              <div className="flex items-center gap-4 mb-8">
                <Clock className="text-primary w-8 h-8" />
                <h2 className="text-3xl font-display font-bold">Расписание занятий</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['1 Курс', '2 Курс', '3 Курс'].map((kurs, i) => (
                  <div key={i} className="p-6 bg-accent/10 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                    <h4 className="text-xl font-bold mb-4">{kurs}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      <li>• Лечебное дело</li>
                      <li>• Сестринское дело</li>
                      <li>• Акушерское дело</li>
                    </ul>
                    <span className="text-primary font-bold group-hover:translate-x-1 transition-transform inline-block">Скачать PDF →</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "https://images.unsplash.com/photo-1576091160550-2173dad99978?w=600&h=400&fit=crop",
                "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=400&fit=crop",
                "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&h=400&fit=crop",
                "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&h=400&fit=crop",
                "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop",
                "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop"
              ].map((img, i) => (
                <div key={i} className="aspect-video rounded-2xl overflow-hidden shadow-sm hover:scale-105 transition-transform duration-500">
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Card className="p-8 border-border/50 bg-card rounded-3xl">
                <h2 className="text-3xl font-display font-bold mb-8">Свяжитесь с нами</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-primary w-6 h-6 shrink-0" />
                    <div>
                      <h4 className="font-bold">Адрес:</h4>
                      <p className="text-muted-foreground">Альметьевск, ул. Шевченко, д. 2Г</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="text-primary w-6 h-6 shrink-0" />
                    <div>
                      <h4 className="font-bold">Телефон приемной:</h4>
                      <p className="text-muted-foreground">+7 (8553) 43-43-34</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="text-primary w-6 h-6 shrink-0" />
                    <div>
                      <h4 className="font-bold">Email:</h4>
                      <p className="text-muted-foreground">amk-almet@mail.ru</p>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="rounded-3xl overflow-hidden h-[400px] border border-border/50 shadow-sm">
                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=1000&fit=crop" alt="Map" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-0">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 flex items-start gap-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover-card-fx cursor-pointer">
                  <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg">
                    <Calendar size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Электронный журнал</h3>
                    <p className="text-muted-foreground mb-4">Просмотр оценок и посещаемости в режиме реального времени.</p>
                    <span className="text-primary font-medium">Войти в систему →</span>
                  </div>
                </Card>

                <Card className="p-8 flex items-start gap-6 bg-card border-border hover-card-fx cursor-pointer">
                  <div className="bg-secondary/10 text-secondary p-4 rounded-2xl">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Библиотека</h3>
                    <p className="text-muted-foreground mb-4">Доступ к методическим материалам и учебникам.</p>
                    <span className="text-secondary font-medium">Перейти к книгам →</span>
                  </div>
                </Card>
              </div>
          </TabsContent>
        </Tabs>

        <h2 className="text-2xl font-display font-bold mb-8">Внеучебная деятельность</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm text-center hover-card-fx">
            <Activity className="w-12 h-12 text-primary mx-auto mb-4" />
            <h4 className="font-bold text-xl mb-2">Спорт и здоровье</h4>
            <p className="text-sm text-muted-foreground">Спортивные секции, тренажерный зал и ежегодные соревнования.</p>
          </div>
          <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm text-center hover-card-fx">
            <HeartPulse className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h4 className="font-bold text-xl mb-2">Волонтерство</h4>
            <p className="text-sm text-muted-foreground">Участие в добровольческом отряде «Медик» и помощь ветеранам.</p>
          </div>
          <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm text-center hover-card-fx">
            <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h4 className="font-bold text-xl mb-2">Студсовет</h4>
            <p className="text-sm text-muted-foreground">Организация мероприятий, КВН и творческие объединения.</p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
