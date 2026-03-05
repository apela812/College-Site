import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle, Check, Copy, Trash2 } from 'lucide-react';

export function GroupManager() {
  const { token } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSpecialty, setNewGroupSpecialty] = useState('');
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Fetch groups
  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await fetch('/api/groups');
      if (!res.ok) throw new Error('Failed to fetch groups');
      return res.json();
    },
  });

  // Fetch group members
  const { data: members = [] } = useQuery({
    queryKey: ['group', selectedGroupId, 'members'],
    queryFn: async () => {
      if (!selectedGroupId) return [];
      const res = await fetch(`/api/groups/${selectedGroupId}/members`);
      if (!res.ok) throw new Error('Failed to fetch members');
      return res.json();
    },
    enabled: !!selectedGroupId,
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: async () => {
      if (!newGroupName) throw new Error('Group name is required');
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newGroupName,
          specialty: newGroupSpecialty,
        }),
      });
      if (!res.ok) throw new Error('Failed to create group');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      setNewGroupName('');
      setNewGroupSpecialty('');
    },
  });

  // Add student to group mutation
  const addStudentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedGroupId) throw new Error('Select a group');
      if (!studentData.firstName || !studentData.lastName || !studentData.email) {
        throw new Error('Fill in all fields');
      }

      const res = await fetch(`/api/groups/${selectedGroupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          role: 'student',
        }),
      });

      if (!res.ok) throw new Error('Failed to add student');
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['group', selectedGroupId, 'members'] });
      if (data.temporaryPassword) {
        setGeneratedPassword(data.temporaryPassword);
        setShowPassword(true);
      }
      setStudentData({ firstName: '', lastName: '', email: '' });
    },
  });

  // Remove student from group mutation
  const removeStudentMutation = useMutation({
    mutationFn: async (userId: number) => {
      if (!selectedGroupId) throw new Error('No group selected');
      const res = await fetch(`/api/groups/${selectedGroupId}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to remove student');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['group', selectedGroupId, 'members'] });
    },
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: number) => {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete group');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      setSelectedGroupId(null);
    },
  });

  const qc = useQueryClient();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Скопировано в буфер обмена!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Group Section */}
      <Card>
        <CardHeader>
          <CardTitle>Создать новую группу</CardTitle>
          <CardDescription>Добавьте новую группу студентов</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Название группы</Label>
              <Input
                id="groupName"
                placeholder="e.g., М-101"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Специальность</Label>
              <Input
                id="specialty"
                placeholder="e.g., Медсестра"
                value={newGroupSpecialty}
                onChange={(e) => setNewGroupSpecialty(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={() => createGroupMutation.mutate()}
            disabled={createGroupMutation.isPending}
            className="w-full"
          >
            {createGroupMutation.isPending ? 'Creating...' : 'Создать группу'}
          </Button>
        </CardContent>
      </Card>

      {/* Manage Group Section */}
      {groups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Управление группой</CardTitle>
            <CardDescription>Добавьте студентов в группу</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="selectGroup">Выберите группу</Label>
              <select
                id="selectGroup"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={selectedGroupId || ''}
                onChange={(e) => setSelectedGroupId(parseInt(e.target.value) || null)}
              >
                <option value="">-- Выберите группу --</option>
                {groups.map((group: any) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedGroupId && (
              <>
                {/* Add Student Form */}
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-semibold">Добавить студента</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Имя</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={studentData.firstName}
                        onChange={(e) =>
                          setStudentData({ ...studentData, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={studentData.lastName}
                        onChange={(e) =>
                          setStudentData({ ...studentData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      value={studentData.email}
                      onChange={(e) =>
                        setStudentData({ ...studentData, email: e.target.value })
                      }
                    />
                  </div>

                  {generatedPassword && showPassword && (
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Студент успешно добавлен!</p>
                            <p className="text-sm mt-1">
                              Временный пароль: <code className="bg-white px-2 py-1 rounded">{generatedPassword}</code>
                            </p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(generatedPassword)}
                            className="ml-2"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={() => addStudentMutation.mutate()}
                    disabled={addStudentMutation.isPending}
                    className="w-full"
                  >
                    {addStudentMutation.isPending ? 'Adding...' : 'Добавить студента'}
                  </Button>
                </div>

                {/* Members List */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Члены группы ({members.length})</h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Вы уверены, что хотите удалить эту группу?')) {
                          deleteGroupMutation.mutate(selectedGroupId!);
                        }
                      }}
                      disabled={deleteGroupMutation.isPending}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Удалить группу
                    </Button>
                  </div>
                  {members.length > 0 ? (
                    <div className="space-y-2">
                      {members.map((member: any) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="font-medium">{member.firstName} {member.lastName}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {member.role}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (window.confirm('Удалить этого студента из группы?')) {
                                  removeStudentMutation.mutate(member.id);
                                }
                              }}
                              disabled={removeStudentMutation.isPending}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No members yet</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
