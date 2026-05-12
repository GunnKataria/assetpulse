'use client';

import { useAssets } from '@/lib/hooks/use-api';
import { useAllocations } from '@/lib/hooks/use-api';
import { useRepairs } from '@/lib/hooks/use-api';
import { useWarranty } from '@/lib/hooks/use-api';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertCircle, Package, Wrench, Clock, Zap, Trash2, Activity } from 'lucide-react';

const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
}: {
  title: string;
  value: number;
  icon: any;
  trend?: string;
  color?: string;
}) => (
  <Card className="bg-card border-border hover:border-primary transition-all">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-accent mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const user = { name: 'John Admin', email: 'admin@company.com', role: 'Administrator' };
  
  const { assets } = useAssets();
  const { allocations } = useAllocations('active');
  const { repairs } = useRepairs();
  const { warranties } = useWarranty('expiring_soon');

  // Calculate KPI metrics from real data
  const totalAssets = assets.length;
  const allocatedAssets = assets.filter((a: any) => a.asset_status === 'allocated').length;
  const availableStock = assets.filter((a: any) => a.asset_status === 'in_stock').length;
  const inRepair = assets.filter((a: any) => a.asset_status === 'under_repair').length;
  const damagedAssets = assets.filter((a: any) => a.asset_status === 'damaged').length;
  const scrapAssets = assets.filter((a: any) => a.asset_status === 'scrap').length;
  const warrantyAlerts = warranties.length;
  const activeAllocations = allocations.length;

  return (
    <AppShell user={user}>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your asset overview.</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Assets"
            value={totalAssets}
            icon={Package}
            color="accent"
          />
          <KPICard
            title="Allocated"
            value={allocatedAssets}
            icon={Activity}
          />
          <KPICard
            title="Available Stock"
            value={availableStock}
            icon={TrendingUp}
          />
          <KPICard
            title="In Repair"
            value={inRepair}
            icon={Wrench}
            color="destructive"
          />
          <KPICard
            title="Warranty Alerts"
            value={warrantyAlerts}
            icon={AlertCircle}
          />
          <KPICard
            title="Damaged Assets"
            value={damagedAssets}
            icon={Zap}
            color="destructive"
          />
          <KPICard
            title="Scrap Assets"
            value={scrapAssets}
            icon={Trash2}
          />
          <KPICard
            title="Active Allocations"
            value={activeAllocations}
            icon={Clock}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expiring Warranties */}
          <Card className="lg:col-span-1 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Expiring Warranties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {warranties.slice(0, 3).map((warranty: any) => (
                  <div
                    key={warranty.id}
                    className="flex items-start gap-3 p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="mt-1">
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {warranty.asset?.asset_id || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(warranty.warranty_end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Repairs */}
          <Card className="lg:col-span-1 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Repairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {repairs.slice(0, 3).map((repair: any) => (
                  <div key={repair.id} className="flex items-start gap-3 p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                    <div className="mt-1">
                      <Wrench className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {repair.asset?.asset_id || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {repair.repair_status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Asset Status Summary */}
          <Card className="lg:col-span-1 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Asset Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <span className="text-lg font-semibold text-foreground">
                    {availableStock}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Allocated</span>
                  <span className="text-lg font-semibold text-foreground">
                    {allocatedAssets}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">In Repair</span>
                  <span className="text-lg font-semibold text-foreground">
                    {inRepair}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Damaged</span>
                  <span className="text-lg font-semibold text-destructive">
                    {damagedAssets}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
