import Axios from "@/helpers/Axios";

export const verifyEmailAPI = (
  data: verifyEmailAPIType,
  callback: (data: any) => void,
  onError: onErrorType
) => {
  Axios.post("auth/forget-password", data).then(
    (res) => {
      const response = res.data;
      if (response) {
        document.cookie = `token=${response.token}; max-age=86400; path=/`;
        callback(response);
      }
    },
    (err) => {
      onError("Invalid Email");
    }
  );
};

export const resetPasswordAPI = (
  data: resetPasswordAPIType,
  callback: (data: any) => void,
  onError: onErrorType
) => {
  Axios.post("auth/reset-password", data).then(
    (res) => {
      const response = res.data;
      if (response) {
        document.cookie = `token=${response.token}; max-age=86400; path=/`;
        callback(response);
      }
    },
    (err) => {
      onError("Invalid Email");
    }
  );
};

export const verifyOTPAPI = (
  data: verifyOTPAPIType,
  callback: (data: any) => void,
  onError: onErrorType
) => {
  Axios.post("auth/verify-otp", data).then(
    (res) => {
      const response = res.data;
      if (response) {
        document.cookie = `token=${response.token}; max-age=86400; path=/`;
        callback(response);
      }
    },
    (err) => {
      onError("Invalid Email");
    }
  );
};

export const loginAPI = (
  data: loginAPIType,
  callback: (data: userResponseDataType) => void,
  onError: onErrorType
) => {
  Axios.post("auth/login", data).then(
    (res) => {
      const response = res.data;
      if (response) {
        document.cookie = `token=${response.token}; max-age=86400; path=/`;
        callback(response);
      }
    },
    (err) => {
      onError("Invalid Email or Password");
    }
  );
};

export const updatePasswordAPI = (
  data: { newPassword: string },
  callback: callbackType,
  onError: onErrorType
) => {
  Axios.post("auth/update-password", data).then(
    (res) => {
      const response = res.data;
      if (response) {
        document.cookie = `token=${response.token}; max-age=700000000; path=/`;
        callback();
      }
    },
    (err) => {
      onError("Error Updating Password");
    }
  );
};

export const logoutAPI = (callback: callbackType) => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  callback();
};

export const getUserData = (
  callback: (data: userResponseDataType) => void,
  onError: onErrorType
) => {
  Axios.get("auth/user").then(
    (res) => {
      const response = res.data;
      if (response) {
        callback(response);
      }
    },
    (err) => {
      onError("Server Error");
    }
  );
};
