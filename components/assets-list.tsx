'use client';

import { Asset } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';

interface AssetsListProps {
  assets: Asset[];
  onAddClick?: () => void;
  onEditClick?: (asset: Asset) => void;
  onDeleteClick?: (asset: Asset) => void;
}

const statusColors: Record<string, string> = {
  available: 'bg-green-500/20 text-green-400 border-green-500/30',
  allocated: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  damaged: 'bg-red-500/20 text-red-400 border-red-500/30',
  scrap: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  repair: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export function AssetsList({ assets, onAddClick, onEditClick, onDeleteClick }: AssetsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
  (asset.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (asset.asset_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (asset.model_number || '').toLowerCase().includes(searchTerm.toLowerCase());

const matchesCategory =
  selectedCategory === 'all' || asset.asset_type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [assets, searchTerm, selectedCategory]);

const categories = ['all', ...Array.from(new Set(assets.map((a) => a.asset_type)))];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-foreground">Asset Inventory</CardTitle>
        <Button onClick={onAddClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Asset ID, Brand, Model, or Serial Number..."
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary border-border text-foreground hover:bg-secondary'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Assets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">SKU</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Value</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{asset.brand} {asset.model_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{asset.asset_id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{asset.asset_type}</td>
                    <td className="px-4 py-3">
                      <Badge className={`capitalize ${statusColors[asset.asset_status] || statusColors.available}`}>
                        {asset.asset_status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                  ${Number(asset.asset_cost || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => onEditClick?.(asset)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => onEditClick?.(asset)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => onDeleteClick?.(asset)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No assets found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-between items-center pt-4 border-t border-border text-sm text-muted-foreground">
          <span>
            Showing {filteredAssets.length} of {assets.length} assets
          </span>
          <span>
            Total Value: <span className="text-foreground font-semibold">
              ${filteredAssets.reduce((sum, a) => sum + Number(a.asset_cost || 0), 0).toLocaleString()}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
