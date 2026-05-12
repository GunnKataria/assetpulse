'use client';

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockUsers, mockAllocations } from '@/lib/mock-data';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const user = { name: 'John Admin', email: 'admin@company.com', role: 'Administrator' };

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserAllocations = (userId: string) => {
    return mockAllocations.filter((a) => a.employeeId === userId);
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-destructive/20 text-destructive border-destructive/30',
    manager: 'bg-primary/20 text-primary border-primary/30',
    employee: 'bg-secondary/40 text-foreground border-secondary/60',
  };

  return (
    <AppShell user={user}>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground mt-1">Manage employee accounts and asset allocations.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees by name or email..."
            className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Employees List */}
        <div className="space-y-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((emp) => {
              const allocations = getUserAllocations(emp.id);
              return (
                <Card key={emp.id} className="bg-card border-border hover:border-primary transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{emp.name}</h3>
                          <Badge className={roleColors[emp.role]}>
                            {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{emp.email}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Department</p>
                            <p className="text-foreground font-medium">{emp.department || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Assets Allocated</p>
                            <p className="text-foreground font-medium">{allocations.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Member Since</p>
                            <p className="text-foreground font-medium">
                              {new Date(emp.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border text-foreground hover:bg-secondary"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">No employees found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
