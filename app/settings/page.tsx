'use client';

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Lock, Users, Palette, Shield } from 'lucide-react';

export default function SettingsPage() {
  const user = { name: 'John Admin', email: 'admin@company.com', role: 'Administrator' };

  return (
    <AppShell user={user}>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage application and account settings.</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-secondary border-border p-1 grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Account
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              System
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <Input
                      defaultValue={user.name}
                      className="bg-secondary border-border text-foreground mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      defaultValue={user.email}
                      className="bg-secondary border-border text-foreground mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Department</label>
                    <Input
                      defaultValue="IT Management"
                      className="bg-secondary border-border text-foreground mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Role</label>
                    <Input
                      defaultValue={user.role}
                      disabled
                      className="bg-secondary border-border text-muted-foreground mt-1"
                    />
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <Input
                    type="password"
                    className="bg-secondary border-border text-foreground mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <Input
                    type="password"
                    className="bg-secondary border-border text-foreground mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Confirm Password</label>
                  <Input
                    type="password"
                    className="bg-secondary border-border text-foreground mt-1"
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account.
                </p>
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary"
                >
                  Enable 2FA
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { label: 'Asset Allocation Notifications', checked: true },
                    { label: 'Warranty Expiry Alerts', checked: true },
                    { label: 'Repair Status Updates', checked: true },
                    { label: 'Monthly Report Digest', checked: false },
                    { label: 'System Maintenance Alerts', checked: true },
                  ].map((notif) => (
                    <div key={notif.label} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked={notif.checked}
                        className="rounded border-border"
                      />
                      <label className="text-sm text-foreground">{notif.label}</label>
                    </div>
                  ))}
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Company Name</label>
                  <Input
                    defaultValue="Your Company Inc."
                    className="bg-secondary border-border text-foreground mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Currency</label>
                  <select className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm mt-1">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>JPY (¥)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Date Format</label>
                  <select className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm mt-1">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Time Zone</label>
                  <select className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm mt-1">
                    <option>UTC</option>
                    <option>EST</option>
                    <option>CST</option>
                    <option>PST</option>
                  </select>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Configuration
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Backup & Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-secondary"
                >
                  Export All Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-secondary"
                >
                  Download Backup
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
