'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAssets, useAllocations, useEmployees } from '@/lib/hooks/use-api';
import axios from 'axios';
import { Plus, Search, X, CheckCircle, Clock, RotateCw } from 'lucide-react';

export default function AllocationsPage() {
  const { allocations, mutate } = useAllocations();
  const {
    assets,
    mutate: mutateAssets,
  } = useAssets();
  const { employees } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<any>(null)

  const user = { name: 'John Admin', email: 'admin@company.com', role: 'Administrator' };
  const [formData, setFormData] = useState({
    employee_id: '',
    asset_id: '',
    allocation_date: new Date()
      .toISOString()
      .split('T')[0],
    expected_return_date: '',
    asset_condition_at_allocation: 'Good',
    accessories_included: '',
    notes: '',
  });
  const filteredAllocations = allocations.filter((alloc: any) => {
    const matchesSearch =
      alloc.employee?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      alloc.asset?.asset_id
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesStatus =
      selectedStatus === 'all' ||
      alloc.allocation_status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const handleNewAllocation = () => {

    setShowModal(true);
  };
  const handleEditAllocation = (allocation: any) => {
    setEditingAllocation(allocation)

    setFormData({
      employee_id: allocation.employee_id,
      asset_id: allocation.asset_id,
      allocation_date: allocation.allocation_date || '',
      expected_return_date:
        allocation.expected_return_date || '',
      asset_condition_at_allocation:
        allocation.asset_condition_at_allocation || 'Good',
      accessories_included:
        allocation.accessories_included || '',
      notes: allocation.notes || '',
    })

    setShowModal(true)
  }
  const handleReturnAsset = async (allocation: any) => {
    try {
      await axios.put(`/api/allocations/${allocation.id}`, {
        allocation_status: 'returned',
      })

      mutate()
      mutateAssets()
    } catch (error) {
      alert('Failed to return asset')
    }
  }
  const handleAllocateAsset = async () => {
    try {
      const employee = employees.find(
        (e: any) => e.id === formData.employee_id
      )

      const asset = assets.find(
        (a: any) => a.id === formData.asset_id
      )

      if (!employee || !asset) {
        alert('Please select employee and asset')
        return
      }

      const payload = {
        employee_id: formData.employee_id,
        asset_id: formData.asset_id,
        allocation_date: formData.allocation_date,
        expected_return_date:
          formData.expected_return_date || null,
        asset_condition_at_allocation:
          formData.asset_condition_at_allocation,
        accessories_included:
          formData.accessories_included || null,
        notes: formData.notes || null,
        allocation_status: 'active',
      }

      if (editingAllocation) {
        await axios.put(
          `/api/allocations/${editingAllocation.id}`,
          payload
        )
      } else {
        await axios.post('/api/allocations', payload)
      }
      mutate()
      mutateAssets()


      setShowModal(false)

      setFormData({
        employee_id: '',
        asset_id: '',
        allocation_date: new Date()
          .toISOString()
          .split('T')[0],
        expected_return_date: '',
        asset_condition_at_allocation: 'Good',
        accessories_included: '',
        notes: '',
      })
    } catch (error) {
      alert('Failed to allocate asset')
    }
  }

  const statusIcons: Record<string, any> = {
    active: CheckCircle,
    returned: RotateCw,
    pending_return: Clock,
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    returned: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    pending_return: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <AppShell user={user}>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Asset Allocations</h1>
            <p className="text-muted-foreground mt-1">Track asset assignments to employees.</p>
          </div>
          <Button onClick={handleNewAllocation} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            New Allocation
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Allocations</p>
                <p className="text-2xl font-bold text-foreground">
                  {allocations.filter((a: any) => a.allocation_status === 'active').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Returns</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {allocations.filter((a: any) => a.allocation_status === 'pending_return').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Returned</p>
                <p className="text-2xl font-bold text-foreground">
                  {allocations.filter((a: any) => a.allocation_status === 'returned').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee or asset..."
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'pending_return', 'returned'].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className={`whitespace-nowrap ${selectedStatus === status
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary border-border text-foreground hover:bg-secondary'
                  }`}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Allocations List */}
        <div className="space-y-3">
          {filteredAllocations.length > 0 ? (
            filteredAllocations.map((allocation: any) => {
              const asset = allocation.asset;
              const Icon =
                statusIcons[
                allocation.allocation_status as keyof typeof statusIcons
                ];
              return (
                <Card key={allocation.id} className="bg-card border-border hover:border-primary transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{allocation.employee?.name}</h3>
                          <Badge className={statusColors[allocation.allocation_status]}>
                            <Icon className="h-3 w-3 mr-1" />
                            {allocation.allocation_status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Asset</p>
                            <p className="text-foreground font-medium">{asset?.asset_id || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Department</p>
                            <p className="text-foreground font-medium">{allocation.employee?.department}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Allocated Date</p>
                            <p className="text-foreground">{new Date(allocation.allocation_date).toLocaleDateString()}</p>
                          </div>
                          {allocation.dueReturnDate && (
                            <div>
                              <p className="text-muted-foreground">Due Return</p>
                              <p className="text-foreground">{new Date(allocation.dueReturnDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                        {allocation.notes && (
                          <p className="text-sm text-muted-foreground mt-3 italic">&quot;{allocation.notes}&quot;</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {allocation.allocation_status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReturnAsset(allocation)}
                            className="border-border text-foreground hover:bg-secondary"
                          >
                            Mark Returned
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditAllocation(allocation)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                        >
                          ✎
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
                <p className="text-muted-foreground">No allocations found</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
                <CardTitle className="text-foreground">{editingAllocation
                  ? 'Edit Allocation'
                  : 'New Asset Allocation'}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowModal(false)
                    setEditingAllocation(null)
                  }}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Employee Name *</label>
                    <select
                      value={formData.employee_id}
                      disabled={!!editingAllocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employee_id: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm mt-1"
                    >
                      <option value="">Select employee</option>

                      {employees.map((employee: any) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Asset *</label>
                    <select
                      value={formData.asset_id}
                      disabled={!!editingAllocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          asset_id: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm mt-1"
                    >
                      <option>Select an asset</option>
                      {assets
                        .filter((a: any) =>
                          a.asset_status === 'in_stock' ||
                          a.id === formData.asset_id
                        )
                        .map((a: any) => (
                          <option key={a.id} value={a.id}>
                            {a.asset_id} - {a.brand}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium text-foreground">Department *</label>
                    <Input placeholder="Department" className="bg-secondary border-border text-foreground mt-1" />
                  </div> */}
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Allocation Date
                    </label>

                    <Input
                      type="date"
                      value={formData.allocation_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          allocation_date: e.target.value,
                        })
                      }
                      className="bg-secondary border-border text-foreground mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Expected Return Date
                    </label>

                    <Input
                      type="date"
                      value={formData.expected_return_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expected_return_date: e.target.value,
                        })
                      }
                      className="bg-secondary border-border text-foreground mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Asset Condition
                    </label>

                    <select
                      value={formData.asset_condition_at_allocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          asset_condition_at_allocation: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm mt-1"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Accessories Included
                  </label>

                  <Input
                    placeholder="Charger, Mouse, Laptop Bag..."
                    value={formData.accessories_included}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accessories_included: e.target.value,
                      })
                    }
                    className="bg-secondary border-border text-foreground mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Notes</label>
                  <textarea
                    placeholder="Allocation notes..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm mt-1 resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    onClick={handleAllocateAsset}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                  >
                    {editingAllocation
                      ? 'Update Allocation'
                      : 'Allocate Asset'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowModal(false)
                      setEditingAllocation(null)
                    }}
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
