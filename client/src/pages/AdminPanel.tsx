import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { GroupManager } from '@/components/GroupManager';
import { UserManager } from '@/components/admin/UserManager';
import { ScheduleManager } from '@/components/admin/ScheduleManager';
import { ScheduleViewer } from '@/components/admin/ScheduleViewer';
import { AdminStats } from '@/components/admin/AdminStats';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Newspaper, BarChart3, Calendar } from 'lucide-react';

export default function AdminPanel() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'admin' && user.role !== 'dean'))) {
      setLocation('/');
    }
  }, [isLoading, user, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Check if user has admin or dean role
  if (!user || (user.role !== 'admin' && user.role !== 'dean')) {
    return null;
  }

  const isAdminOnly = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Админ панель</h1>
          <p className="text-gray-600 mt-2">Добро пожаловать, {user.firstName}!</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 size={18} />
              <span className="hidden sm:inline">Статистика</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <BookOpen size={18} />
              <span className="hidden sm:inline">Управление</span>
            </TabsTrigger>
            <TabsTrigger value="schedule-view" className="gap-2">
              <Calendar size={18} />
              <span className="hidden sm:inline">Просмотр</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="gap-2">
              <Newspaper size={18} />
              <span className="hidden sm:inline">Группы</span>
            </TabsTrigger>
            {isAdminOnly && (
              <TabsTrigger value="users" className="gap-2">
                <Users size={18} />
                <span className="hidden sm:inline">Пользователи</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="stats" className="space-y-6 mt-6">
            <AdminStats />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6 mt-6">
            <ScheduleManager />
          </TabsContent>

          <TabsContent value="schedule-view" className="space-y-6 mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <ScheduleViewer />
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6 mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <GroupManager />
            </div>
          </TabsContent>

          {isAdminOnly && (
            <TabsContent value="users" className="space-y-6 mt-6">
              <div className="bg-white rounded-lg shadow p-6">
                <UserManager />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
