import { useEffect, useState } from "react";

export default function useDebounce<T>(state: T, delay = 500) {
  const [debouncedState, setDebouncedState] = useState(state);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedState(state), delay);
    return () => clearTimeout(timer);
  }, [state, delay]);
  return debouncedState;
}
