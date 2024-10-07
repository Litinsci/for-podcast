import { injectable, token } from '@injectable-ts/core';
import {
    ValueWithEffect,
    valueWithEffect,
} from '../../utils/run-view-model.utils';
import { JokeService } from '../../rest-service/joke.service';
import { pipe } from 'fp-ts/lib/function';
import { chain, tap } from '@most/core';
import { createAdapter } from '@most/adapter';
import { Option } from 'fp-ts/lib/Option';
import { Property } from '@frp-ts/core';
import { newLensedAtom } from '@frp-ts/lens';
import * as O from 'fp-ts/Option';
import { either } from 'fp-ts';

export interface Joke {
    id: number;
    joke: string;
}

export interface JokeViewModel {
    addJoke: () => void;
    jokes: Property<ReadonlyArray<Option<Joke>>>;
}

export interface NewJokeViewModel {
    (): ValueWithEffect<JokeViewModel>;
}

export const newJokeViewModel = injectable(
    token('jokeService')<JokeService>(),
    (jokeService): NewJokeViewModel =>
        () => {
            const [addJoke, jokeEvent] = createAdapter<void>();
            const jokes = newLensedAtom<ReadonlyArray<Option<Joke>>>(
                [] as ReadonlyArray<Option<Joke>>
            );
            const jokeEffect = pipe(
                jokeEvent,
                chain((_) => jokeService.getJoke()),
                tap((newJoke) => {
                    jokes.modify((j) => [
                        ...j,
                        pipe(
                            newJoke,
                            either.map((data) => ({
                                id: data.id,
                                joke: `${data.setup} - ${data.punchline}`,
                            })),
                            O.fromEither
                        ),
                    ]);
                })
            );
            return valueWithEffect.new(
                {
                    addJoke,
                    jokes,
                },
                jokeEffect
            );
        }
);
