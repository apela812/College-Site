import { PageTransition } from "@/components/layout/PageTransition";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Stethoscope, Syringe, Pill, Baby } from "lucide-react";

export default function Applicants() {
  const { t } = useI18n();

  const programs = [
    { icon: <Stethoscope size={28} />, name: "Лечебное дело", desc: "Квалификация: Фельдшер. Срок обучения: 3 г. 10 мес." },
    { icon: <Syringe size={28} />, name: "Сестринское дело", desc: "Квалификация: Медицинская сестра/брат. Срок: 2 г. 10 мес." },
    { icon: <Pill size={28} />, name: "Фармация", desc: "Квалификация: Фармацевт. Срок обучения: 2 г. 10 мес." },
    { icon: <Baby size={28} />, name: "Акушерское дело", desc: "Квалификация: Акушерка/Акушер. Срок обучения: 2 г. 10 мес." }
  ];

  return (
    <PageTransition className="pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t('applicants.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Информация о правилах приема, специальностях и необходимых документах для поступления.
          </p>
        </div>

        <h2 className="text-2xl font-display font-bold mb-8">{t('applicants.programs')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {programs.map((prog, idx) => (
            <Card key={idx} className="p-6 bg-card border-border/50 hover-card-fx group">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {prog.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{prog.name}</h3>
              <p className="text-sm text-muted-foreground">{prog.desc}</p>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl">
          <h2 className="text-2xl font-display font-bold mb-8">Часто задаваемые вопросы</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-border/50">
              <AccordionTrigger className="text-lg font-medium">Какие документы нужны для поступления?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Для поступления необходимы: оригинал или ксерокопия документов, удостоверяющих личность, гражданство; оригинал или ксерокопия документа об образовании; 4 фотографии 3х4; медицинская справка 086-у.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-border/50">
              <AccordionTrigger className="text-lg font-medium">Предоставляется ли общежитие?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                Да, иногородним студентам предоставляется благоустроенное общежитие, расположенное в шаговой доступности от учебных корпусов.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-border/50">
              <AccordionTrigger className="text-lg font-medium">Есть ли вступительные испытания?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                На специальности "Лечебное дело", "Сестринское дело" и "Акушерское дело" проводится обязательное психологическое тестирование.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

      </div>
    </PageTransition>
  );
}
