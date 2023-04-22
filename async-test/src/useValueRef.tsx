import React from 'react';

type UseValueRef  = <T>(val: T) => React.MutableRefObject<T>;

const useValueRef:UseValueRef = <T,>(val: T) => {
  const ref = React.useRef(val);

  React.useEffect(() => {
    ref.current = val;
  }, [val]);

  return ref; 
}

export default useValueRef;


export function useEffectRef<T>(
  effect: (ref: React.MutableRefObject<T>) => void | (() => void | undefined), 
  val: T, 
  deps?: React.DependencyList
) {
  const ref = useValueRef(val);
  React.useEffect(() => effect(ref), deps);
}