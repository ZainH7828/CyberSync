import Axios from "@/helpers/Axios";

export const createFrameworkAPI = (
  data: createFrameworkAPIDataType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("framework", data).then(
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

export const getFrameworkAPI = (
  callback: (data: frameworkDataType[]) => void,
  onError: onErrorType
) => {
  Axios.get("framework").then(
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

export const getFrameworkByIdAPI = (
  id: string,
  callback: (data: frameworkDataType) => void,
  onError: onErrorType
) => {
  Axios.get(`framework/${id}`).then(
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

export const updateFrameworkAPI = (
  id: string,
  data: createFrameworkAPIDataType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.put(`framework/${id}`, data).then(
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

export const deleteFrameworkAPI = (
  id: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.delete(`framework/${id}`).then(
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
