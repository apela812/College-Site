import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuthPage() {
  const { login, register, isLoggingIn, isRegistering, loginError, registerError, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = async (data: { email: string; password: string }) => {
    await login(data);
  };

  const handleRegister = async (data: any) => {
    await register(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Альметьевский МК</h1>
          <p className="text-gray-600 mt-2">Медицинский колледж</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <LoginForm
              onSubmit={handleLogin}
              error={loginError}
              isLoading={isLoggingIn}
            />
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <RegisterForm
              onSubmit={handleRegister}
              error={registerError}
              isLoading={isRegistering}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">
            <strong>Для тестирования:</strong>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Email: <code className="bg-white px-2 py-1 rounded">admin@almetmed.ru</code>
            <br />
            Пароль: <code className="bg-white px-2 py-1 rounded">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
