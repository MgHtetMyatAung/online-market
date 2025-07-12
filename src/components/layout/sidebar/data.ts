import { ROUTE_PATH } from "@/constants/router";
import {
  ChartColumn,
  // BriefcaseBusiness,
  Gem,
  // CalendarCheck,
  // File,
  Home,
  Inbox,
  LayoutGrid,
  Megaphone,
  Network,
  // LaptopMinimal,
  // Layers2,
  Notebook,
  PackageSearch,
  ReceiptText,
  ScanSearch,
  Settings,
  Tag,
  // Ticket,
  // Trash,
  UserCog,
} from "lucide-react";

// Menu items.

export const applicationMenuItems = [
  // {
  //   title: "Home",
  //   url: "#",
  //   icon: Home,
  //   items: [
  //     {
  //       title: "Forms",
  //       url: "#",
  //     },
  //     {
  //       title: "Inputs",
  //       url: "#",
  //     },
  //     {
  //       title: "Datas",
  //       url: "#",
  //       items: [
  //         {
  //           title: "All",
  //           url: "#",
  //         },
  //         {
  //           title: "Filters",
  //           url: "#",
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    title: "Dashboard",
    url: ROUTE_PATH.DASHBOARD,
    icon: Home,
  },
  {
    title: "Requests",
    url: ROUTE_PATH.REQUEST,
    icon: Inbox,
  },
  {
    title: "Contact",
    url: "#",
    icon: ReceiptText,
  },
];

export const controlMenuItems = [
  // {
  //   title: "",
  //   url: "#",
  //   icon: UserCog,
  // },
  {
    title: "Customers",
    url: "#",
    icon: UserCog,
    items: [
      {
        title: "List",
        url: ROUTE_PATH.HOME.EDIT,
      },
      {
        title: "Create",
        url: ROUTE_PATH.HOME.EDIT,
      },
    ],
  },
  {
    title: "Orders",
    url: "#",
    icon: Network,
    items: [
      {
        title: "List",
        url: ROUTE_PATH.ORDER.LIST,
      },
      {
        title: "Create",
        url: ROUTE_PATH.HOME.EDIT,
      },
    ],
  },
  {
    title: "Products",
    url: "#",
    icon: PackageSearch,
    items: [
      {
        title: "List",
        url: ROUTE_PATH.PRODUCT.LIST,
      },
      {
        title: "Create",
        url: ROUTE_PATH.PRODUCT.EDIT,
      },
    ],
  },
  {
    title: "Categories",
    url: "#",
    icon: LayoutGrid,
    items: [
      {
        title: "List",
        url: ROUTE_PATH.CATEGORY.LIST,
      },
      {
        title: "Create",
        url: ROUTE_PATH.CATEGORY.CREATE,
      },
    ],
  },
  {
    title: "Brands",
    url: "#",
    icon: Gem,
    items: [
      {
        title: "List",
        url: ROUTE_PATH.BRAND.LIST,
      },
      {
        title: "Create",
        url: ROUTE_PATH.BRAND.CREATE,
      },
    ],
  },
  /* Aboutus */
  {
    title: "Collections",
    url: "#",
    icon: Notebook,
    items: [
      {
        title: "List",
        url: ROUTE_PATH.ABOUTUSBANNER.EDIT,
      },
      {
        title: "Create",
        url: ROUTE_PATH.AboutusMission.CREATE,
      },
    ],
  },
  {
    title: "Promotions",
    url: "#",
    icon: Tag,
    items: [
      {
        title: "List",
        url: ROUTE_PATH.SERVICES.LIST,
      },
      {
        title: "Create",
        url: ROUTE_PATH.SERVICES.CREATE,
      },
      {
        title: "Banner",
        url: ROUTE_PATH.SERVICES.BANNER,
      },
    ],
  },
  {
    title: "Analytics",
    url: "#",
    icon: ChartColumn,
  },
  {
    title: "Announcement",
    url: "#",
    icon: Megaphone,
  },
  {
    title: "Blogs",
    url: "#",
    icon: ReceiptText,
    items: [
      {
        title: "List",
        url: ROUTE_PATH.SERVICES.LIST,
      },
      {
        title: "Create",
        url: ROUTE_PATH.SERVICES.CREATE,
      },
    ],
  },

  // {
  //   title: "Socials",
  //   url: "#",
  //   icon: File,
  // },
  // {
  //   title: "Services",
  //   url: "#",
  //   icon: LaptopMinimal,
  // },
  // {
  //   title: "Events",
  //   url: "#",
  //   icon: Ticket,
  // },
  // {
  //   title: "Holidays",
  //   url: "#",
  //   icon: CalendarCheck,
  // },
  // {
  //   title: "Assets",
  //   url: "#",
  //   icon: Layers2,
  // },
];

export const supportMenuItems = [
  {
    title: "View Front Store",
    url: "#",
    icon: ScanSearch,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
