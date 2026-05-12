'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockRepairs, mockAssets } from '@/lib/mock-data';
import { Repair } from '@/lib/types';
import { Plus, Search, X, AlertCircle, Clock, CheckCircle } from 'lucide-react';

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>(mockRepairs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const user = { name: 'John Admin', email: 'admin@company.com', role: 'Administrator' };

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch =
      repair.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || repair.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusIcons: Record<string, any> = {
    open: AlertCircle,
    in_progress: Clock,
    completed: CheckCircle,
    closed: CheckCircle,
  };

  const statusColors: Record<string, string> = {
    open: 'bg-red-500/20 text-red-400 border-red-500/30',
    in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const stats = {
    total: repairs.length,
    open: repairs.filter((r) => r.status === 'open').length,
    inProgress: repairs.filter((r) => r.status === 'in_progress').length,
    completed: repairs.filter((r) => r.status === 'completed').length,
    totalCost: repairs.reduce((sum, r) => sum + (r.cost || 0), 0),
  };

  const handleStatusChange = (repair: Repair, newStatus: Repair['status']) => {
    setRepairs(
      repairs.map((r) =>
        r.id === repair.id
          ? {
              ...r,
              status: newStatus,
              ...(newStatus === 'completed' && !r.completedDate
                ? { completedDate: new Date().toISOString().split('T')[0] }
                : {}),
            }
          : r
      )
    );
  };

  return (
    <AppShell user={user}>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Repairs & Maintenance</h1>
            <p className="text-muted-foreground mt-1">Track asset repairs and maintenance tickets.</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            New Repair Ticket
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Repairs</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Open Tickets</p>
                <p className="text-2xl font-bold text-destructive">{stats.open}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
                <p className="text-2xl font-bold text-foreground">${stats.totalCost.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by asset or description..."
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'open', 'in_progress', 'completed', 'closed'].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className={`whitespace-nowrap ${
                  selectedStatus === status
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary border-border text-foreground hover:bg-secondary'
                }`}
              >
                {status === 'all'
                  ? 'All'
                  : status === 'in_progress'
                    ? 'In Progress'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Repairs List */}
        <div className="space-y-3">
          {filteredRepairs.length > 0 ? (
            filteredRepairs.map((repair) => {
              const Icon = statusIcons[repair.status];
              return (
                <Card key={repair.id} className="bg-card border-border hover:border-primary transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{repair.assetName}</h3>
                          <Badge className={statusColors[repair.status]}>
                            <Icon className="h-3 w-3 mr-1" />
                            {repair.status === 'in_progress'
                              ? 'In Progress'
                              : repair.status.charAt(0).toUpperCase() + repair.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{repair.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Reported Date</p>
                            <p className="text-foreground font-medium">
                              {new Date(repair.reportedDate).toLocaleDateString()}
                            </p>
                          </div>
                          {repair.vendor && (
                            <div>
                              <p className="text-muted-foreground">Vendor</p>
                              <p className="text-foreground font-medium">{repair.vendor}</p>
                            </div>
                          )}
                          {repair.cost && (
                            <div>
                              <p className="text-muted-foreground">Cost</p>
                              <p className="text-foreground font-medium">${repair.cost.toLocaleString()}</p>
                            </div>
                          )}
                          {repair.completedDate && (
                            <div>
                              <p className="text-muted-foreground">Completed</p>
                              <p className="text-foreground font-medium">
                                {new Date(repair.completedDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                        {repair.notes && (
                          <p className="text-sm text-muted-foreground mt-3 italic">&quot;{repair.notes}&quot;</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {repair.status === 'open' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(repair, 'in_progress')}
                            className="border-border text-foreground hover:bg-secondary whitespace-nowrap"
                          >
                            Start Work
                          </Button>
                        )}
                        {repair.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(repair, 'completed')}
                            className="border-border text-foreground hover:bg-secondary whitespace-nowrap"
                          >
                            Mark Complete
                          </Button>
                        )}
                        {(repair.status === 'completed' || repair.status === 'closed') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(repair, 'closed')}
                            className="border-border text-foreground hover:bg-secondary whitespace-nowrap"
                            disabled={repair.status === 'closed'}
                          >
                            Close Ticket
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">No repair tickets found</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
                <CardTitle className="text-foreground">New Repair Ticket</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Asset *</label>
                    <select className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm mt-1">
                      <option>Select an asset</option>
                      {mockAssets.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Vendor</label>
                    <Input placeholder="Service vendor" className="bg-secondary border-border text-foreground mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description *</label>
                  <textarea
                    placeholder="Describe the issue..."
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm mt-1 resize-none"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Estimated Cost</label>
                    <Input type="number" placeholder="0.00" className="bg-secondary border-border text-foreground mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <select className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm mt-1">
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1">
                    Create Ticket
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border-border text-foreground hover:bg-secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
