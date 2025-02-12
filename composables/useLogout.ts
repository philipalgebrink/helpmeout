export const useLogout = () => {
  const router = useRouter();
  const authCookie = useCookie('auth');
  const logout = () => {
    authCookie.value = null;
    localStorage.removeItem('user');
    alert('You have been logged out.');
    reloadNuxtApp();
  };

  return { logout };
};