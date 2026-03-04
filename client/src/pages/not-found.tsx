import { Link } from "wouter";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <PageTransition className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="p-8 bg-destructive/10 rounded-full">
              <AlertCircle className="w-16 h-16 text-destructive" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-display font-bold mb-4">404</h1>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Страница не найдена
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            К сожалению, запрашиваемая страница не существует или была удалена.
            Пожалуйста, вернитесь на главную страницу и попробуйте снова.
          </p>
          
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
        </div>
      </div>
    </PageTransition>
  );
}
