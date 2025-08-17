// routes for all pages
export const ROUTE_PATH = {
  // FOR UI PAGES
  DASHBOARD: "/dashboard",
  // ANALYTICS: '/dashboard/analytics',
  // SETTING: '/settings',
  // USER: '/user',

  // blog
  BLOG: {
    LIST: "/dashboard/blog",
    CREATE: "/dashboard/blog/create",
    EDIT: "/dashboard/blog/edit/",
  },

  BRAND: {
    LIST: "/dashboard/brand",
    CREATE: "/dashboard/brand/create",
    EDIT: "/dashboard/brand/edit/",
    VIEW: "/dashboard/brand/products/",
  },

  PRODUCT: {
    LIST: "/dashboard/product",
    CREATE: "/dashboard/product/create",
    EDIT: "/dashboard/product/edit/",
    VIEW: "/dashboard/product/view/",
  },

  ATTRIBUTE: {
    LIST: "/dashboard/attribute",
    // CREATE: "/dashboard/product/create",
    // EDIT: "/dashboard/product/edit/",
    // VIEW: "/dashboard/product/view/",
  },

  CATEGORY: {
    LIST: "/dashboard/category",
    CREATE: "/dashboard/category/create",
    EDIT: "/dashboard/category/edit/",
    VIEW: "/dashboard/category/",
  },

  COLLECTION: {
    LIST: "/dashboard/collection",
    // CREATE: "/dashboard/category/create",
    // EDIT: "/dashboard/category/edit/",
    VIEW: "/dashboard/collection/",
  },

  PROMOTION: {
    LIST: "/dashboard/promotion",
    CREATE: "/dashboard/promotion/create",
    // EDIT: "/dashboard/category/edit/",
    VIEW: "/dashboard/promotion/",
  },

  ORDER: {
    LIST: "/dashboard/order",
    CREATE: "/dashboard/category/create",
    EDIT: "/dashboard/category/edit/",
  },

  CUSTOMER: {
    LIST: "/dashboard/customer",
    CREATE: "/dashboard/customer/create",
    EDIT: "/dashboard/customer/edit/",
    VIEW: "/dashboard/customer/view/",
  },

  ABOUTUSBANNER: {
    EDIT: "/aboutusbanner/edit",
  },

  AboutusMission: {
    CREATE: "/aboutmission/create",
    LIST: "/aboutmission/list",
    EDIT: "/aboutmission/edit/:id",
  },

  AboutTeamMember: {
    CREATE: "/teammember/create",
    LIST: "/teammember/list",
    EDIT: "teammember/edit/:id",
  },

  Contactus: {
    EDIT: "/contactdata/edit",
  },
  // home page
  HOME: {
    EDIT: "/home-banner-info/edit",
    TESTIMONIAL: {
      CREATE: "/testimonials/create",
      LIST: "/testimonials/list",
      EDIT: "/testimonials/edit/:id",
    },
    FACILITIES: {
      CREATE: "/facilities/create",
      LIST: "/facilities/list",
      EDIT: "/facilities/edit/:id",
    },
  },

  // request page
  REQUEST: "/request",

  // service page
  SERVICES: {
    CREATE: "/services/create",
    LIST: "/services/list",
    EDIT: "/services/edit/:id",
    BANNER: "/services/banner",
  },
  // SYSTEM: {
  //   USER_CREATION: '/system/user',
  //   AGENT_CREATION: '/system/agent',
  // },

  // BUSINESS_USER: {
  //   NEW_USER: {
  //     BUSINESS_CUSTOMER: '/user-management/business-customer',
  //     CORPORATE_CUSTOMER: '/business-user/new-user/corporate-customer',
  //   },
  // },

  // POLICY_SERVICING: {
  //   UNDER_WRITING: {
  //     PROPOSAL: '/policy/underwriting/proposal',
  //     POLICY_DETAIL: '/policy/underwriting/policy-detail',
  //   },
  // },

  // DMS: {
  //   DMS_ADMINISTRATION: '/document-management-system/document-management-system-administration',
  //   DMS_ADMINISTRATION_DETAIL: `/document-management-system/document-management-system-administration/detail/:folder`,
  //   DMS_MAINTAINANCE: '/document-management-system/document-management-system-maintainance',
  // },

  //   FOR AUTH PAGES
  LOGIN: "/signin",
  VERIFY: "/verify",
  RESET_PASSWORD: "/reset-password",
  RESET_PASSWORD_VERIFY: "/reset-password-verify",
  // RESET_PASSWORD: '/reset-password',
  // SIGNUP: '/signup',
  // FORG0T_PASSWORD: '/forgot-password',
  // REFRESHTOKEN: '/refresh-token',

  // QUOTATION: '/quotation',
  // QUOTATIONHEALTH: '/quotation-health',
  // QUOTATIONSHORTSAVER: '/quotation-shortsaver',
  // QUOTATIONGROUPPROTECTOR: '/quotation-groupprotector',

  // PROPOSAL: '/proposal-servicing/agent-data-entry-form',

  // PROPOSALPOLICYHOLDER: '/proposal-policyholder',
  // PROPOSALINSUREDPERSON: '/proposal-insuredperson',
  // PROPOSALBENEFICIARY: '/proposal-beneficiary',
  // PROPOSALBASIC:'/proposal-basic',
  // PROPOSALINSUREDWITHOTHERS: '/proposal-other',

  // FOR NOT FOUND PAGE
  NOT_FOUND: "*",
};
