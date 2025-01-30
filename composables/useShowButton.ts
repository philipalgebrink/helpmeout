export function useShowButton() {
  const route = useRoute();
  const nickname = ref(route.params.nickname as string);

  const showButton = computed(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.nickname === nickname.value;
    }
    return false;
  });

  return { showButton, nickname };
}