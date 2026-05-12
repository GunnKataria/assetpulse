'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppShellProps {
  children: ReactNode;
  user?: { name: string; email: string; role: string };
}

export function AppShell({ children, user }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/assets', label: 'Assets', icon: '📦' },
    { href: '/allocations', label: 'Allocations', icon: '🔄' },
    { href: '/warranty', label: 'Warranty', icon: '🛡️' },
    { href: '/repairs', label: 'Repairs', icon: '🔧' },
    { href: '/reports', label: 'Reports', icon: '📈' },
    { href: '/employees', label: 'Employees', icon: '👥' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
          <div className="text-2xl font-bold text-sidebar-primary">
            {sidebarOpen ? 'ASSET' : 'A'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  !sidebarOpen && 'justify-center'
                } ${isActive(item.href) ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${!sidebarOpen && 'justify-center'}`}
          >
            <Settings className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground hover:bg-secondary"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {user && (
                <>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs">{user.role}</p>
                </>
              )}
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
