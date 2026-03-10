import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Clock, Users, BookOpen, MapPin } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: "1", label: "Понедельник" },
  { value: "2", label: "Вторник" },
  { value: "3", label: "Среда" },
  { value: "4", label: "Четверг" },
  { value: "5", label: "Пятница" },
  { value: "6", label: "Суббота" },
  { value: "7", label: "Воскресенье" },
];

const LESSON_SLOTS = [
  { id: 1, number: "1 Пара", startTime: "08:00", endTime: "09:30" },
  { id: 2, number: "2 Пара", startTime: "09:40", endTime: "11:10" },
  { id: 3, number: "3 Пара", startTime: "11:30", endTime: "13:20" },
  { id: 4, number: "4 Пара", startTime: "13:30", endTime: "15:00" },
  { id: 5, number: "5 Пара", startTime: "15:10", endTime: "16:40" },
  { id: 6, number: "6 Пара", startTime: "16:50", endTime: "18:20" },
  { id: 7, number: "7 Пара", startTime: "18:30", endTime: "20:00" },
];

interface ScheduleItem {
  id: number;
  group: string;
  subject: string;
  teacher: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  classroom: string;
}

export function ScheduleViewer() {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("1");

  // Получить расписание
  const { data: schedule = [], isLoading } = useQuery({
    queryKey: ["schedule", selectedGroup],
    queryFn: async () => {
      const url = selectedGroup ? `/api/schedule?group=${selectedGroup}` : "/api/schedule";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch schedule");
      return res.json();
    },
  });

  // Получить все группы
  const { data: groups = [] } = useQuery({
    queryKey: ["schedule", "groups"],
    queryFn: async () => {
      const res = await fetch("/api/schedule/groups");
      if (!res.ok) throw new Error("Failed to fetch groups");
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  // Фильтруем расписание по дню и группе
  const daySchedule = schedule
    .filter((item: ScheduleItem) => item.dayOfWeek === parseInt(selectedDay))
    .sort((a: ScheduleItem, b: ScheduleItem) => a.startTime.localeCompare(b.startTime));

  const currentDayLabel = DAYS_OF_WEEK.find(d => d.value === selectedDay)?.label;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-3 border-b">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-3">
          <span>📅</span> Просмотр расписания
        </h2>
        <p className="text-xs text-muted-foreground">
          Расписание занятий по дням и парам
        </p>
      </div>

      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-xs font-semibold mb-2 block text-muted-foreground">Группа</label>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="border-2 h-9">
              <SelectValue placeholder="Выберите группу..." />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group: string) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-xs font-semibold mb-2 block text-muted-foreground">День</label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="border-2 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Содержимое */}
      {!selectedGroup ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-lg font-semibold mb-1">Выберите группу</h3>
          <p className="text-sm text-muted-foreground text-center">
            Выберите группу из списка выше, чтобы просмотреть расписание
          </p>
        </div>
      ) : daySchedule.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-lg font-semibold mb-1">Нет занятий</h3>
          <p className="text-sm text-muted-foreground text-center">
            В {currentDayLabel?.toLowerCase()} на этот день нет занятий
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 -mx-2 px-2 py-2">
            <div className="flex items-center gap-2 px-1">
              <div className="h-5 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {currentDayLabel} — {selectedGroup}
              </h3>
              <span className="ml-auto text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                {daySchedule.length} {daySchedule.length === 1 ? "пара" : "пар"}
              </span>
            </div>
          </div>

          {/* Таблица пар */}
          <div className="space-y-2">
            {LESSON_SLOTS.map((slot) => {
              const lesson = daySchedule.find(
                (item: ScheduleItem) =>
                  item.startTime === slot.startTime && item.endTime === slot.endTime
              );

              return (
                <Card
                  key={slot.id}
                  className={`p-4 transition-all duration-200 ${
                    lesson
                      ? "border-l-4 border-l-green-500 bg-gradient-to-r from-white to-green-50/40 dark:from-slate-950 dark:to-green-900/20"
                      : "border-l-4 border-l-gray-300 bg-gray-50/50 dark:bg-slate-900/20 opacity-60"
                  }`}
                >
                  <div className="grid grid-cols-12 gap-3 items-start">
                    {/* Номер и время пары */}
                    <div className="col-span-3 sm:col-span-2">
                      <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {slot.number}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1 mt-1">
                        <Clock size={14} />
                        {slot.startTime}–{slot.endTime}
                      </div>
                    </div>

                    {/* Содержимое */}
                    {lesson ? (
                      <div className="col-span-9 sm:col-span-10 space-y-2">
                        <div>
                          <h4 className="text-base font-bold text-gray-900 dark:text-white">
                            {lesson.subject}
                          </h4>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs">
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={14} className="text-green-600 flex-shrink-0" />
                            <span className="text-muted-foreground">{lesson.teacher}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-purple-600 flex-shrink-0" />
                            <span className="font-semibold">{lesson.classroom}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="col-span-9 sm:col-span-10">
                        <p className="text-sm text-muted-foreground italic">
                          Нет занятия
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
