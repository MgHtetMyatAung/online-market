// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { Plus, Search, Edit, Trash2, Package } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import { useGetPromotions } from "../api/queries";

// // Promotion types
// const promotionTypes = [
//   { value: "PERCENTAGE_DISCOUNT", label: "Percentage Discount" },
//   { value: "FIXED_AMOUNT_DISCOUNT", label: "Fixed Amount Discount" },
//   { value: "FREE_SHIPPING", label: "Free Shipping" },
// ];

// const mockProducts = [
//   { id: 1, name: "Classic T-Shirt", price: 29.99, promotionId: 1 },
//   { id: 2, name: "Denim Jeans", price: 79.99, promotionId: null },
//   { id: 3, name: "Sneakers", price: 129.99, promotionId: 1 },
//   { id: 4, name: "Hoodie", price: 59.99, promotionId: null },
// ];

// export function PromotionsManagement() {
//   const { data: promotionLists } = useGetPromotions();
//   const [promotions, setPromotions] = useState(mockPromotions);
//   const [products, setProducts] = useState(mockProducts);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPromotion, setSelectedPromotion] = useState<number | null>(
//     null
//   );
//   const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

//   const togglePromotionStatus = (id: number) => {
//     setPromotions(
//       promotions.map((promo) =>
//         promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
//       )
//     );
//   };

//   const deletePromotion = (id: number) => {
//     setPromotions(promotions.filter((promo) => promo.id !== id));
//     // Remove promotion from products
//     setProducts(
//       products.map((product) =>
//         product.promotionId === id ? { ...product, promotionId: null } : product
//       )
//     );
//   };

//   const toggleProductPromotion = (productId: number) => {
//     if (!selectedPromotion) return;

//     setProducts(
//       products.map((product) =>
//         product.id === productId
//           ? {
//               ...product,
//               promotionId:
//                 product.promotionId === selectedPromotion
//                   ? null
//                   : selectedPromotion,
//             }
//           : product
//       )
//     );
//   };

//   const filteredPromotions = promotions.filter(
//     (promotion) =>
//       promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       promotion.description?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getPromotionDisplay = (promotion: any) => {
//     switch (promotion.type) {
//       case "PERCENTAGE_DISCOUNT":
//         return `${promotion.value}% off`;
//       case "FIXED_AMOUNT_DISCOUNT":
//         return `$${promotion.value} off`;
//       case "FREE_SHIPPING":
//         return "Free shipping";
//       default:
//         return promotion.value;
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div>
//           <h2 className="text-2xl font-bold">Promotions</h2>
//           <p className="text-gray-600">Manage your product promotions</p>
//         </div>

//         {/* Controls */}
//         <div className="flex justify-between items-center my-6">
//           <div className="relative w-96">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search promotions..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <div>
//             <Link href={"/dashboard/promotion/create"}>
//               <Button size="sm">
//                 <Plus className="w-4 h-4 mr-1" />
//                 Create Promotion
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Promotions Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>All Promotions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Discount</TableHead>
//                   <TableHead>Code</TableHead>
//                   <TableHead>Period</TableHead>
//                   <TableHead>Products</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredPromotions.map((promotion) => (
//                   <TableRow key={promotion.id}>
//                     <TableCell>
//                       <div>
//                         <div className="font-medium">{promotion.name}</div>
//                         {promotion.description && (
//                           <div className="text-sm text-gray-500">
//                             {promotion.description}
//                           </div>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline">
//                         {
//                           promotionTypes.find((t) => t.value === promotion.type)
//                             ?.label
//                         }
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       {getPromotionDisplay(promotion)}
//                     </TableCell>
//                     <TableCell>
//                       {promotion.couponCode ? (
//                         <Badge variant="secondary">
//                           {promotion.couponCode}
//                         </Badge>
//                       ) : (
//                         <span className="text-gray-400">Auto-applied</span>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <div className="text-sm">
//                         <div>
//                           {new Date(promotion.startDate).toLocaleDateString()}
//                         </div>
//                         <div className="text-gray-500">
//                           to {new Date(promotion.endDate).toLocaleDateString()}
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           setSelectedPromotion(promotion.id);
//                           setIsProductDialogOpen(true);
//                         }}
//                       >
//                         <Package className="w-4 h-4 mr-1" />
//                         {promotion.productCount}
//                       </Button>
//                     </TableCell>
//                     <TableCell>
//                       <Switch
//                         checked={promotion.isActive}
//                         onCheckedChange={() =>
//                           togglePromotionStatus(promotion.id)
//                         }
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm">
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => deletePromotion(promotion.id)}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {/* Product Selection Dialog */}
//         <Dialog
//           open={isProductDialogOpen}
//           onOpenChange={setIsProductDialogOpen}
//         >
//           <DialogContent className="max-w-4xl">
//             <DialogHeader>
//               <DialogTitle>
//                 Manage Products for{" "}
//                 {promotions.find((p) => p.id === selectedPromotion)?.name}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <Input placeholder="Search products..." className="pl-10" />
//               </div>
//               <div className="max-h-96 overflow-y-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="w-12">Select</TableHead>
//                       <TableHead>Product Name</TableHead>
//                       <TableHead>Price</TableHead>
//                       <TableHead>Status</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {products.map((product) => (
//                       <TableRow key={product.id}>
//                         <TableCell>
//                           <Checkbox
//                             checked={product.promotionId === selectedPromotion}
//                             onCheckedChange={() =>
//                               toggleProductPromotion(product.id)
//                             }
//                           />
//                         </TableCell>
//                         <TableCell className="font-medium">
//                           {product.name}
//                         </TableCell>
//                         <TableCell>${product.price}</TableCell>
//                         <TableCell>
//                           {product.promotionId === selectedPromotion ? (
//                             <Badge>In Promotion</Badge>
//                           ) : product.promotionId ? (
//                             <Badge variant="outline">Other Promotion</Badge>
//                           ) : (
//                             <span className="text-gray-400">No Promotion</span>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//               <div className="flex justify-end">
//                 <Button onClick={() => setIsProductDialogOpen(false)}>
//                   Done
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }
