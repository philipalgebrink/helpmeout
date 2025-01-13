export function useDebounce(value: Ref<any>, delay = 300) {
  const debouncedValue = ref(value.value);

  let timeout: ReturnType<typeof setTimeout>;
  watch(value, (newValue) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  return debouncedValue;
}