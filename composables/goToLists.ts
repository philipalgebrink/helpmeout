export const useGoToLists = (nickname: string) => {
  const router = useRouter();
  
  const GoToLists = () => {
    router.push(`/u/${nickname}/lists`);
  };

  return { GoToLists };
};
