import { MutableRefObject, useCallback, useRef } from "react";
import { useDispatch } from "./useDispatch";

export const useRegisterRef = <T>(
    name: string,
): (x: T) => void => {
    const dispatch = useDispatch();

    const ref = useRef<T>() as MutableRefObject<T>;

    const register = useCallback(
        (value) => {
            ref.current = value;
            console.log("registering ref", name, ref);
            dispatch.refs.set({
                key: name,
                value: ref,
            });
        },
        [dispatch.refs, name],
    );

    return register;
};