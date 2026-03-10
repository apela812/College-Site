import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Edit2, Download, Copy, Search, Clock, Users, BookOpen, MapPin, ChevronDown, ChevronUp } from "lucide-react";

// Дни недели: 1=Понедельник, 2=Вторник, ..., 7=Воскресенье
const DAYS_OF_WEEK = [
  { value: "1", label: "Понедельник" },
  { value: "2", label: "Вторник" },
  { value: "3", label: "Среда" },
  { value: "4", label: "Четверг" },
  { value: "5", label: "Пятница" },
  { value: "6", label: "Суббota" },
  { value: "7", label: "Воскресенье" },
];

// Предопределённые пары с временем
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

export function ScheduleManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"day" | "group" | "time">("day");
  const [expandedDaySlots, setExpandedDaySlots] = useState<string>("");
  const [showLessonSelector, setShowLessonSelector] = useState(false);

  const [formData, setFormData] = useState({
    group: "",
    subject: "",
    teacher: "",
    dayOfWeek: "",
    selectedLessons: [] as number[],
    startTime: "",
    endTime: "",
    classroom: "",
  });

  const token = localStorage.getItem("auth_token");

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

  // Создать/обновить расписание
  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/schedule/${editingId}` : "/api/schedule";

      // Преобразуем dayOfWeek в число перед отправкой
      const submitData = {
        ...data,
        dayOfWeek: parseInt(data.dayOfWeek),
      };
      
      // Удаляем selectedLessons, так как это только для UI
      delete (submitData as any).selectedLessons;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: editingId ? "Расписание обновлено" : "Расписание создано",
      });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      setOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Удалить расписание
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/schedule/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete schedule");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Успешно", description: "Расписание удалено" });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
    onError: (err: any) => {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Экспортировать расписание
  const handleExport = (group: string) => {
    const link = document.createElement("a");
    link.href = `/api/schedule/export/${group}`;
    link.download = `schedule-${group}.json`;
    link.click();
  };

  const resetForm = () => {
    setFormData({
      group: "",
      subject: "",
      teacher: "",
      dayOfWeek: "",
      selectedLessons: [],
      startTime: "",
      endTime: "",
      classroom: "",
    });
    setEditingId(null);
    setShowLessonSelector(false);
  };

  const handleEdit = (item: ScheduleItem) => {
    const matchingSlot = LESSON_SLOTS.find(
      slot => slot.startTime === item.startTime && slot.endTime === item.endTime
    );
    
    setFormData({
      group: item.group,
      subject: item.subject,
      teacher: item.teacher,
      dayOfWeek: String(item.dayOfWeek),
      selectedLessons: matchingSlot ? [matchingSlot.id] : [],
      startTime: item.startTime,
      endTime: item.endTime,
      classroom: item.classroom,
    });
    setEditingId(item.id);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Если выбраны пары, берём время из первой пары (для совместимости)
    // Или можно создать несколько записей для каждой пары
    if (formData.selectedLessons.length > 0) {
      // Создаём запись для каждой выбранной пары
      formData.selectedLessons.forEach(lessonId => {
        const slot = LESSON_SLOTS.find(s => s.id === lessonId);
        if (slot) {
          upsertMutation.mutate({
            ...formData,
            startTime: slot.startTime,
            endTime: slot.endTime,
          });
        }
      });
    } else if (formData.startTime && formData.endTime) {
      // Если пара не выбрана, используем ручное время
      upsertMutation.mutate(formData);
    } else {
      toast({
        title: "Ошибка",
        description: "Выберите пару или укажите время вручную",
        variant: "destructive",
      });
    }
  };

  const getDayLabel = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find(d => parseInt(d.value) === dayOfWeek)?.label || String(dayOfWeek);
  };

  const handleDuplicate = (item: ScheduleItem) => {
    const matchingSlot = LESSON_SLOTS.find(
      slot => slot.startTime === item.startTime && slot.endTime === item.endTime
    );
    
    setFormData({
      group: item.group,
      subject: item.subject,
      teacher: item.teacher,
      dayOfWeek: String(item.dayOfWeek),
      selectedLessons: matchingSlot ? [matchingSlot.id] : [],
      startTime: item.startTime,
      endTime: item.endTime,
      classroom: item.classroom,
    });
    setEditingId(null);
    setOpen(true);
    toast({
      title: "Дублирование",
      description: "Форма заполнена на основе этой записи. Отредактируй и сохрани.",
    });
  };

  const filteredSchedule = schedule.filter((item: ScheduleItem) => {
    const query = searchQuery.toLowerCase();
    return (
      item.group.toLowerCase().includes(query) ||
      item.subject.toLowerCase().includes(query) ||
      item.teacher.toLowerCase().includes(query) ||
      item.classroom.toLowerCase().includes(query)
    );
  });

  const groupedSchedule = filteredSchedule.reduce((acc, item: ScheduleItem) => {
    let key: string;
    if (sortBy === "day") {
      key = getDayLabel(item.dayOfWeek);
    } else if (sortBy === "group") {
      key = item.group;
    } else {
      key = item.startTime;
    }
    
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  const sortedKeys = Object.keys(groupedSchedule).sort((a, b) => {
    if (sortBy === "day") {
      const dayOrder = DAYS_OF_WEEK.map(d => d.label);
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    } else if (sortBy === "time") {
      return a.localeCompare(b);
    }
    return a.localeCompare(b);
  });

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Header с заголовком и кнопкой добавления */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 pb-3 border-b">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>📚</span> Управление расписанием
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Редактируй расписание занятий для групп
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 whitespace-nowrap">
              <Plus size={18} />
              Новое занятие
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-lg">
                {editingId ? "✏️ Редактировать занятие" : "➕ Добавить новое занятие"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 flex items-center gap-1 uppercase tracking-wide text-muted-foreground">
                    <Users size={14} />
                    Группа
                  </label>
                  <Input
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    placeholder="ПВ-201"
                    required
                    className="border-2 h-9"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 flex items-center gap-1 uppercase tracking-wide text-muted-foreground">
                    <BookOpen size={14} />
                    Предмет
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Анатомия"
                    required
                    className="border-2 h-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block uppercase tracking-wide text-muted-foreground">Преподаватель</label>
                <Input
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  placeholder="И.О. Преподавателя"
                  required
                  className="border-2 h-9"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block uppercase tracking-wide text-muted-foreground">День</label>
                  <Select value={formData.dayOfWeek} onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}>
                    <SelectTrigger className="border-2 h-9">
                      <SelectValue placeholder="День" />
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
                <div className="col-span-2">
                  <label className="text-xs font-semibold mb-1 block uppercase tracking-wide text-muted-foreground">Пара</label>
                  <Button
                    type="button"
                    onClick={() => setShowLessonSelector(!showLessonSelector)}
                    variant="outline"
                    className="w-full border-2 h-9 justify-between"
                  >
                    <span className="text-sm">
                      {formData.selectedLessons.length > 0 
                        ? `Выбрано ${formData.selectedLessons.length}`
                        : "Выберите пару..."}
                    </span>
                    {showLessonSelector ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </Button>
                  
                  {showLessonSelector && (
                    <div className="mt-2 p-3 border-2 rounded-lg space-y-2 bg-slate-50 dark:bg-slate-900">
                      {LESSON_SLOTS.map((slot) => (
                        <div key={slot.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`lesson-${slot.id}`}
                            checked={formData.selectedLessons.includes(slot.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  selectedLessons: [...formData.selectedLessons, slot.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedLessons: formData.selectedLessons.filter(id => id !== slot.id)
                                });
                              }
                            }}
                          />
                          <label 
                            htmlFor={`lesson-${slot.id}`}
                            className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span className="font-semibold">{slot.number}</span>
                            <span className="text-xs text-muted-foreground">
                              {slot.startTime}–{slot.endTime}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex gap-2">
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-1">💡 Совет:</p>
                    <p>Выберите одну или несколько пар из списка выше, чтобы автоматически заполнить время.</p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <p className="font-semibold mb-2">или укажите время вручную:</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold mb-1 flex items-center gap-1 uppercase tracking-wide text-muted-foreground block">
                      <Clock size={14} />
                      Начало
                    </label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="border-2 h-9"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 flex items-center gap-1 uppercase tracking-wide text-muted-foreground block">
                      <Clock size={14} />
                      Конец
                    </label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="border-2 h-9"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 flex items-center gap-1 uppercase tracking-wide text-muted-foreground">
                  <MapPin size={14} />
                  Кабинет
                </label>
                <Input
                  value={formData.classroom}
                  onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                  placeholder="401"
                  required
                  className="border-2 h-9"
                />
              </div>

              <Button type="submit" className="w-full py-5 text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "⏳ Сохранение..." : "✅ Сохранить"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Фильтры и сортировка */}
      <div className="space-y-3">
        {/* Группы */}
        <div className="flex flex-wrap gap-1.5">
          <Button 
            variant={selectedGroup === "" ? "default" : "outline"}
            onClick={() => setSelectedGroup("")}
            className={selectedGroup === "" ? "bg-gradient-to-r from-blue-600 to-blue-700" : ""}
            size="sm"
          >
            <Users size={14} className="mr-1" />
            Все
          </Button>
          {groups.map((group: string) => (
            <Button
              key={group}
              variant={selectedGroup === group ? "default" : "outline"}
              onClick={() => setSelectedGroup(group)}
              size="sm"
              className={selectedGroup === group ? "bg-gradient-to-r from-purple-600 to-purple-700" : ""}
            >
              {group}
            </Button>
          ))}
        </div>

        {/* Поиск и сортировка */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              placeholder="🔍 Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 py-2 border-2 rounded-lg h-9 text-sm"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[140px] border-2 py-2 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">📅 По дням</SelectItem>
              <SelectItem value="group">👥 По группам</SelectItem>
              <SelectItem value="time">⏰ По времени</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Экспорт */}
        {selectedGroup && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExport(selectedGroup)} 
            className="gap-2 border-2 hover:bg-blue-50 h-9 text-sm"
          >
            <Download size={14} />
            Скачать
          </Button>
        )}
      </div>

      {/* Список расписания */}
      <div className="space-y-4">
        {filteredSchedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-semibold mb-1">Расписание не найдено</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {searchQuery ? "По вашему запросу ничего не найдено" : "Начните с создания первого занятия"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setOpen(true)} size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700">
                <Plus size={16} />
                Добавить занятие
              </Button>
            )}
          </div>
        ) : (
          sortedKeys.map((groupKey) => (
            <div key={groupKey} className="space-y-2">
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 -mx-2 px-2 py-2">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-5 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {groupKey}
                  </h3>
                  <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                    {groupedSchedule[groupKey].length}
                  </span>
                </div>
              </div>
              
              <div className="grid gap-2">
                {groupedSchedule[groupKey].map((item: ScheduleItem) => (
                  <Card 
                    key={item.id} 
                    className="p-3 hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-purple-500 bg-gradient-to-r from-white to-blue-50/40 dark:from-slate-950 dark:to-slate-900/40"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Название предмета и время */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-gray-900 dark:text-white">
                            {item.subject}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                            <Clock size={12} />
                            {item.startTime}–{item.endTime}
                          </span>
                        </div>

                        {/* Детали */}
                        <div className="flex flex-wrap gap-4 text-xs mt-1">
                          <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-blue-600 flex-shrink-0" />
                            <span className="text-muted-foreground">{item.group}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={14} className="text-green-600 flex-shrink-0" />
                            <span className="text-muted-foreground">{item.teacher}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-purple-600 flex-shrink-0" />
                            <span className="font-semibold">{item.classroom}</span>
                          </div>
                        </div>
                      </div>

                      {/* Кнопки действия */}
                      <div className="flex gap-0.5 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          title="Редактировать"
                          className="hover:bg-blue-100 dark:hover:bg-blue-900/40 h-8 w-8 p-0"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicate(item)}
                          title="Дублировать"
                          className="hover:bg-green-100 dark:hover:bg-green-900/40 h-8 w-8 p-0"
                        >
                          <Copy size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(item.id)}
                          disabled={deleteMutation.isPending}
                          title="Удалить"
                          className="hover:bg-red-100 dark:hover:bg-red-900/40 h-8 w-8 p-0"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
