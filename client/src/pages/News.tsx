import { useState } from "react";
import { Link } from "wouter";
import { useNews } from "@/hooks/use-news";
import { useI18n, getLocalizedField } from "@/lib/i18n";
import { PageTransition } from "@/components/layout/PageTransition";
import { CreateNewsDialog } from "@/components/news/CreateNewsDialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar, Search, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

export default function News() {
  const { t, lang } = useI18n();
  const { data: news, isLoading, error } = useNews();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNews = Array.isArray(news) ? news.filter((item: any) => {
    const title = getLocalizedField(item, 'title', lang).toLowerCase();
    const content = getLocalizedField(item, 'content', lang).toLowerCase();
    const term = searchTerm.toLowerCase();
    return title.includes(term) || content.includes(term);
  }) : [];

  return (
    <PageTransition className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t('nav.news')}</h1>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Поиск..." 
                className="pl-10 rounded-full bg-card"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CreateNewsDialog />
          </div>
        </div>

        {error ? (
          <div className="text-center py-20 text-destructive">
            <p>Error loading news. Please try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="h-[400px] animate-pulse bg-muted rounded-2xl border-none" />
            ))}
          </div>
        ) : filteredNews?.length === 0 ? (
          <div className="text-center py-32 bg-card rounded-3xl border border-border">
            <Newspaper className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground">{t('news.empty')}</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item: any, i: number) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/news/${item.id}`}>
                  <Card className="overflow-hidden hover-card-fx cursor-pointer h-full flex flex-col bg-card rounded-2xl">
                    <div className="relative h-56 overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt="News" 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Newspaper className="w-12 h-12 text-primary/40" />
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
                      <div className="flex items-center text-primary font-medium text-sm mt-auto">
                        {t('news.readMore')} <span className="ml-1">→</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </PageTransition>
  );
}
