import { useAuth } from "@/hooks/use-auth";
import { StudentDashboard } from "@/components/student/StudentDashboard";
import { useLocation } from "wouter";

export function StudentPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  // Доступ только для студентов
  if (!user || (user.role !== "student" && user.role !== "teacher")) {
    setLocation("/auth");
    return null;
  }

  return <StudentDashboard />;
}
