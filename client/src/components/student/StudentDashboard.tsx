import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Newspaper, User, LogOut } from "lucide-react";
import { useState } from "react";

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"schedule" | "news" | "profile">("schedule");

  // Получить расписание студента (по его группе)
  const { data: schedule = [] } = useQuery({
    queryKey: ["schedule", user?.groupId],
    queryFn: async () => {
      const res = await fetch(`/api/schedule`);
      if (!res.ok) throw new Error("Failed to fetch schedule");
      return res.json();
    },
  });

  // Получить новости
  const { data: news = [] } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await fetch(`/api/news`);
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
  });

  const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

  // Группировать расписание по дням
  const scheduleByDay = schedule.reduce((acc: any, item: any) => {
    const day = daysOfWeek[item.dayOfWeek - 1] || `День ${item.dayOfWeek}`;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">👋 Добро пожаловать, {user?.firstName}!</h1>
            <p className="text-sm text-muted-foreground">Личный кабинет студента</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => logout()} className="gap-2">
            <LogOut size={16} />
            Выход
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "schedule" ? "default" : "ghost"}
            onClick={() => setActiveTab("schedule")}
            className="gap-2"
          >
            <Calendar size={18} />
            Расписание
          </Button>
          <Button
            variant={activeTab === "news" ? "default" : "ghost"}
            onClick={() => setActiveTab("news")}
            className="gap-2"
          >
            <Newspaper size={18} />
            Новости
          </Button>
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            onClick={() => setActiveTab("profile")}
            className="gap-2"
          >
            <User size={18} />
            Профиль
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Расписание */}
          {activeTab === "schedule" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">📅 Расписание занятий</h2>
              {Object.keys(scheduleByDay).length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Расписание не загружено. Обратитесь к администратору.</p>
                </Card>
              ) : (
                Object.entries(scheduleByDay).map(([day, items]: [string, any]) => (
                  <div key={day} className="space-y-2">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground px-1">📌 {day}</h3>
                    <div className="grid gap-2">
                      {items.map((item: any) => (
                        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg">{item.subject}</h4>
                              <p className="text-sm text-muted-foreground">
                                ⏰ {item.startTime} - {item.endTime}
                              </p>
                              <div className="flex gap-4 mt-2 text-sm">
                                <span>👨‍🏫 {item.teacher}</span>
                                <span>🏢 Кабинет {item.classroom}</span>
                              </div>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                              {item.startTime}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Новости */}
          {activeTab === "news" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">📰 Актуальные новости</h2>
              {news.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <Newspaper size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Новостей пока нет</p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {news.slice(0, 10).map((item: any) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex gap-4 p-4">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.titleRu}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{item.titleRu}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.contentRu}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            📅 {new Date(item.publishedAt).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Профиль */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">👤 Мой профиль</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase">Роль</p>
                      <p className="text-lg font-bold">
                        {user?.role === "student" ? "👨‍🎓 Студент" : user?.role === "teacher" ? "👨‍🏫 Учитель" : "🔑 Администратор"}
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase">Группа</p>
                      <p className="text-lg font-bold">{user?.groupId ? `Группа ${user?.groupId}` : "Не назначена"}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                    <p className="text-sm">
                      💡 <strong>Совет:</strong> Регулярно проверяйте расписание и новости. Обновления выходят каждый день.
                    </p>
                  </div>

                  <Button className="w-full gap-2" onClick={() => logout()}>
                    <LogOut size={16} />
                    Выход из аккаунта
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
