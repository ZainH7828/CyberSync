import Axios from "@/helpers/Axios";


export const getSummaryReportAPI = (
  orgId: string,
  callback: (response: any) => void,
  onError: onErrorType
) => {
  Axios.get(`report/summary/${orgId}`).then(
    (res) => {
      console.log("responseeeee ", res);
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      console.log("errrr  ", err);
      onError("Error Occured");
    }
  );
};


export const getReportDataAPI = (
  data: any,
  orgId: string,
  callback: (response: any) => void,
  onError: onErrorType
) => {
  Axios.post(`report/download/${orgId}`, data).then(
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

export const getCategoryReportDataAPI = (
  data: any,
  orgId: string,
  callback: (response: any) => void,
  onError: onErrorType
) => {
  Axios.post(`report/category/${orgId}`, data).then(
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

export const getFrameworkReportDataAPI = (
  data: any,
  orgId: string,
  callback: (response: any) => void,
  onError: onErrorType
) => {
  Axios.post(`report/framework/${orgId}`, data).then(
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

export const getReportInfoAPI = (
  orgId: string,
  callback: (data: any[]) => void,
  onError: onErrorType
) => {
  Axios.get(`report/info/${orgId}`).then(
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