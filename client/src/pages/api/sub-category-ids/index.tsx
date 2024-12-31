import Axios from "@/helpers/Axios";

export const createSubCategoryIDAPI = (
  data: createSubCategoryIdAPIDataType,
  callback: (data: subCategoryIdDataType) => void,
  onError: onErrorType
) => {
  Axios.post("sub-category-id", data).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
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

export const getSubCategoryIDAPI = (
  callback: (data: subCategoryIdDataType[]) => void,
  onError: onErrorType
) => {
  Axios.get("sub-category-id").then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error Occured");
    }
  );
};

export const getSubCategoryIDByIdAPI = (
  id: string,
  callback: (data: subCategoryIdDataType) => void,
  onError: onErrorType
) => {
  Axios.get(`sub-category-id/${id}`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error Occured");
    }
  );
};

export const getSubCategoryIDBySubIdOrganizationAPI = (
  subCatId: string,
  organizationId: string,
  callback: (data: subCategoryIdDataType[]) => void,
  onError: onErrorType
) => {
  Axios.get(`sub-category-id/sub-category-organization/${subCatId}/${organizationId}`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error Occured");
    }
  );
};

export const getSubCategoryIdByOrganization = (
  organizationId: string,
  callback: (data: subCategoryIdResDataType[]) => void,
  onError: onErrorType
) => {
  Axios.get(`sub-category-id/organization/${organizationId}`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error Occured");
    }
  );
};

export const updateSubCategoryIDAPI = (
  id: string,
  data: createSubCategoryIdAPIDataType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.put(`sub-category-id/${id}`, data).then(
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

export const deleteSubCategoryIDAPI = (
  id: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.delete(`sub-category-id/${id}`).then(
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
