declare global {
  type callbackType = () => void;
  type onErrorType = (error: string) => void;

  interface loginAPIType {
    email: string;
    password: string;
  }

  interface verifyEmailAPIType {
    email: string;
  }

  interface verifyOTPAPIType {
    email: string;
    otp: number;
  }

  interface resetPasswordAPIType {
    email: string;
    otp: number;
    password: string;
    rePassword: string;
  }

  interface userResponseDataType {
    _id: string;
    name: string;
    email: string;
    token: string;
    organization?: string;
    role: string;
    subCategories: string[];
    rights: userAccessRightsType;
    isPasswordChanged: boolean;
    orgSetupCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  interface targetScoreApiType {
    subCategory: string;
    score: number;
  }

  interface createOrganizationAPIDataType {
    setupCompleted?: boolean;
    name?: string;
    email?: string;
    framework?: string;
    module?: string;
    categories?: string[];
    subCategories?: string[];
    subCategoriesId?: string[];
    targetScore?: targetScoreType[];
    status?: string;
  }

  interface targetScoreSubCategoryDataType extends subCategoryDataType {
    category: categoryDataType;
  }

  interface targetScoreResponseApiType extends targetScoreApiType {
    _id: string;
    subCategory: targetScoreSubCategoryDataType;
  }

  interface inviteUserToOrganizationAPIType {
    name: string;
    email: string;
    organization: string;
    role: string;
    rights: userAccessRightsType;
  }

  interface organizationsDataType extends createOrganizationAPIDataType {
    _id: string;
    name: string;
    email: string;
    status: string;
    licensePeriod?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface createFrameworkAPIDataType {
    module: string;
    name: string;
    status: string;
  }

  interface frameworkDataType extends createFrameworkAPIDataType {
    _id: string;
    isCustom: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  interface createCategoryAPIDataType {
    framework: string;
    name: string;
    code: string;
    colorCode: string;
    isCustom?: boolean;
    description?: string;
    status: string;
  }

  interface categoryDataType extends createCategoryAPIDataType {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  }
  interface createSubCategoryAPIDataType {
    category?: string;
    name: string;
    code: string;
    description?: string;
    subCatCode?: string;
    organization?: string;
    isCustom?: boolean;
    status?: string;
  }

  interface subCategoryDataType extends createSubCategoryAPIDataType {
    _id: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    subCategory?: string;
  }

  interface createSubCategoryIdAPIDataType {
    subCategory?: string;
    name: string;
    description: string;
    subCode: string;
    organization?: string;
    isCustom?: boolean;
    status: string;
  }

  interface subCategoryIdDataType extends createSubCategoryIdAPIDataType {
    _id: string;
    subCategory: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface subCategoryIdResDataType extends subCategoryIdDataType {
    subCategory: subCategoryDataType;
  }

  interface createModuleAPIDataType {
    name: string;
    status: string;
  }

  interface moduleDataType extends createModuleAPIDataType {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface teamsApiDataType {
    name: string;
    email: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface createTaskAPIType {
    subCategory?: string;
    subCategoriesId?: string;
    name?: string;
    desc?: string;
    due_date?: Date;
    status?: string;
    priority?: number;
    createdBy?: string;
    assignees?: string[];
    files?: string[];
  }

  interface createSubTaskAPIType {
    taskId: string;
    assignees?: string[];
    name?: string;
    desc?: string;
    due_date?: Date;
    status?: string;
    createdBy?: string;
  }

  interface subTaskApiResponseType extends createSubTaskAPIType {
    _id: string;
    desc: string;
    assignees: {
      _id: string;
      name: string;
    }[];
    files: {
      name: string;
      destination: string;
      path: string;
    }[];
    deliverables: {
      name: string;
      destination: string;
      path: string;
    }[];
    name: string;
    due_date: Date;
    status: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface dashboardApiTaskDataType extends createTaskAPIType {
    _id: string;
    subCategory: string;
    name: string;
    desc: string;
    due_date: Date;
    status: string;
    createdBy: string;
    desc: string;
    priority: number;
    files: {
      name: string;
      destination: string;
      path: string;
    }[];
    deliverables: {
      name: string;
      destination: string;
      path: string;
    }[];
    assignees: {
      _id: string;
      name: string;
    }[];
    subCategoriesId?: subCategoryIdDataType;
    createdAt: Date;
    updatedAt: Date;
    subTasks: subTaskApiResponseType[];
  }

  interface dashboardApiSubCategoryDataType {
    _id: string;
    name: string;
    code: string;
    isCustom?: boolean;
    status: string;
    tasks: dashboardApiTaskDataType[];
    subCatCode: string;
  }

  interface dashboardApiCategoryDataType {
    _id: string;
    name: string;
    code: string;
    colorCode: string;
    isCustom?: boolean;
    status: string;
    framework: string;
    subCategory: dashboardApiSubCategoryDataType[];
  }

  interface dashboardApiDataType {
    categories: dashboardApiCategoryDataType[];
  }

  interface ActivityLogResponseType {
    taskId: string;
    type: string;
    activity: string;
    createdBy: {
      _id: string;
      name: string;
    };
    createdAt: Date;
  }

  interface createCommentType {
    taskID: string;
    comment: string;
    createdBy: string;
  }

  interface taskCommentResponseType extends createCommentType {
    createdBy: {
      _id: string;
      name: string;
    };
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  }

  type selfAssessmentResponseType = {
    _id: string;
    organization: string;
    report: {
      category: categoryDataType;
      subCategory: subCategoryDataType;
      prevScore: number;
      targetScore: number;
      score: number;
      note: string;
    }[];
    createdAt: Date;
  };

  type latestSelfAssessmentResponseType = {
    category: string;
    subCategory: string;
    score: number;
  };
}

export default global;
