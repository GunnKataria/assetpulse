'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockWarrantyTracking } from '@/lib/mock-data';
import { WarrantyTracking } from '@/lib/types';
import { AlertCircle, Search, X, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function WarrantyPage() {
  const [warranties, setWarranties] = useState<WarrantyTracking[]>(mockWarrantyTracking);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const user = { name: 'John Admin', email: 'admin@company.com', role: 'Administrator' };

  const filteredWarranties = warranties.filter((warranty) => {
    const matchesSearch =
      warranty.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || warranty.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusIcons: Record<string, any> = {
    active: CheckCircle,
    expiring_soon: AlertTriangle,
    expired: AlertCircle,
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    expiring_soon: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    expired: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const getStatusLabel = (days: number): WarrantyTracking['status'] => {
    if (days < 0) return 'expired';
    if (days < 90) return 'expiring_soon';
    return 'active';
  };

  const stats = {
    total: warranties.length,
    active: warranties.filter((w) => w.status === 'active').length,
    expiring: warranties.filter((w) => w.status === 'expiring_soon').length,
    expired: warranties.filter((w) => w.status === 'expired').length,
  };

  return (
    <AppShell user={user}>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Warranty Management</h1>
          <p className="text-muted-foreground mt-1">Track and monitor asset warranties.</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Warranties</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.expiring}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expired</p>
                <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by asset or vendor..."
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'expiring_soon', 'expired'].map((status) => (
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
                  : status === 'expiring_soon'
                    ? 'Expiring Soon'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Warranties List */}
        <div className="space-y-3">
          {filteredWarranties.length > 0 ? (
            filteredWarranties.map((warranty) => {
              const Icon = statusIcons[warranty.status];
              const isExpired = warranty.daysRemaining < 0;
              return (
                <Card key={warranty.id} className="bg-card border-border hover:border-primary transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{warranty.assetName}</h3>
                          <Badge className={statusColors[warranty.status]}>
                            <Icon className="h-3 w-3 mr-1" />
                            {warranty.status === 'expiring_soon'
                              ? 'Expiring Soon'
                              : warranty.status.charAt(0).toUpperCase() + warranty.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Vendor</p>
                            <p className="text-foreground font-medium">{warranty.vendor}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="text-foreground font-medium">{warranty.type}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expiry Date</p>
                            <p className="text-foreground font-medium">
                              {new Date(warranty.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Days Remaining</p>
                            <p
                              className={`font-bold ${
                                isExpired
                                  ? 'text-destructive'
                                  : warranty.daysRemaining < 90
                                    ? 'text-yellow-400'
                                    : 'text-green-400'
                              }`}
                            >
                              {isExpired ? `Expired ${Math.abs(warranty.daysRemaining)} days ago` : `${warranty.daysRemaining} days`}
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
                          Renew
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
                <p className="text-muted-foreground">No warranties found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
