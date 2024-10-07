/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';

export const useMergeState = <A>(
    init: A
): [A, (chenge: Partial<A>) => void] => {
    const [state, setStete] = useState(init);
    const setChenges = (chenge: Partial<A>) => {
        setStete((a) => ({
            ...a,
            ...chenge,
        }));
    };
    return [state, setChenges];
};

export const useOutsideClick = (
    ref: React.MutableRefObject<HTMLDivElement | null>,
    additionalRuls: boolean,
    cb: () => void
) => {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        // @ts-ignore
        function handleClickOutside(event) {
            if (
                additionalRuls &&
                ref.current &&
                !ref.current.contains(event.target)
            ) {
                cb();
            }
        }
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [additionalRuls, cb, ref]);
};
