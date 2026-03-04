import { Link } from "wouter";
import { useI18n, getLocalizedField } from "@/lib/i18n";
import { useNews } from "@/hooks/use-news";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowRight, BookOpen, Stethoscope, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { t, lang } = useI18n();
  const { data: news, isLoading } = useNews();

  const stats = [
    { icon: <Users size={32} />, label: t('stats.students'), value: "1,200+" },
    { icon: <BookOpen size={32} />, label: t('stats.programs'), value: "8" },
    { icon: <Stethoscope size={32} />, label: t('stats.graduates'), value: "350+" },
  ];

  return (
    <PageTransition className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          {/* landing page hero modern college campus */}
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=1080&fit=crop" 
            alt="College Campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40 dark:from-background dark:via-background/90 dark:to-background/60" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Приемная кампания 2025 открыта
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl font-display font-extrabold leading-tight mb-6 text-foreground"
            >
              <span className="text-gradient">{t('hero.title')}</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/applicants">
                <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 h-14 text-base group cursor-pointer">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/news">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-2 bg-background/50 backdrop-blur-sm cursor-pointer">
                  {t('hero.secondary')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border shadow-sm relative z-20 -mt-10 mx-4 md:mx-auto md:max-w-5xl rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-display font-bold text-foreground mb-2">{stat.value}</h3>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent News Section */}
      <section className="py-24 container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t('news.latest')}</h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>
          <Link href="/news">
            <Button variant="ghost" className="hidden md:flex group">
              {t('news.all')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="h-96 animate-pulse bg-muted rounded-2xl border-none" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(news) && news.slice(0, 3).map((item: any, i: number) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/news/${item.id}`}>
                  <Card className="overflow-hidden hover-card-fx cursor-pointer h-full flex flex-col bg-card rounded-2xl">
                    <div className="relative h-56 overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt="News" 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="w-12 h-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                        <Calendar size={12} className="text-primary" />
                        {item.publishedAt ? format(new Date(item.publishedAt), 'dd.MM.yyyy') : ''}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight">
                        {getLocalizedField(item, 'title', lang)}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                        {getLocalizedField(item, 'content', lang)}
                      </p>
                      <div className="flex items-center text-primary font-medium text-sm mt-auto group-hover:underline">
                        {t('news.readMore')} <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/news">
            <Button variant="outline" className="w-full rounded-full">
              {t('news.all')}
            </Button>
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
