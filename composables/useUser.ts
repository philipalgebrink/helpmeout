export function useUser() {
  const user = ref<{ userId: string; nickname: string; email: string } | null>(null);

  // Fetch user from localStorage
  const fetchUser = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");
      user.value = storedUser ? JSON.parse(storedUser) : null;
    }
  };

  // Initialize on composable use
  fetchUser();

  return { user, fetchUser };
}