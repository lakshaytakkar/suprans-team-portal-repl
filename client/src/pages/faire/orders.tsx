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
import { format } from "date-fns";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Package,
  Truck,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Ship
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
import type { FaireOrder, FaireStore } from "@shared/schema";

const ORDER_STATE_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  NEW: { label: "New", variant: "default" },
  PROCESSING: { label: "Processing", variant: "secondary" },
  PRE_TRANSIT: { label: "Pre-Transit", variant: "outline" },
  IN_TRANSIT: { label: "In Transit", variant: "secondary" },
  DELIVERED: { label: "Delivered", variant: "default" },
  BACKORDERED: { label: "Backordered", variant: "outline" },
  CANCELED: { label: "Canceled", variant: "destructive" },
};

function formatCents(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function FaireOrders() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const { data: orders = [], isLoading: ordersLoading, refetch } = useQuery<FaireOrder[]>({
    queryKey: ["/api/faire/orders"],
  });

  const { data: stores = [] } = useQuery<FaireStore[]>({
    queryKey: ["/api/faire/stores"],
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.faireOrderId.toLowerCase().includes(search.toLowerCase()) ||
      (order.retailerName?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (order.displayId?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesState = stateFilter === "all" || order.state === stateFilter;
    const matchesStore = storeFilter === "all" || order.storeId === storeFilter;
    return matchesSearch && matchesState && matchesStore;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.state === "NEW").length,
    processing: orders.filter(o => o.state === "PROCESSING").length,
    inTransit: orders.filter(o => o.state === "IN_TRANSIT" || o.state === "PRE_TRANSIT").length,
    delivered: orders.filter(o => o.state === "DELIVERED").length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalCents || 0), 0),
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Faire Orders</h1>
          <p className="text-muted-foreground text-sm">Manage wholesale orders from Faire</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          data-testid="button-refresh"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-orders">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-new-orders">{stats.new}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-processing-orders">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-transit-orders">{stats.inTransit}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-revenue">{formatCents(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-40" data-testid="select-state-filter">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="PRE_TRANSIT">Pre-Transit</SelectItem>
            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="BACKORDERED">Backordered</SelectItem>
            <SelectItem value="CANCELED">Canceled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={storeFilter} onValueChange={setStoreFilter}>
          <SelectTrigger className="w-40" data-testid="select-store-filter">
            <SelectValue placeholder="All Stores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            {stores.map(store => (
              <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {ordersLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Package className="h-12 w-12 mb-4" />
              <p>No orders found</p>
              {search && <p className="text-sm">Try adjusting your search criteria</p>}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Retailer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => {
                  const stateConfig = ORDER_STATE_CONFIG[order.state] || { label: order.state, variant: "outline" };
                  return (
                    <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                      <TableCell>
                        <div className="font-medium" data-testid={`text-order-id-${order.id}`}>
                          {order.displayId || order.faireOrderId}
                        </div>
                        {order.purchaseOrderNumber && (
                          <div className="text-xs text-muted-foreground">
                            PO: {order.purchaseOrderNumber}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.retailerName || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stateConfig.variant} data-testid={`badge-status-${order.id}`}>
                          {stateConfig.label}
                        </Badge>
                        {order.hasPendingCancellationRequest && (
                          <Badge variant="destructive" className="ml-2">Cancellation Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="font-medium">
                        {formatCents(order.totalCents)}
                      </TableCell>
                      <TableCell>
                        {order.faireCreatedAt ? format(new Date(order.faireCreatedAt), "MMM d, yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-actions-${order.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem data-testid={`menu-view-${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Ship className="h-4 w-4 mr-2" />
                              Create Shipment
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
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
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
