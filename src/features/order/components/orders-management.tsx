"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Search,
  Filter,
  Eye,
  Printer,
  Mail,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data types
type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  finalPrice: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  orderId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  trackingNumber?: string;
  notes?: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "1",
    orderId: "ORD-2024-001",
    totalAmount: 299.99,
    status: "PENDING",
    createdAt: "2024-01-15T10:30:00Z",
    customer: {
      id: "c1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0123",
    },
    shippingAddress: {
      id: "a1",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    billingAddress: {
      id: "a2",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    items: [
      {
        id: "i1",
        productName: "Premium T-Shirt",
        sku: "TSH-001-L-BLU",
        quantity: 2,
        price: 49.99,
        finalPrice: 99.98,
      },
      {
        id: "i2",
        productName: "Denim Jeans",
        sku: "JNS-002-32-IND",
        quantity: 1,
        price: 89.99,
        finalPrice: 89.99,
      },
    ],
  },
  {
    id: "2",
    orderId: "ORD-2024-002",
    totalAmount: 159.99,
    status: "SHIPPED",
    createdAt: "2024-01-14T14:20:00Z",
    trackingNumber: "1Z999AA1234567890",
    customer: {
      id: "c2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1-555-0456",
    },
    shippingAddress: {
      id: "a3",
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    billingAddress: {
      id: "a4",
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    items: [
      {
        id: "i3",
        productName: "Sneakers",
        sku: "SNK-003-9-WHT",
        quantity: 1,
        price: 159.99,
        finalPrice: 159.99,
      },
    ],
  },
];

const statusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

type StatusFormData = z.infer<typeof statusSchema>;

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "SHIPPED":
      return "bg-purple-100 text-purple-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return <Clock className="h-4 w-4" />;
    case "PROCESSING":
      return <Package className="h-4 w-4" />;
    case "SHIPPED":
      return <Truck className="h-4 w-4" />;
    case "DELIVERED":
      return <CheckCircle className="h-4 w-4" />;
    case "CANCELLED":
      return <X className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const statusForm = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: "PENDING",
      trackingNumber: "",
      notes: "",
    },
  });

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const handleStatusUpdate = (data: StatusFormData) => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: data.status,
            trackingNumber: data.trackingNumber || order.trackingNumber,
            notes: data.notes || order.notes,
          }
        : order
    );

    setOrders(updatedOrders);
    setIsStatusDialogOpen(false);
    setSelectedOrder(null);
    statusForm.reset();
    console.log("Order status updated:", data);
  };

  const handlePrintInvoice = (order: Order) => {
    console.log("Printing invoice for order:", order.orderId);
    // In a real app, this would generate and print a PDF invoice
  };

  const handleContactCustomer = (order: Order) => {
    console.log("Contacting customer:", order.customer.email);
    // In a real app, this would open email client or send notification
  };

  const handleRefund = (order: Order) => {
    console.log("Processing refund for order:", order.orderId);
    // In a real app, this would handle refund processing
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Orders</h2>
        <p className="text-gray-600">Manage your product orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">
                        {order.customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Order Details - {order.orderId}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-sm text-gray-500">
                                    Total Amount
                                  </div>
                                  <div className="text-2xl font-bold">
                                    ${order.totalAmount.toFixed(2)}
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-sm text-gray-500">
                                    Status
                                  </div>
                                  <Badge
                                    className={getStatusColor(order.status)}
                                  >
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1">{order.status}</span>
                                  </Badge>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-sm text-gray-500">
                                    Order Date
                                  </div>
                                  <div className="font-medium">
                                    {new Date(
                                      order.createdAt
                                    ).toLocaleDateString()}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Customer Information */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Customer Information
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm text-gray-500">
                                    Name
                                  </Label>
                                  <div className="font-medium">
                                    {order.customer.name}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-500">
                                    Email
                                  </Label>
                                  <div className="font-medium">
                                    {order.customer.email}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-500">
                                    Phone
                                  </Label>
                                  <div className="font-medium">
                                    {order.customer.phone}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Addresses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-3">
                                  Shipping Address
                                </h3>
                                <div className="text-sm space-y-1">
                                  <div>{order.shippingAddress.street}</div>
                                  <div>
                                    {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.state}{" "}
                                    {order.shippingAddress.zipCode}
                                  </div>
                                  <div>{order.shippingAddress.country}</div>
                                </div>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-3">
                                  Billing Address
                                </h3>
                                <div className="text-sm space-y-1">
                                  <div>{order.billingAddress.street}</div>
                                  <div>
                                    {order.billingAddress.city},{" "}
                                    {order.billingAddress.state}{" "}
                                    {order.billingAddress.zipCode}
                                  </div>
                                  <div>{order.billingAddress.country}</div>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Order Items
                              </h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead>Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell className="font-medium">
                                        {item.productName}
                                      </TableCell>
                                      <TableCell>{item.sku}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>
                                        ${item.price.toFixed(2)}
                                      </TableCell>
                                      <TableCell>
                                        ${item.finalPrice.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            {/* Tracking Information */}
                            {order.trackingNumber && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3">
                                  Tracking Information
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <Label className="text-sm text-gray-500">
                                    Tracking Number
                                  </Label>
                                  <div className="font-mono text-lg">
                                    {order.trackingNumber}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {order.notes && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3">
                                  Notes
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <div className="text-sm">{order.notes}</div>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <Separator />
                            <div className="flex flex-wrap gap-2">
                              <Button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  statusForm.setValue("status", order.status);
                                  statusForm.setValue(
                                    "trackingNumber",
                                    order.trackingNumber || ""
                                  );
                                  statusForm.setValue(
                                    "notes",
                                    order.notes || ""
                                  );
                                  setIsStatusDialogOpen(true);
                                }}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Update Status
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handlePrintInvoice(order)}
                              >
                                <Printer className="h-4 w-4 mr-2" />
                                Print Invoice
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleContactCustomer(order)}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Contact Customer
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleRefund(order)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Process Refund
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={statusForm.handleSubmit(handleStatusUpdate)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusForm.watch("status")}
                onValueChange={(value) =>
                  statusForm.setValue("status", value as OrderStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="trackingNumber">Tracking Number (Optional)</Label>
              <Input
                {...statusForm.register("trackingNumber")}
                placeholder="Enter tracking number"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                {...statusForm.register("notes")}
                placeholder="Add any notes about this status update"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Status</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
