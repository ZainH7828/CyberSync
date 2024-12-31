import Axios from "@/helpers/Axios";

export const CreateTaskAPI = (
  data: createTaskAPIType,
  callback: (task: createTaskAPIType) => void,
  onError: onErrorType
) => {
  Axios.post("task", data).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error creating task");
    }
  );
};

export const UpdateTaskAPI = (
  id: string,
  data: createTaskAPIType,
  callback: (task: createTaskAPIType) => void,
  onError: onErrorType
) => {
  Axios.put(`task/${id}`, data).then(
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

export const GetTaskByIdAPI = (
  id: string,
  callback: (task: dashboardApiTaskDataType) => void,
  onError: onErrorType
) => {
  Axios.get(`task/${id}`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response.task);
      }
    },
    (err) => {
      onError("Error updating task");
    }
  );
};

export const UploadTaskFileAPI = (
  taskId: string,
  file: File,
  type: string,
  isSubtask: boolean,
  callback: () => void,
  onError: onErrorType
) => {
  const path = isSubtask ? "sub-task" : "task";
  Axios.post(
    `${path}/${taskId}/upload`,
    { taskFile: file, type: type },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  ).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback();
      }
    },
    (err) => {
      onError("Error updating task");
    }
  );
};

export const deleteTaskFileAPI = (
  taskId: string,
  name: string,
  type: string,
  isSubtask: boolean,
  callback: () => void,
  onError: onErrorType
) => {
  const path = isSubtask ? "sub-task" : "task";
  Axios.post(`${path}/${taskId}/delete`, { fileName: name, type: type }).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback();
      }
    },
    (err) => {
      onError("Error updating task");
    }
  );
};
