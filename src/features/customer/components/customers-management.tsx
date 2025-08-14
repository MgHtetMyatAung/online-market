"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Search,
  Eye,
  Edit,
  Star,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

// Customer type definition
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  level: "Bronze" | "Silver" | "Gold" | "Platinum";
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  addresses: Address[];
  orders: Order[];
}

interface Address {
  id: string;
  type: "shipping" | "billing";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  date: string;
  status: string;
  totalAmount: number;
  itemCount: number;
}

// Form schemas
const editCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

const loyaltyPointsSchema = z.object({
  points: z.number().min(-10000).max(10000),
  reason: z.string().min(1, "Reason is required"),
});

export function CustomersManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPointsDialogOpen, setIsPointsDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        loyaltyPoints: 1250,
        level: "Gold",
        totalOrders: 15,
        totalSpent: 2450.0,
        lastOrderDate: "2024-01-15",
        addresses: [
          {
            id: "1",
            type: "shipping",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
            isDefault: true,
          },
          {
            id: "2",
            type: "billing",
            street: "456 Oak Ave",
            city: "New York",
            state: "NY",
            zipCode: "10002",
            country: "USA",
            isDefault: false,
          },
        ],
        orders: [
          {
            id: "ORD-001",
            date: "2024-01-15",
            status: "Delivered",
            totalAmount: 125.99,
            itemCount: 3,
          },
          {
            id: "ORD-002",
            date: "2024-01-10",
            status: "Delivered",
            totalAmount: 89.5,
            itemCount: 2,
          },
          {
            id: "ORD-003",
            date: "2024-01-05",
            status: "Processing",
            totalAmount: 199.99,
            itemCount: 1,
          },
        ],
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        loyaltyPoints: 750,
        level: "Silver",
        totalOrders: 8,
        totalSpent: 1200.0,
        lastOrderDate: "2024-01-12",
        addresses: [
          {
            id: "3",
            type: "shipping",
            street: "789 Pine St",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210",
            country: "USA",
            isDefault: true,
          },
        ],
        orders: [
          {
            id: "ORD-004",
            date: "2024-01-12",
            status: "Shipped",
            totalAmount: 75.0,
            itemCount: 2,
          },
          {
            id: "ORD-005",
            date: "2024-01-08",
            status: "Delivered",
            totalAmount: 150.0,
            itemCount: 4,
          },
        ],
      },
      {
        id: "3",
        name: "Mike Wilson",
        email: "mike.wilson@email.com",
        phone: "+1 (555) 987-6543",
        loyaltyPoints: 2100,
        level: "Platinum",
        totalOrders: 25,
        totalSpent: 4500.0,
        lastOrderDate: "2024-01-18",
        addresses: [
          {
            id: "4",
            type: "shipping",
            street: "321 Elm St",
            city: "Chicago",
            state: "IL",
            zipCode: "60601",
            country: "USA",
            isDefault: true,
          },
        ],
        orders: [
          {
            id: "ORD-006",
            date: "2024-01-18",
            status: "Processing",
            totalAmount: 299.99,
            itemCount: 1,
          },
          {
            id: "ORD-007",
            date: "2024-01-15",
            status: "Delivered",
            totalAmount: 450.0,
            itemCount: 5,
          },
        ],
      },
    ];
    setCustomers(mockCustomers);
  }, []);

  // Forms
  const editForm = useForm<z.infer<typeof editCustomerSchema>>({
    resolver: zodResolver(editCustomerSchema),
  });

  const pointsForm = useForm<z.infer<typeof loyaltyPointsSchema>>({
    resolver: zodResolver(loyaltyPointsSchema),
  });

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      levelFilter === "all" || customer.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  // Handle edit customer
  const handleEditCustomer = (data: z.infer<typeof editCustomerSchema>) => {
    if (!selectedCustomer) return;

    setCustomers(
      customers.map((customer) =>
        customer.id === selectedCustomer.id
          ? { ...customer, ...data }
          : customer
      )
    );
    setIsEditDialogOpen(false);
    editForm.reset();
    console.log("Customer updated:", data);
  };

  // Handle loyalty points adjustment
  const handleAdjustPoints = (data: z.infer<typeof loyaltyPointsSchema>) => {
    if (!selectedCustomer) return;

    setCustomers(
      customers.map((customer) =>
        customer.id === selectedCustomer.id
          ? { ...customer, loyaltyPoints: customer.loyaltyPoints + data.points }
          : customer
      )
    );
    setIsPointsDialogOpen(false);
    pointsForm.reset();
    console.log("Loyalty points adjusted:", data);
  };

  // Get level badge color
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Bronze":
        return "bg-amber-100 text-amber-800";
      case "Silver":
        return "bg-gray-100 text-gray-800";
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
      case "Platinum":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Customer detail view
  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Customer Detail</h2>
        </div>

        {/* Customer Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {selectedCustomer.name}
                </CardTitle>
                <p className="text-muted-foreground">
                  {selectedCustomer.email}
                </p>
                {selectedCustomer.phone && (
                  <p className="text-muted-foreground">
                    {selectedCustomer.phone}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getLevelColor(selectedCustomer.level)}>
                  <Star className="h-3 w-3 mr-1" />
                  {selectedCustomer.level}
                </Badge>
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        editForm.reset({
                          name: selectedCustomer.name,
                          email: selectedCustomer.email,
                          phone: selectedCustomer.phone || "",
                        });
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Customer Information</DialogTitle>
                    </DialogHeader>
                    <Form {...editForm}>
                      <form
                        onSubmit={editForm.handleSubmit(handleEditCustomer)}
                        className="space-y-4"
                      >
                        <FormField
                          control={editForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={editForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={editForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {selectedCustomer.loyaltyPoints}
                </p>
                <p className="text-sm text-muted-foreground">Loyalty Points</p>
                <Dialog
                  open={isPointsDialogOpen}
                  onOpenChange={setIsPointsDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                    >
                      Adjust Points
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adjust Loyalty Points</DialogTitle>
                    </DialogHeader>
                    <Form {...pointsForm}>
                      <form
                        onSubmit={pointsForm.handleSubmit(handleAdjustPoints)}
                        className="space-y-4"
                      >
                        <FormField
                          control={pointsForm.control}
                          name="points"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Points Adjustment</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter positive or negative number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={pointsForm.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reason</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Explain the reason for this adjustment..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsPointsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Apply Adjustment</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {selectedCustomer.totalOrders}
                </p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  ${selectedCustomer.totalSpent.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {selectedCustomer.lastOrderDate
                    ? new Date(
                        selectedCustomer.lastOrderDate
                      ).toLocaleDateString()
                    : "Never"}
                </p>
                <p className="text-sm text-muted-foreground">Last Order</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCustomer.addresses.map((address) => (
                <div key={address.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={
                        address.type === "shipping" ? "default" : "secondary"
                      }
                    >
                      {address.type}
                    </Badge>
                    {address.isDefault && (
                      <Badge variant="outline">Default</Badge>
                    )}
                  </div>
                  <p className="font-medium">{address.street}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-muted-foreground">{address.country}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCustomer.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "Delivered" ? "default" : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.itemCount}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main customers list view
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      <div>
        <h2 className="text-2xl font-bold">Customers</h2>
        <p className="text-gray-600">Manage your customers</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Bronze">Bronze</SelectItem>
                <SelectItem value="Silver">Silver</SelectItem>
                <SelectItem value="Gold">Gold</SelectItem>
                <SelectItem value="Platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Loyalty Points</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelColor(customer.level)}>
                      <Star className="h-3 w-3 mr-1" />
                      {customer.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {customer.loyaltyPoints}
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    {customer.lastOrderDate
                      ? new Date(customer.lastOrderDate).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
