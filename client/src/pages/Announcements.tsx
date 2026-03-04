import { useQuery } from "@tanstack/react-query";
import { PageTransition } from "@/components/layout/PageTransition";
import { motion } from "framer-motion";
import { AlertTriangle, Info, AlertCircle, Calendar, Bell } from "lucide-react";

interface Announcement {
  id: number;
  titleRu: string;
  descriptionRu: string;
  type: "important" | "warning" | "info";
  publishedAt: number;
}

export default function Announcements() {
  const { data: announcementsData, isLoading, error } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await fetch("/api/announcements");
      if (!res.ok) throw new Error("Failed to fetch announcements");
      return res.json();
    },
  });

  const announcements = Array.isArray(announcementsData) ? announcementsData : [];

  const getIcon = (type: string) => {
    switch (type) {
      case "important":
        return <AlertCircle size={24} />;
      case "warning":
        return <AlertTriangle size={24} />;
      default:
        return <Info size={24} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "important":
        return "from-red-500/10 to-red-500/5 border-red-500/30";
      case "warning":
        return "from-yellow-500/10 to-yellow-500/5 border-yellow-500/30";
      default:
        return "from-blue-500/10 to-blue-500/5 border-blue-500/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "important":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                <Bell size={28} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Объявления</h1>
            <p className="text-lg text-muted-foreground">
              Важная информация и новости колледжа
            </p>
          </motion.div>
        </div>

        {/* Announcements */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">Загрузка объявлений...</p>
          </motion.div>
        ) : announcements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-card rounded-2xl p-12 text-center border border-border/50"
          >
            <p className="text-muted-foreground text-lg">Нет активных объявлений</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {announcements.map((announcement: Announcement, idx: number) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-r ${getTypeColor(
                  announcement.type
                )} rounded-2xl border p-8 shadow-sm hover-card-fx group`}
              >
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 ${getTypeIcon(announcement.type)} mt-1`}>
                    {getIcon(announcement.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {announcement.titleRu}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {announcement.descriptionRu}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={16} />
                      <span>{formatDate(announcement.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
