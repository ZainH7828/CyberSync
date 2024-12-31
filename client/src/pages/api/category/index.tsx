import Axios from "@/helpers/Axios";

export const createCategoryAPI = (
  data: createCategoryAPIDataType,
  callback: (data: categoryDataType) => void,
  onError: onErrorType
) => {
  Axios.post("category", data).then(
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

export const createMultiCategoryAPI = (
  data: createCategoryAPIDataType[],
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("category", data).then(
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

export const getCategoryAPI = (
  callback: (data: categoryDataType[]) => void,
  onError: onErrorType
) => {
  Axios.get("category").then(
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

export const getCategoryByIdAPI = (
  id: string,
  callback: (data: categoryDataType) => void,
  onError: onErrorType
) => {
  Axios.get(`category/${id}`).then(
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

export const updateCategoryAPI = (
  id: string,
  data: createCategoryAPIDataType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.put(`category/${id}`, data).then(
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

export const deleteCategoryAPI = (
  id: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.delete(`category/${id}`).then(
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
