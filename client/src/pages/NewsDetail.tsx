import { useParams, Link } from "wouter";
import { useNewsArticle } from "@/hooks/use-news";
import { useI18n, getLocalizedField } from "@/lib/i18n";
import { PageTransition } from "@/components/layout/PageTransition";
import { format } from "date-fns";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useI18n();
  const { data: article, isLoading, error } = useNewsArticle(Number(id));

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
        <div className="h-8 w-32 bg-muted animate-pulse rounded mb-8" />
        <div className="h-12 w-3/4 bg-muted animate-pulse rounded mb-6" />
        <div className="h-96 w-full bg-muted animate-pulse rounded-3xl mb-8" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <Link href="/news">
          <Button>Back to News</Button>
        </Link>
      </div>
    );
  }

  const title = getLocalizedField(article, 'title', lang);
  const content = getLocalizedField(article, 'content', lang);

  return (
    <PageTransition className="pt-28 pb-20">
      <article className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        <Link href="/news">
          <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to News
          </Button>
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-2 text-primary font-medium mb-6 bg-primary/10 w-fit px-4 py-1.5 rounded-full">
            <Calendar size={16} />
            {(article as any)?.publishedAt ? format(new Date((article as any).publishedAt), 'dd MMMM yyyy') : ''}
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold leading-tight mb-6">
            {title}
          </h1>
        </header>

        {(article as any)?.imageUrl && (
          <div className="rounded-3xl overflow-hidden mb-12 shadow-xl border border-border/50">
            <img 
              src={(article as any).imageUrl} 
              alt={title}
              className="w-full h-auto max-h-[600px] object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-headings:font-display max-w-none text-foreground/90">
          {content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6">{paragraph}</p>
          ))}
        </div>

      </article>
    </PageTransition>
  );
}
