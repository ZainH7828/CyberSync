const authLinks = {
  auth: {
    admin: {
      login: "/admin/login",
    },
    users: {
      login: "/",
      updatePassword: "/update-password",
      resetPassword: "/reset-password",
      verifyEmail: "/verify-email",
      verifyOtp: "/otp-verification"
     
    },
  },
};

const onBoarding = {
  organizationInActive: "/organization-inactive",
  organizationNotSetup: "/organization-not-setup",
  onBoarding: {
    organization: {
      selectModule: "/onboarding/select-module",
      selectFramework: "/onboarding/select-framework",
      customFramework: "/onboarding/custom-framework",
      customFrameworkCategory: "/onboarding/custom-framework-category",
      selectCategory: "/onboarding/select-category",
      customCategory: "/onboarding/custom-category",
      inviteTeamMembers: "/onboarding/invite-team-members",
      assignCategoryToTeam: "/onboarding/assign-category",
    },
  },
};

const adminLinks = {
  admin: {
    main: "/admin",
    dashboard: "/admin/dashboard",
    organization: {
      list: "/admin/organization",
      add: "/admin/organization/add",
      edit: "/admin/organization/edit",
    },
    module: {
      list: "/admin/module",
      add: "/admin/module/add",
      edit: "/admin/module/edit",
    },
    framework: {
      list: "/admin/framework",
      add: "/admin/framework/add",
      edit: "/admin/framework/edit",
    },
    category: {
      list: "/admin/framework-functions",
      add: "/admin/framework-functions/add",
      edit: "/admin/framework-functions/edit",
    },
    subCategory: {
      list: "/admin/category",
      add: "/admin/category/add",
      edit: "/admin/category/edit",
    },
    subCategoryIds: {
      list: "/admin/sub-category",
      add: "/admin/sub-category/add",
      edit: "/admin/sub-category/edit",
    },
  },
};

const usersLinks = {
  users: {
    dashboard: "/dashboard",
    teamMembers: "/team-members",
    categoriesTask: "/categories-and-task",
    inviteUsers: "/invite-users",
    profile: "/profile",
    summaryReport: "/summary-report",
    selfAssessment: {
      main: "/self-assessment",
      add: "/self-assessment/add",
      edit: "/self-assessment/edit",
      detail: "/self-assessment/detail",
    },
    targetScore: {
      main: "/self-assessment/target-score",
      update: "/self-assessment/target-score/update",
    },
  },
};

const routes = {
  ...authLinks,
  ...adminLinks,
  ...onBoarding,
  ...usersLinks,
  loading: "/loading",
};

export default routes;
