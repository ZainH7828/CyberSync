export const rolesKeys = {
  superAdmin: "admin",
  companyAdmin: "company-admin",
  lineManager: "line-manager",
  supervisor: "supervisor",
  employee: "employee",
};

export const userRoles: rolesType[] = [
  {
    title: "Line Manager",
    value: rolesKeys.lineManager,
    rights: {
      category: {
        add: true,
        edit: true,
      },
      task: {
        add: true,
        edit: true,
      },
      downloadReport: true,
      manageTeam: true,
    },
  },
  {
    title: "Supervisor",
    value: rolesKeys.supervisor,
    rights: {
      category: {
        add: false,
        edit: false,
      },
      task: {
        add: true,
        edit: true,
      },
      downloadReport: true,
      manageTeam: false,
    },
  },
  {
    title: "Employees",
    value: rolesKeys.employee,
    rights: {
      category: {
        add: false,
        edit: false,
      },
      task: {
        add: false,
        edit: false,
      },
      downloadReport: false,
      manageTeam: false,
    },
  },
];

export const roles: rolesType[] = [
  {
    title: "Super Admin",
    value: rolesKeys.superAdmin,
    rights: {
      category: {
        add: true,
        edit: true,
      },
      task: {
        add: true,
        edit: true,
      },
      downloadReport: true,
      manageTeam: true,
    },
  },
  {
    title: "Company Admin",
    value: rolesKeys.companyAdmin,
    rights: {
      category: {
        add: true,
        edit: true,
      },
      task: {
        add: true,
        edit: true,
      },
      downloadReport: true,
      manageTeam: true,
    },
  },
  ...userRoles,
];
