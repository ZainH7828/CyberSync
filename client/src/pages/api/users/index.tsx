import Axios from "@/helpers/Axios";
import { rolesKeys } from "@/pageData/roles";

export const inviteUsersToOrganizationAPI = (
  data: inviteUserToOrganizationAPIType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("user/invite", data).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback();
      }
    },
    (err) => {
      const error =
        err.response && err.response.data
          ? err.response.data.message
          : "Error Occured";
      onError(error);
    }
  );
};

export const assignUserSubcCategoryAPI = (
  data: { userID: string; subCategoryID: string }[],
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("user/assign-category", { assignation: data }).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback();
      }
    },
    (err) => {
      const error =
        err.response && err.response.data
          ? err.response.data.message
          : "Error Occured";
      onError(error);
    }
  );
};

export const removeUserSubcCategoryAPI = (
  data: { userID: string; subCategoryID: string }[],
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("user/remove-category", { assignation: data }).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback();
      }
    },
    (err) => {
      const error =
        err.response && err.response.data
          ? err.response.data.message
          : "Error Occured";
      onError(error);
    }
  );
};

export const fetchUserByOrganizationAPI = (
  id: string,
  callback: (data: userResponseDataType[]) => void,
  onError: onErrorType
) => {
  Axios.post(`user/organization/${id}`).then(
    (res) => {
      const response = res.data;
      if (response && response) {
        // Filter out users with role "company admin"
        const filteredData = response.filter(
          (user: userResponseDataType) => user.role !== rolesKeys.companyAdmin
        );
        callback(filteredData);
      }
    },
    (err) => {
      const error =
        err.response && err.response.data
          ? err.response.data.message
          : "Error Occurred";
      onError(error);
    }
  );
};

export const fetchUserByOrganizationAndSubCatAPI = (
  data: { organizationId: string; subCategoryId: string },
  callback: (data: userResponseDataType[]) => void,
  onError: onErrorType
) => {
  Axios.post(
    `user/organization-subcategory/${data.organizationId}/${data.subCategoryId}`,
    data
  ).then(
    (res) => {
      const response = res.data;
      if (response && response) {
        // Filter out users with role "company admin"
        const filteredData = response.filter(
          (user: userResponseDataType) => user.role !== rolesKeys.companyAdmin
        );
        callback(filteredData);
      }
    },
    (err) => {
      const error =
        err.response && err.response.data
          ? err.response.data.message
          : "Error Occurred";
      onError(error);
    }
  );
};

export const updateUserAPI = (
  id: string,
  data: inviteUserToOrganizationAPIType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.put(`user/${id}`, data).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback();
      }
    },
    (err) => {
      const error =
        err.response && err.response.data
          ? err.response.data.message
          : "Error Occured";
      onError(error);
    }
  );
};



export const deleteUserAPI = (
  id: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.delete(`user/${id}`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback();
      }
    },
    (err) => {
      onError("Error Occured");
    }
  );
};
