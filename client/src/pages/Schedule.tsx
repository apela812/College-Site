import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, Users, MapPin, User, BookOpen } from "lucide-react";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

interface ScheduleItem {
  id: number;
  group: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher?: string;
  classroom?: string;
}

export default function Schedule() {
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  const { data: groupsData } = useQuery({
    queryKey: ["schedule-groups"],
    queryFn: async () => {
      const res = await fetch("/api/schedule/groups");
      if (!res.ok) throw new Error("Failed to fetch groups");
      return res.json();
    },
  });

  const groups = Array.isArray(groupsData) ? groupsData : [];

  const { data: scheduleData = [], isLoading } = useQuery({
    queryKey: ["schedule", selectedGroup],
    queryFn: async () => {
      const url = selectedGroup
        ? `/api/schedule?group=${selectedGroup}`
        : "/api/schedule";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch schedule");
      return res.json();
    },
    enabled: !!selectedGroup,
  });

  const schedule = Array.isArray(scheduleData) ? scheduleData : [];

  const scheduleByDay = schedule.reduce(
    (acc: Record<number, ScheduleItem[]>, item: ScheduleItem) => {
      if (!acc[item.dayOfWeek]) {
        acc[item.dayOfWeek] = [];
      }
      acc[item.dayOfWeek].push(item);
      return acc;
    },
    {}
  );

  // Сортировка по времени
  Object.keys(scheduleByDay).forEach((day) => {
    scheduleByDay[parseInt(day)].sort(
      (a: ScheduleItem, b: ScheduleItem) =>
        a.startTime.localeCompare(b.startTime)
    );
  });

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
                <BookOpen size={28} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Расписание занятий</h1>
            <p className="text-lg text-muted-foreground">
              Актуальное расписание уроков для всех групп колледжа
            </p>
          </motion.div>
        </div>

        {/* Group Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Users size={24} className="text-primary" />
              <h2 className="text-xl font-bold">Выбор группы</h2>
            </div>
            
            {groups.length === 0 ? (
              <p className="text-muted-foreground">Загрузка групп...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {groups.map((group: string) => (
                  <Button
                    key={group}
                    variant={selectedGroup === group ? "default" : "outline"}
                    onClick={() => setSelectedGroup(group)}
                    className="rounded-full"
                  >
                    {group}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Schedule Grid */}
        {selectedGroup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid gap-6"
          >
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Загрузка расписания...</p>
              </div>
            ) : schedule.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
                <p className="text-muted-foreground">Расписание не найдено для группы {selectedGroup}</p>
              </div>
            ) : (
              DAYS.map((day, dayIndex) => {
                const daySchedule = scheduleByDay[dayIndex + 1] || [];
                return (
                  <motion.div
                    key={dayIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: dayIndex * 0.05 }}
                    className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden hover-card-fx"
                  >
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-4 border-b border-border/50">
                      <h3 className="text-xl font-bold">{day}</h3>
                    </div>
                    
                    <div className="p-6">
                      {daySchedule.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">Занятий нет</p>
                      ) : (
                        <div className="space-y-4">
                          {daySchedule.map((item: ScheduleItem, idx: number) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex gap-4 p-4 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors border border-border/50"
                            >
                              <div className="flex items-center gap-2 min-w-24 flex-shrink-0">
                                <Clock size={18} className="text-primary" />
                                <div>
                                  <p className="font-bold text-lg">{item.startTime}</p>
                                  <p className="text-xs text-muted-foreground">{item.endTime}</p>
                                </div>
                              </div>
                              
                              <div className="flex-1 border-l border-border/50 pl-4">
                                <p className="font-semibold text-lg mb-2">{item.subject}</p>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  {item.teacher && (
                                    <div className="flex items-center gap-2">
                                      <User size={16} />
                                      <span>{item.teacher}</span>
                                    </div>
                                  )}
                                  {item.classroom && (
                                    <div className="flex items-center gap-2">
                                      <MapPin size={16} />
                                      <span>Кабинет {item.classroom}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
