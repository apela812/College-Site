import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'dean' | 'teacher' | 'student';
  groupId?: number;
}

const STORAGE_KEY = 'auth_token';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY);
    }
    return null;
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!token) return null;
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        return null;
      }
      return res.json();
    },
    enabled: !!token,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: string;
    }) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Ошибка регистрации');
      }
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
      queryClient.setQueryData(['auth', 'me'], data.user);
      // Invalidate and refetch to update user state
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Неправильный email или пароль');
      }
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
      queryClient.setQueryData(['auth', 'me'], data.user);
      // Invalidate and refetch to update user state
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    queryClient.setQueryData(['auth', 'me'], null);
  }, []);

  const hasRole = useCallback((...roles: string[]) => {
    return user && roles.includes(user.role);
  }, [user]);

  return {
    user: user as AuthUser | null,
    token,
    isLoading: isLoadingUser,
    isAuthenticated: !!user,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout,
    hasRole,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    registerError: registerMutation.error?.message,
    loginError: loginMutation.error?.message,
  };
}
