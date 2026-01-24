import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  MoreHorizontal, 
  Package,
  Box,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Edit,
  Grid,
  List,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FaireProduct, FaireStore } from "@shared/schema";

const SALE_STATE_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  FOR_SALE: { label: "For Sale", variant: "default" },
  SALES_PAUSED: { label: "Paused", variant: "outline" },
  DISCONTINUED: { label: "Discontinued", variant: "destructive" },
};

const LIFECYCLE_STATE_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Published", variant: "default" },
  ARCHIVED: { label: "Archived", variant: "outline" },
};

export default function FaireProducts() {
  const [search, setSearch] = useState("");
  const [saleStateFilter, setSaleStateFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const { data: products = [], isLoading, refetch } = useQuery<FaireProduct[]>({
    queryKey: ["/api/faire/products"],
  });

  const { data: stores = [] } = useQuery<FaireStore[]>({
    queryKey: ["/api/faire/stores"],
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.sku?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (product.shortDescription?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesState = saleStateFilter === "all" || product.saleState === saleStateFilter;
    const matchesStore = storeFilter === "all" || product.storeId === storeFilter;
    return matchesSearch && matchesState && matchesStore;
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const stats = {
    total: products.length,
    forSale: products.filter(p => p.saleState === "FOR_SALE").length,
    paused: products.filter(p => p.saleState === "SALES_PAUSED").length,
    discontinued: products.filter(p => p.saleState === "DISCONTINUED").length,
    draft: products.filter(p => p.lifecycleState === "DRAFT").length,
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Faire Products</h1>
          <p className="text-muted-foreground text-sm">Manage products and inventory for Faire wholesale</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            data-testid="button-refresh"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" data-testid="button-add-product">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-products">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">For Sale</CardTitle>
            <Box className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-for-sale">{stats.forSale}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paused</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-paused">{stats.paused}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discontinued</CardTitle>
            <Package className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-discontinued">{stats.discontinued}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-drafts">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Select value={saleStateFilter} onValueChange={setSaleStateFilter}>
          <SelectTrigger className="w-40" data-testid="select-sale-state">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="FOR_SALE">For Sale</SelectItem>
            <SelectItem value="SALES_PAUSED">Paused</SelectItem>
            <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
          </SelectContent>
        </Select>
        <Select value={storeFilter} onValueChange={setStoreFilter}>
          <SelectTrigger className="w-40" data-testid="select-store">
            <SelectValue placeholder="All Stores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            {stores.map(store => (
              <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("table")}
            data-testid="button-table-view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            data-testid="button-grid-view"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Package className="h-12 w-12 mb-4" />
              <p>No products found</p>
              {search && <p className="text-sm">Try adjusting your search criteria</p>}
            </div>
          ) : viewMode === "table" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Sale State</TableHead>
                  <TableHead>Lifecycle</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => {
                  const saleConfig = SALE_STATE_CONFIG[product.saleState] || { label: product.saleState, variant: "outline" };
                  const lifecycleConfig = LIFECYCLE_STATE_CONFIG[product.lifecycleState] || { label: product.lifecycleState, variant: "outline" };
                  const store = stores.find(s => s.id === product.storeId);
                  return (
                    <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                        {product.shortDescription && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {product.shortDescription}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{product.sku || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={saleConfig.variant}>{saleConfig.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lifecycleConfig.variant}>{lifecycleConfig.label}</Badge>
                      </TableCell>
                      <TableCell>{product.minimumOrderQuantity}</TableCell>
                      <TableCell>{store?.name || "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-actions-${product.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync from Faire
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {paginatedProducts.map((product) => {
                const saleConfig = SALE_STATE_CONFIG[product.saleState] || { label: product.saleState, variant: "outline" };
                return (
                  <Card key={product.id} className="hover-elevate cursor-pointer" data-testid={`card-product-${product.id}`}>
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="font-medium line-clamp-2 mb-1">{product.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{product.sku || "No SKU"}</div>
                      <Badge variant={saleConfig.variant}>{saleConfig.label}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              data-testid="button-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
