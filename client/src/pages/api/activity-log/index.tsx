import Axios from "@/helpers/Axios";

export const getTaskActivityAPI = (
  id: string,
  callback: (data: ActivityLogResponseType[]) => void,
  onError: onErrorType
) => {
  Axios.get(`activitylog/${id}`).then(
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
