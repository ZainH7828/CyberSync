import Axios from "@/helpers/Axios";

export const createCommentAPI = (
  data: createCommentType,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("task/comments", data).then(
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

export const getCommentsByTaskId = (
  id: string,
  callback: (tasks: taskCommentResponseType[]) => void,
  onError: onErrorType
) => {
  Axios.get(`task/comments/${id}`).then(
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
