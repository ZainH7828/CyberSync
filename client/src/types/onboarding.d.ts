declare global {
  interface CategoryTypeType extends createSubCategoryAPIDataType {
    color: string;
  }

  interface CustomCategoryUIType {
    isFrameWorkCustom?: boolean;
    isPopup?: boolean;
    onSuccess?: () => void;
  }

  interface SelectedCategoryAreaType {
    hideRemoveBtn?: boolean;
    isInPopup?: boolean;
  }

  type userBasedRightsKeyType =
    | "categoryAdd"
    | "categoryEdit"
    | "taskAdd"
    | "taskEdit"
    | "downloadReport"
    | "manageTeam";

  interface userBasedRightsType {
    categoryAdd: boolean;
    categoryEdit: boolean;
    taskAdd: boolean;
    taskEdit: boolean;
    downloadReport: boolean;
    manageTeam: boolean;
  }

  interface InviteTeamMembersRightsAreaType {
    isPopup?: boolean;
    onInviteSuccess?: () => void;
    popupDetails?: recurringTaskPopupType;
    userData?: userResponseDataType;
  }
}

export default global;
