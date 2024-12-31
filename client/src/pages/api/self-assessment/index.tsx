import Axios from "@/helpers/Axios";

export const createSelfAssesmentAPI = (
  data: {
    organization: string;
    report: {
      category: string;
      subCategory: string;
      prevScore: number;
      targetScore: number;
      score: number;
      note: string;
    }[];
  },
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("self-assessments/", data).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback();
      }
    },
    (err) => {
      onError("Error");
    }
  );
};

export const updateSelfAssesmentAPI = (
  id: string,
  data: {
    organization: string;
    report: {
      category: string;
      subCategory: string;
      score: number;
      note: string;
    }[];
  },
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.put(`self-assessments/${id}`, data).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback();
      }
    },
    (err) => {
      onError("Error");
    }
  );
};

export const getTargetScoreByOrgIdAPI = (
  id: string,
  callback: (data: targetScoreResponseApiType[]) => void,
  onError: onErrorType
) => {
  Axios.get(`self-assessments/organization/${id}/targetScore`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error");
    }
  );
};

export const getLastSelfAssessmentScoreByOrgIdAPI = (
  id: string,
  callback: (data: latestSelfAssessmentResponseType[]) => void,
  onError: onErrorType
) => {
  Axios.get(`self-assessments/latest/${id}`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error");
    }
  );
};

export const getSelfAssessmentByOrgIdAPI = (
  id: string,
  callback: (data: selfAssessmentResponseType[]) => void,
  onError: onErrorType
) => {
  Axios.get(`self-assessments/organization/${id}`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error");
    }
  );
};

export const getSelfAssessmentById = (
  id: string,
  callback: (data: selfAssessmentResponseType) => void,
  onError: onErrorType
) => {
  Axios.get(`self-assessments/${id}`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Error");
    }
  );
};

export const dowloadSelfAssessmentAPI = (
  id: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.get(`self-assessments/download/${id}`, {
    responseType: "blob",
  }).then(
    (res) => {
      const response = res.data;
      if (response) {
        const blob = new Blob([response], { type: "text/csv" });
        const link = document.createElement("a");

        link.href = window.URL.createObjectURL(blob);
        link.download = "output.csv";
        link.click();

        window.URL.revokeObjectURL(link.href);
        link.remove();

        callback();
      }
    },
    (err) => {
      onError("Error");
    }
  );
};

export const deleteSelfAssessment = (
  id: string,
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.delete(`self-assessments/${id}`).then(
    (res) => {
      const response = res.data;
      if (response) {
        callback();
      }
    },
    (err) => {
      onError("Error");
    }
  );
};
