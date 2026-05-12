'use client';

import { useState } from 'react';
import { useAssets } from '@/lib/hooks/use-api';
import { AppShell } from '@/components/app-shell';
import { AssetsList } from '@/components/assets-list';
import { Asset } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Search } from 'lucide-react';
import axios from 'axios';

export default function AssetsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Asset>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { assets, loading, mutate } = useAssets(statusFilter, search);
  const user = { name: 'John Admin', email: 'admin@company.com', role: 'Administrator' };

  const handleAddAsset = () => {
    setSelectedAsset(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
  ...asset,
  purchase_date: asset.purchase_date
    ? new Date(asset.purchase_date)
        .toISOString()
        .split('T')[0]
    : '',

  warranty_start_date: asset.warranty_start_date
    ? new Date(asset.warranty_start_date)
        .toISOString()
        .split('T')[0]
    : '',
});
    setShowModal(true);
  };
  const handleViewAsset = (asset: Asset) => {
  setSelectedAsset(asset);
  setShowViewModal(true);
};

  const handleDeleteAsset = async (asset: Asset) => {
    if (confirm(`Are you sure you want to delete ${asset.asset_id}?`)) {
      try {
        await axios.delete(`/api/assets/${asset.id}`);
        mutate();
      } catch (error) {
        alert('Failed to delete asset');
      }
    }
  };

  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('[v0] Saving asset with data:', formData);
      let warranty_end_date = null;

      if (
        (formData as any).warranty_start_date &&
        (formData as any).warranty_months
      ) {
        const startDate = new Date(
          (formData as any).warranty_start_date
        );

        startDate.setMonth(
          startDate.getMonth() +
          Number((formData as any).warranty_months)
        );

        warranty_end_date = startDate
          .toISOString()
          .split('T')[0];

        formData.warranty_end_date = warranty_end_date as any;
      }
      if (selectedAsset) {
        console.log('[v0] Updating asset:', selectedAsset.id);
        await axios.put(`/api/assets/${selectedAsset.id}`, formData);
      } else {
        console.log('[v0] Creating new asset');
        await axios.post('/api/assets', formData);
      }
      console.log('[v0] Asset saved successfully');
      mutate();
      setShowModal(false);
      setFormData({});
    } catch (error: any) {
      console.error('[v0] Error saving asset:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save asset. Please check the console for details.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    'in_stock',
    'allocated',
    'under_diagnosis',
    'under_repair',
    'repaired',
    'replacement_initiated',
    'replaced',
    'returned',
    'damaged',
    'scrap',
  ];

  return (
    <AppShell user={user}>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Asset Inventory</h1>
            <p className="text-muted-foreground mt-1">Manage all IT assets and equipment</p>
          </div>
          <Button onClick={handleAddAsset} className="gap-2">
            <Plus className="h-4 w-4" /> Add Asset
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search by ID, serial, brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-secondary border-border"

                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground"
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Assets List or Loading State */}
        {loading ? (
          <Card className="bg-card border-border">
            <CardContent className="pt-6 text-center text-muted-foreground">
              Loading assets...
            </CardContent>
          </Card>
        ) : (
         <AssetsList
  assets={assets}
  onAddClick={handleAddAsset}
  onViewClick={handleViewAsset}
  onEditClick={handleEditAsset}
  onDeleteClick={handleDeleteAsset}
/>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-card border-border w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-foreground">
                  {selectedAsset ? 'Edit Asset' : 'Add New Asset'}
                </CardTitle>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveAsset} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Asset ID</label>
                      <Input
                        value={formData.asset_id || ''}
                        onChange={(e) => setFormData({ ...formData, asset_id: e.target.value })}
                        className="bg-secondary border-border"
                        placeholder="e.g., LAP001"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Asset Type</label>
                      <Input
                        value={formData.asset_type || ''}
                        onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
                        className="bg-secondary border-border"
                        placeholder="e.g., Laptop"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Brand</label>
                      <Input
                        value={formData.brand || ''}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="bg-secondary border-border"
                        placeholder="e.g., Dell"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Model Number</label>
                      <Input
                        value={formData.model_number || ''}
                        onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                        className="bg-secondary border-border"
                        placeholder="e.g., XPS 15"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Serial Number</label>
                      <Input
                        value={formData.serial_number || ''}
                        onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                        className="bg-secondary border-border"
                        placeholder="Unique serial number"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Asset Cost</label>
                      <Input
                        type="number"
                        value={formData.asset_cost || ''}
                        onChange={(e) => setFormData({ ...formData, asset_cost: parseFloat(e.target.value) })}
                        className="bg-secondary border-border"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    
                      <div>
                        <label className="text-sm text-muted-foreground">Purchase Date</label>
                        <Input
                          type="date"
                          value={formData.purchase_date || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              purchase_date: e.target.value,
                            })
                          }
                          className="bg-secondary border-border"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground">
                          Warranty Start Date
                        </label>

                        <Input
                          type="date"
                          value={(formData as any).warranty_start_date || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              warranty_start_date: e.target.value,
                            })
                          }
                          className="bg-secondary border-border"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground">
                          Warranty Duration (Months)
                        </label>

                        <Input
                          type="number"
                          placeholder="e.g., 12"
                          value={(formData as any).warranty_months || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                            warranty_months: Number(e.target.value),
                            })
                          }
                          className="bg-secondary border-border"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground">Status</label>
                        <select
                          value={formData.asset_status || 'in_stock'}
                          onChange={(e) => setFormData({ ...formData, asset_status: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Condition</label>
                        <select
                          value={formData.asset_condition || 'new'}
                          onChange={(e) => setFormData({ ...formData, asset_condition: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground"
                        >
                          <option value="new">New</option>
                          <option value="good">Good</option>
                          <option value="damaged">Damaged</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm text-muted-foreground">Notes</label>
                        <Input
                          value={formData.notes || ''}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="bg-secondary border-border"
                          placeholder="Additional notes..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Asset'}
                      </Button>
                    </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        {showViewModal && selectedAsset && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <Card className="bg-card border-border w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-foreground">
          Asset Details
        </CardTitle>

        <button
          onClick={() => setShowViewModal(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Asset ID</p>
            <p className="font-medium">{selectedAsset.asset_id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Asset Type</p>
            <p className="font-medium">{selectedAsset.asset_type}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Brand</p>
            <p className="font-medium">{selectedAsset.brand || '-'}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Model Number</p>
            <p className="font-medium">{selectedAsset.model_number || '-'}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Serial Number</p>
            <p className="font-medium">{selectedAsset.serial_number}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Asset Cost</p>
            <p className="font-medium">
              ₹{selectedAsset.asset_cost || 0}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Purchase Date</p>
            <p className="font-medium">
              {selectedAsset.purchase_date || '-'}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Warranty End Date</p>
            <p className="font-medium">
              {selectedAsset.warranty_end_date || '-'}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium capitalize">
              {selectedAsset.asset_status?.replace(/_/g, ' ')}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Condition</p>
            <p className="font-medium capitalize">
              {selectedAsset.asset_condition}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Notes</p>
            <p className="font-medium">
              {selectedAsset.notes || '-'}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={() => setShowViewModal(false)}>
            Close
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
