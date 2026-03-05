import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Edit2, Key } from "lucide-react";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function UserManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "student",
  });

  const token = localStorage.getItem("auth_token");

  // Получить всех пользователей
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: !!token,
  });

  // Создать пользователя
  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Успешно",
        description: `Пользователь создан. Временный пароль: ${data.temporaryPassword}`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setOpen(false);
      setFormData({ email: "", firstName: "", lastName: "", role: "student" });
    },
    onError: (err: any) => {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Изменить роль
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Успешно", description: "Роль обновлена" });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: any) => {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Удалить пользователя
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Успешно", description: "Пользователь удален" });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: any) => {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление пользователями</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Добавить пользователя
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать пользователя</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Имя</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Фамилия</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Роль</label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Студент</SelectItem>
                    <SelectItem value="teacher">Преподаватель</SelectItem>
                    <SelectItem value="dean">Завуч</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? "Создание..." : "Создать"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.map((user: User) => (
          <Card key={user.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={user.role}
                onValueChange={(newRole) => updateRoleMutation.mutate({ userId: user.id, role: newRole })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Студент</SelectItem>
                  <SelectItem value="teacher">Преподаватель</SelectItem>
                  <SelectItem value="dean">Завуч</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteUserMutation.mutate(user.id)}
                disabled={deleteUserMutation.isPending}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
