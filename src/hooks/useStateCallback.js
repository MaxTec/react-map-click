import { useCallback, useEffect, useRef, useState } from "react";
function useStateCallback(initialState) {
  const [state, _setState] = useState(initialState);
  const callbackRef = useRef();
  const isFirstCallbackCall = useRef(true);
  const setState = useCallback((setStateAction, callback) => {
    callbackRef.current = callback;
    _setState(setStateAction);
  }, []);
  useEffect(() => {
    var _a;
    if (isFirstCallbackCall.current) {
      isFirstCallbackCall.current = false;
      return;
    }
    (_a = callbackRef.current) === null || _a === void 0 ? void 0 : _a.call(callbackRef, state);
  }, [state]);
  return [state, setState];
}
export default useStateCallback;
