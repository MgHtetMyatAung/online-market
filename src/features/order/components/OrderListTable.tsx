"use client";
import React, { useMemo, useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/table/DataTable";

// Example Product Data Type
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Laptop Pro",
    price: 1200,
    stock: 50,
    category: "Electronics",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p2",
    name: "Designer T-Shirt",
    price: 25,
    stock: 200,
    category: "Apparel",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p3",
    name: "The Great Novel",
    price: 15,
    stock: 150,
    category: "Books",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p4",
    name: "Wireless Earbuds",
    price: 80,
    stock: 120,
    category: "Electronics",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p5",
    name: "Smartwatch X",
    price: 250,
    stock: 75,
    category: "Electronics",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p6",
    name: "Running Shoes",
    price: 60,
    stock: 180,
    category: "Footwear",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p7",
    name: "Gaming Keyboard",
    price: 90,
    stock: 95,
    category: "Electronics",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p8",
    name: "Cotton Hoodie",
    price: 40,
    stock: 110,
    category: "Apparel",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p9",
    name: "Cookware Set",
    price: 100,
    stock: 60,
    category: "Home & Kitchen",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p10",
    name: "Bluetooth Speaker",
    price: 45,
    stock: 130,
    category: "Electronics",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p11",
    name: "Organic Shampoo",
    price: 12,
    stock: 210,
    category: "Beauty",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p12",
    name: "Yoga Mat",
    price: 30,
    stock: 140,
    category: "Sports",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p13",
    name: "Graphic Novel Set",
    price: 35,
    stock: 90,
    category: "Books",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p14",
    name: "Sunglasses Classic",
    price: 20,
    stock: 160,
    category: "Accessories",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p15",
    name: 'LED Monitor 24"',
    price: 180,
    stock: 85,
    category: "Electronics",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p16",
    name: "Notebook Set",
    price: 10,
    stock: 300,
    category: "Stationery",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p17",
    name: "Winter Jacket",
    price: 70,
    stock: 95,
    category: "Apparel",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p18",
    name: "Digital Camera",
    price: 550,
    stock: 40,
    category: "Electronics",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p19",
    name: "Espresso Machine",
    price: 300,
    stock: 35,
    category: "Home & Kitchen",
    imageUrl: "https://via.placeholder.com/50",
  },
  {
    id: "p20",
    name: "Wireless Mouse",
    price: 25,
    stock: 150,
    category: "Electronics",
    imageUrl: "https://via.placeholder.com/50",
  },
];

function OrderListTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(DUMMY_PRODUCTS);
      setIsLoading(false);
    }, 1200);
  }, []);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: (info) => (
          <img
            src={String(info.getValue())}
            alt="Product"
            className="h-10 w-10 object-cover rounded"
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "name",
        header: "Product Name",
        cell: (info) => (
          <span className="font-medium text-blue-600">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => (
          <span className="text-gray-700">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: (info) => (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              Number(info.getValue()) > 20
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {Number(info.getValue())}
          </span>
        ),
      },
    ],
    []
  );

  const handleView = (product: Product) => {
    alert(`Viewing product: ${product.name}`);
    // Navigate to product detail page
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <DataTable
        label="Orders"
        data={products}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products found."
        enableGlobalFilter
        enablePagination
        pageSizeOptions={[5, 10, 20]} // Different page size options
        initialPageSize={5}
        renderRowActions={(product: Product) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleView(product)}
              className="text-green-600 hover:text-green-900"
            >
              View
            </button>
            <button
              onClick={() => alert(`Edit ${product.name}`)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </button>
          </div>
        )}
      />
    </div>
  );
}

export default OrderListTable;
