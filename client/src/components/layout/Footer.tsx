import { Link } from "wouter";
import { Cross, MapPin, Phone, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-12">
          
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Cross size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">{t('hero.title')}</h3>
              </div>
            </div>
            <p className="text-muted-foreground max-w-sm">
              {t('about.desc')}
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Навигация</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/applicants" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.applicants')}</Link></li>
              <li><Link href="/students" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.students')}</Link></li>
              <li><Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.news')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>РТ, г. Альметьевск, ул. Радищева, 41</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+7 (8553) 32-35-15</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>info@almetmed.ru</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Almetyevsk Medical College. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
