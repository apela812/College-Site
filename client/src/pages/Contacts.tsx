import { useQuery } from "@tanstack/react-query";
import { PageTransition } from "@/components/layout/PageTransition";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, User, Building, Globe, PhoneCall } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  department?: string;
  email?: string;
  phone?: string;
  position?: string;
}

export default function Contacts() {
  const { data: contactsData, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await fetch("/api/contacts");
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
  });

  const contacts = Array.isArray(contactsData) ? contactsData : [];

  return (
    <PageTransition className="pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <PhoneCall size={28} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Контакты</h1>
            <p className="text-lg text-muted-foreground">
              Свяжитесь с нами для получения информации
            </p>
          </motion.div>
        </div>

        {/* Main Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto"
        >
          {/* Address */}
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-8 hover-card-fx">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Адрес</h3>
            <p className="font-semibold text-foreground mb-2">
              ГАПОУ "Альметьевский медицинский колледж"
            </p>
            <p className="text-muted-foreground leading-relaxed">
              423450, Республика Татарстан
            </p>
            <p className="text-muted-foreground leading-relaxed">
              г. Альметьевск, ул. Тельмана, д. 58
            </p>
          </div>

          {/* Phone */}
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-8 hover-card-fx">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <Phone size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Центральный телефон</h3>
            <a 
              href="tel:+78553434334"
              className="text-lg font-semibold text-primary hover:underline mb-3 block"
            >
              +7 (8553) 43-43-34
            </a>
            <p className="text-muted-foreground text-sm">
              Режим работы: Пн-Пт 8:00-17:00
            </p>
          </div>
        </motion.div>

        {/* Departments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center gap-3 mb-8">
              <Building size={28} className="text-primary" />
              <h2 className="text-2xl font-bold">Контакты отделов</h2>
            </div>

            {isLoading ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
                <p className="text-muted-foreground">Загрузка контактов...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
                <p className="text-muted-foreground">Контакты не найдены</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact: Contact, idx: number) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 hover-card-fx group"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <User size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold leading-tight group-hover:text-primary transition-colors">
                          {contact.name}
                        </p>
                        {contact.position && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {contact.position}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {contact.department && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building size={16} className="text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{contact.department}</span>
                        </div>
                      )}

                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors group/link"
                        >
                          <Phone size={16} className="text-primary flex-shrink-0" />
                          <span className="group-hover/link:underline">{contact.phone}</span>
                        </a>
                      )}

                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors group/link break-all"
                        >
                          <Mail size={16} className="text-primary flex-shrink-0" />
                          <span className="group-hover/link:underline text-xs">{contact.email}</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-3xl mx-auto mt-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/30"
        >
          <div className="flex gap-4">
            <Globe size={24} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-3">Полезная информация</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Приёмная комиссия работает в период приёма документов</li>
                <li>✓ Консультации проводятся по предварительной записи</li>
                <li>✓ Электронные документы отправляются на адрес приёмной комиссии</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
