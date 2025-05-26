import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  FolderTree,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Products",
    value: "1,234",
    description: "+20.1% from last month",
    icon: Package,
    color: "text-blue-600",
  },
  {
    title: "Categories",
    value: "45",
    description: "8 main categories",
    icon: FolderTree,
    color: "text-green-600",
  },
  {
    title: "Brands",
    value: "28",
    description: "+3 new this month",
    icon: Building2,
    color: "text-purple-600",
  },
  {
    title: "Orders",
    value: "2,847",
    description: "+12% from last month",
    icon: ShoppingBag,
    color: "text-orange-600",
  },
  {
    title: "Customers",
    value: "1,892",
    description: "+8% from last month",
    icon: Users,
    color: "text-pink-600",
  },
  {
    title: "Revenue",
    value: "$45,231",
    description: "+15% from last month",
    icon: TrendingUp,
    color: "text-emerald-600",
  },
];

export default function DashboardData() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 space-y-4 ">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
        </div>

        <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="col-span-1 xl:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate pr-2">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 shrink-0 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl lg:text-2xl font-bold">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{`New product added: "Wireless Headphones"`}</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{`Category "Electronics" updated`}</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      1 hour ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{`New brand "TechCorp" added`}</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      3 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Quick Stats</CardTitle>
              <CardDescription>
                Overview of your store performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Products in stock</span>
                  <span className="text-sm font-medium">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Order fulfillment</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Customer satisfaction</span>
                  <span className="text-sm font-medium">4.8/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
