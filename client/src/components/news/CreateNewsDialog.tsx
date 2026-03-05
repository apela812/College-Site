import { useState } from "react";
import { useCreateNews } from "@/hooks/use-news";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateNewsDialog() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { mutate: createNews, isPending } = useCreateNews();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    titleRu: "", contentRu: "",
    titleEn: "", contentEn: "",
    titleTt: "", contentTt: "",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({ title: "Ошибка", description: "Вы должны быть авторизованы", variant: "destructive" });
      return;
    }

    createNews(formData, {
      onSuccess: () => {
        toast({ title: "Успешно", description: "Новость создана успешно!" });
        setOpen(false);
        setFormData({
          titleRu: "", contentRu: "", titleEn: "", contentEn: "", titleTt: "", contentTt: "", imageUrl: ""
        });
      },
      onError: (err: any) => {
        toast({ title: "Ошибка", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 hover:shadow-primary/40">
          <PlusCircle size={18} />
          {t('news.add')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('news.add')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input 
              name="imageUrl" 
              value={formData.imageUrl} 
              onChange={handleChange} 
              placeholder="https://unsplash.com/..." 
            />
          </div>

          <Tabs defaultValue="ru" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ru">Русский</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="tt">Татарча</TabsTrigger>
            </TabsList>
            
            {/* RU */}
            <TabsContent value="ru" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Заголовок</label>
                <Input required name="titleRu" value={formData.titleRu} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Содержание</label>
                <Textarea required name="contentRu" value={formData.contentRu} onChange={handleChange} rows={5} />
              </div>
            </TabsContent>

            {/* EN */}
            <TabsContent value="en" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input required name="titleEn" value={formData.titleEn} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea required name="contentEn" value={formData.contentEn} onChange={handleChange} rows={5} />
              </div>
            </TabsContent>

            {/* TT */}
            <TabsContent value="tt" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Баш исем</label>
                <Input required name="titleTt" value={formData.titleTt} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Эчтәлек</label>
                <Textarea required name="contentTt" value={formData.contentTt} onChange={handleChange} rows={5} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('form.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
