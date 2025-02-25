export function useUser() {
  const user = ref<{ nickname: string } | null>(null);

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
