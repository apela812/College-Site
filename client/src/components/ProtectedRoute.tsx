import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  requiredRoles?: string[];
}

export function ProtectedRoute({ component: Component, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/auth');
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role || '')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Доступ запрещен</h1>
          <p className="text-gray-600 mt-2">У вас нет прав для доступа к этой странице</p>
        </div>
      </div>
    );
  }

  return <Component />;
}
