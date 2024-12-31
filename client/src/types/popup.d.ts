declare global {
  interface basicPopupType {
    visibility: boolean;
    toggleVisibility: () => void;
    overflowAuto?: boolean;
  }
  interface PopupType extends basicPopupType {
    children?: React.ReactNode;
    className?: string;
    heading: string;
    detail?: string;
  }

  interface deletePopupType extends basicPopupType {
    data?: { name: string; deleteType?: string };
    onSuccess?: () => void;
  }

  interface recurringTaskPopupType extends basicPopupType {
    onSuccess?: () => void;
    className?: string;
  }

  interface uploadPopupType extends basicPopupType {
    onSuccess?: () => void;
    heading?: string;
    uploadType?: "files" | "deliver";
    taskId?: string;
    isSubtask?: boolean;
  }

  interface logoutPopupType extends basicPopupType {}

  interface SubCategoryIdPopupCodeType {
    code: string;
    id: string;
  }

  interface subCategoryIdPopupType extends basicPopupType {
    subCatIds: subCategoryIdDataType[];
    onSuccess?: (data: subCategoryIdDataType) => void;
    heading?: string;
    code?: string;
    color: string;
  }
}

export default global;
