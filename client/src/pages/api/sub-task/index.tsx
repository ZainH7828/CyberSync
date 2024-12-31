import Axios from "@/helpers/Axios";

export const CreateSubTaskAPI = (
  data: createSubTaskAPIType,
  callback: (subTask: subTaskApiResponseType) => void,
  onError: onErrorType
) => {
  Axios.post("sub-task", data).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error creating sub task");
    }
  );
};

export const UpdateSubTaskAPI = (
  id: string,
  data: createSubTaskAPIType,
  callback: (subTask: subTaskApiResponseType) => void,
  onError: onErrorType
) => {
  Axios.put(`sub-task/${id}`, data).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error updating sub task");
    }
  );
};

export const GetSubTaskByIdAPI = (
  id: string,
  callback: (task: subTaskApiResponseType) => void,
  onError: onErrorType
) => {
  Axios.get(`sub-task/${id}`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error updating task");
    }
  );
};
