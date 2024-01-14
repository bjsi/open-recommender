export const login = async () => {
  window.open(`${import.meta.env.VITE_SERVER_URL}/auth/twitter`, "_self");
};

export const logout = async () => {
  window.open(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, "_self");
};
