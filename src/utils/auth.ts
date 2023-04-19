const isLogin = () => {
  // return !!localStorage.getItem('token');
  if (localStorage.getItem('isLogin')) {
    return true;
  }
  return false;
};

const getToken = () => {
  return localStorage.getItem('isLogin');
};

const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

const clearToken = () => {
  localStorage.removeItem('isLogin');
};

export { isLogin, getToken, setToken, clearToken };
