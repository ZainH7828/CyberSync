import Axios from "@/helpers/Axios";

export const createSubCategoryAPI = (
  data: createSubCategoryAPIDataType,
  callback: (data: subCategoryDataType) => void,
  onError: onErrorType
) => {
  Axios.post("sub-category", data).then(
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

export const createMultiSubCategoryAPI = (
  data: createSubCategoryAPIDataType[],
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("sub-category/multiple", data).then(
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

export const getSubCategoryAPI = (
  callback: (data: subCategoryDataType[]) => void,
  onError: onErrorType
) => {
  Axios.get("sub-category").then(
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

export const getSubCategoryByIdAPI = (
  id: string,
  callback: (data: subCategoryDataType) => void,
  onError: onErrorType
) => {
  Axios.get(`sub-category/${id}`).then(
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

export const updateSubCategoryAPI = (
  id: string,
  data: createSubCategoryAPIDataType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.put(`sub-category/${id}`, data).then(
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

export const deleteSubCategoryAPI = (
  id: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.delete(`sub-category/${id}`).then(
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
