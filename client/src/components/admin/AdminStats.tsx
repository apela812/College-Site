import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Users, BookOpen, Newspaper, BarChart3 } from "lucide-react";

export function AdminStats() {
  const token = localStorage.getItem("auth_token");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!token,
  });

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  const statItems = [
    {
      label: "Всего пользователей",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Групп",
      value: stats?.totalGroups || 0,
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      label: "Новостей",
      value: stats?.totalNews || 0,
      icon: Newspaper,
      color: "bg-purple-500",
    },
    {
      label: "Администраторов",
      value: stats?.usersByRole?.admin || 0,
      icon: BarChart3,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Статистика системы</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="p-6 space-y-2">
              <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-2`}>
                <Icon size={24} className="text-white" />
              </div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-3xl font-bold">{item.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Разбивка по ролям */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Распределение по ролям</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Администраторы</span>
            <span className="font-semibold">{stats?.usersByRole?.admin || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Завучи</span>
            <span className="font-semibold">{stats?.usersByRole?.dean || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Преподаватели</span>
            <span className="font-semibold">{stats?.usersByRole?.teacher || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Студенты</span>
            <span className="font-semibold">{stats?.usersByRole?.student || 0}</span>
          </div>
        </div>
      </Card>

      {/* Последние новости */}
      {stats?.recentNews && stats.recentNews.length > 0 && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Последние новости</h3>
          <div className="space-y-3">
            {stats.recentNews.map((news: any, idx: number) => (
              <div key={idx} className="pb-3 border-b last:border-b-0">
                <p className="font-medium text-sm">{news.titleRu}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(news.publishedAt).toLocaleDateString("ru-RU")}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
