import { Link } from "wouter";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Zap, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface UnderConstructionProps {
  title?: string;
  description?: string;
}

export default function UnderConstruction({ 
  title = "Раздел в разработке",
  description = "Этот раздел находится в стадии разработки и скоро будет доступен. Спасибо за терпение!"
}: UnderConstructionProps) {
  return (
    <PageTransition className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div 
            className="mb-8 flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="p-8 bg-primary/10 rounded-full">
              <Zap className="w-16 h-16 text-primary" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {title}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
            {description}
          </p>

          {/* Construction progress visualization */}
          <div className="mb-12 space-y-4">
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <p className="text-sm font-medium mb-4 text-muted-foreground">Ход разработки</p>
              <div className="space-y-3">
                {['Дизайн', 'Функциональность', 'Тестирование'].map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <motion.div
                      className="w-4 h-4 bg-primary rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, delay: idx * 0.3, repeat: Infinity }}
                    />
                    <span className="text-sm font-medium">{stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <Home className="w-4 h-4" />
                На главную
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться назад
            </Button>
          </div>

          <p className="mt-12 text-xs text-muted-foreground">
            Если у вас есть вопросы, свяжитесь с нами: <span className="font-medium">amk-almet@mail.ru</span>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
