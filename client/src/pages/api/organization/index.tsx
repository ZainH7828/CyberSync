import Axios from "@/helpers/Axios";

export const createOrganizationAPI = (
  data: createOrganizationAPIDataType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("organizations", data).then(
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

export const getOrganizationAPI = (
  callback: (data: organizationsDataType[]) => void,
  onError: onErrorType
) => {
  Axios.get("organizations").then(
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

export const getOrganizationByIdAPI = (
  id: string,
  callback: (data: organizationsDataType) => void,
  onError: onErrorType
) => {
  Axios.get(`organizations/${id}`).then(
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

export const updateOrganizationAPI = (
  id: string,
  data: createOrganizationAPIDataType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.put(`organizations/${id}`, data).then(
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

export const getCategoriesByOrgIdAPI = (
  id: string,
  callback: (data: categoryDataType[]) => void,
  onError: onErrorType
) => {
  Axios.get(`organizations/${id}/categories`).then(
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

export const getSubCategoriesByOrgIdAPI = (
  id: string,
  callback: (data: subCategoryDataType[]) => void,
  onError: onErrorType
) => {
  Axios.get(`organizations/${id}/subcategories`).then(
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

export const addSubCategoriesToOrgAPI = (
  orgId: string,
  subCatId: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post(`organizations/${orgId}/subcategories`, {
    subCategoryId: subCatId,
  }).then(
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

export const removeSubCategoriesToOrgAPI = (
  orgId: string,
  subCatId: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.delete(`organizations/${orgId}/subcategories/${subCatId}`).then(
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

export const updateOrganizationCompleteAPI = (
  id: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.put(`organization-onboarding/${id}`).then(
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

export const deleteOrganizationAPI = (
  id: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.delete(`organizations/${id}`).then(
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
