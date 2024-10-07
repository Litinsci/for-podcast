import { Property } from '@frp-ts/core';
import {
    multicast,
    newStream,
    propagateEventTask,
    skipRepeats,
} from '@most/core';
import { asap } from '@most/scheduler';
import { Disposable, Stream } from '@most/types';
import { pipe } from 'fp-ts/lib/function';

export const fromProperty = <A>(fa: Property<A>): Stream<A> =>
    pipe(
        newStream((sink, scheduler) => {
            const propagateValue = () =>
                asap(propagateEventTask(fa.get(), sink), scheduler);
            let d: Disposable = propagateValue();
            const subscription = fa.subscribe({
                next() {
                    d?.dispose();
                    d = propagateValue();
                },
            });
            return {
                dispose() {
                    d?.dispose();
                    subscription.unsubscribe();
                },
            };
        }),
        skipRepeats,
        multicast
    );
