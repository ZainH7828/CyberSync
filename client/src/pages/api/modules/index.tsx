import Axios from "@/helpers/Axios";

export const createModuleAPI = (
  data: createModuleAPIDataType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("modules", data).then(
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

export const getModuleAPI = (
  callback: (data: moduleDataType[]) => void,
  onError: onErrorType
) => {
  Axios.get("modules").then(
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

export const getModuleByIdAPI = (
  id: string,
  callback: (data: moduleDataType) => void,
  onError: onErrorType
) => {
  Axios.get(`modules/${id}`).then(
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

export const updateModuleAPI = (
  id: string,
  data: createModuleAPIDataType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.put(`modules/${id}`, data).then(
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

export const deleteModuleAPI = (
  id: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.delete(`modules/${id}`).then(
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
