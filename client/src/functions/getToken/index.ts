const getToken = () => {
  let token = "";

  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("token=")) {
      token = cookie.substring("token=".length, cookie.length);
      break;
    }
  }

  return token;
};

export default getToken;
