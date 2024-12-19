export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 > Date.now();
};
