import Axios from "@/helpers/Axios";

export const getUserDashboardDataAPI = (
  callback: (data: dashboardApiDataType) => void,
  onError: onErrorType
) => {
  Axios.post("dashboard/home").then(
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
