'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockAssets, mockAllocations, mockRepairs, mockWarrantyTracking } from '@/lib/mock-data';
import { FileText, Download, Filter } from 'lucide-react';

interface ReportOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  rowCount: number;
  columns: string[];
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const user = { name: 'John Admin', email: 'admin@company.com', role: 'Administrator' };

  const reportOptions: ReportOption[] = [
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Complete asset inventory with details and current values',
      icon: '📦',
      rowCount: mockAssets.length,
      columns: ['ID', 'Name', 'SKU', 'Category', 'Status', 'Location', 'Purchase Price', 'Current Value', 'Warranty'],
    },
    {
      id: 'allocations',
      name: 'Allocations Report',
      description: 'Asset allocations by employee and department',
      icon: '🔄',
      rowCount: mockAllocations.length,
      columns: ['Allocation ID', 'Asset', 'Employee', 'Department', 'Allocated Date', 'Status', 'Notes'],
    },
    {
      id: 'warranty',
      name: 'Warranty Report',
      description: 'Warranty status and expiry information',
      icon: '🛡️',
      rowCount: mockWarrantyTracking.length,
      columns: ['Asset', 'Vendor', 'Warranty Type', 'Expiry Date', 'Status', 'Days Remaining'],
    },
    {
      id: 'repairs',
      name: 'Repairs Report',
      description: 'Maintenance and repair ticket history',
      icon: '🔧',
      rowCount: mockRepairs.length,
      columns: ['Ticket ID', 'Asset', 'Status', 'Reported Date', 'Vendor', 'Cost', 'Completed Date'],
    },
    {
      id: 'depreciation',
      name: 'Depreciation Report',
      description: 'Asset value depreciation analysis',
      icon: '📉',
      rowCount: mockAssets.length,
      columns: ['Asset', 'Purchase Price', 'Current Value', 'Total Depreciation', 'Depreciation %', 'Purchase Date'],
    },
    {
      id: 'summary',
      name: 'Executive Summary',
      description: 'High-level asset management metrics and KPIs',
      icon: '📊',
      rowCount: 1,
      columns: ['Metric', 'Value', 'Previous Period', 'Change %'],
    },
  ];

  const handleExport = (format: 'csv' | 'excel' | 'pdf', reportId: string) => {
    const report = reportOptions.find((r) => r.id === reportId);
    if (!report) return;

    // Mock data generation based on report type
    let data: any[] = [];

    switch (reportId) {
      case 'inventory':
        data = mockAssets.map((a) => ({
          ID: a.id,
          Name: a.name,
          SKU: a.sku,
          Category: a.category,
          Status: a.status,
          Location: a.location,
          'Purchase Price': `$${a.purchasePrice}`,
          'Current Value': `$${a.currentValue}`,
          Warranty: a.warrantyExpiry || 'N/A',
        }));
        break;
      case 'allocations':
        data = mockAllocations.map((alloc) => ({
          'Allocation ID': alloc.id,
          Asset: alloc.assetId,
          Employee: alloc.employeeName,
          Department: alloc.department,
          'Allocated Date': alloc.allocatedDate,
          Status: alloc.status,
          Notes: alloc.notes || '',
        }));
        break;
      case 'warranty':
        data = mockWarrantyTracking.map((w) => ({
          Asset: w.assetName,
          Vendor: w.vendor,
          'Warranty Type': w.type,
          'Expiry Date': w.expiryDate,
          Status: w.status,
          'Days Remaining': w.daysRemaining,
        }));
        break;
      case 'repairs':
        data = mockRepairs.map((r) => ({
          'Ticket ID': r.id,
          Asset: r.assetName,
          Status: r.status,
          'Reported Date': r.reportedDate,
          Vendor: r.vendor || 'N/A',
          Cost: r.cost ? `$${r.cost}` : 'N/A',
          'Completed Date': r.completedDate || 'N/A',
        }));
        break;
      case 'depreciation':
        data = mockAssets.map((a) => ({
          Asset: a.name,
          'Purchase Price': `$${a.purchasePrice}`,
          'Current Value': `$${a.currentValue}`,
          'Total Depreciation': `$${a.purchasePrice - a.currentValue}`,
          'Depreciation %': `${(((a.purchasePrice - a.currentValue) / a.purchasePrice) * 100).toFixed(1)}%`,
          'Purchase Date': a.purchaseDate,
        }));
        break;
      case 'summary':
        data = [
          { Metric: 'Total Assets', Value: mockAssets.length, 'Previous Period': 8, 'Change %': '0%' },
          { Metric: 'Total Value', Value: `$${mockAssets.reduce((sum, a) => sum + a.currentValue, 0)}`, 'Previous Period': `$${mockAssets.reduce((sum, a) => sum + a.currentValue, 0)}`, 'Change %': '0%' },
          { Metric: 'Allocated Assets', Value: mockAllocations.length, 'Previous Period': 3, 'Change %': '0%' },
          { Metric: 'Assets in Repair', Value: mockAssets.filter((a) => a.status === 'repair').length, 'Previous Period': 1, 'Change %': '0%' },
          { Metric: 'Warranty Alerts', Value: mockWarrantyTracking.filter((w) => w.status === 'expiring_soon' || w.status === 'expired').length, 'Previous Period': 1, 'Change %': '0%' },
        ];
        break;
    }

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0] || {}).join(','),
        ...data.map((row) => Object.values(row).join(',')),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      alert(`${format.toUpperCase()} export would be generated. In production, use a library like jsPDF or ExcelJS.`);
    }
  };

  return (
    <AppShell user={user}>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Generate and export asset management reports.</p>
        </div>

        {/* Report Selection */}
        {!selectedReport ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportOptions.map((report) => (
              <Card
                key={report.id}
                className="bg-card border-border hover:border-primary cursor-pointer transition-all"
                onClick={() => setSelectedReport(report.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{report.icon}</div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {report.rowCount} rows
                    </Badge>
                  </div>
                  <CardTitle className="text-foreground mt-4">{report.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Columns:</p>
                    <div className="flex flex-wrap gap-1">
                      {report.columns.slice(0, 3).map((col) => (
                        <Badge
                          key={col}
                          className="bg-secondary text-foreground border-border text-xs"
                        >
                          {col}
                        </Badge>
                      ))}
                      {report.columns.length > 3 && (
                        <Badge className="bg-secondary text-foreground border-border text-xs">
                          +{report.columns.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => setSelectedReport(null)}
              className="border-border text-foreground hover:bg-secondary"
            >
              ← Back to Reports
            </Button>

            {/* Report Detail */}
            {reportOptions
              .filter((r) => r.id === selectedReport)
              .map((report) => (
                <div key={report.id} className="space-y-6">
                  {/* Header */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{report.icon}</div>
                        <div className="flex-1">
                          <CardTitle className="text-foreground text-2xl">{report.name}</CardTitle>
                          <p className="text-muted-foreground mt-1">{report.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Export Options */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Export Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Button
                          onClick={() => handleExport('csv', report.id)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export as CSV
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleExport('excel', report.id)}
                          className="border-border text-foreground hover:bg-secondary"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export as Excel
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleExport('pdf', report.id)}
                          className="border-border text-foreground hover:bg-secondary"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export as PDF
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground pt-4 border-t border-border">
                        <p>Report contains {report.rowCount} records</p>
                        <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Report Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              {report.columns.map((col) => (
                                <th
                                  key={col}
                                  className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              {report.columns.map((col) => (
                                <td key={col} className="px-4 py-3 text-foreground">
                                  Sample data...
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Showing preview of first row. Full report will contain all {report.rowCount} records.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
