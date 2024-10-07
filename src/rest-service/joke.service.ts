import { Either, fold } from 'fp-ts/lib/Either';
import { Stream } from '@most/types';
import { fromPromise } from '@most/core';
import axios from 'axios';
import { either } from 'fp-ts';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';

export interface JokeService {
    readonly getJoke: () => Stream<Either<string, JokeResponce>>;
}

const domain = 'https://official-joke-api.appspot.com';

const API = {
    get: `${domain}/random_joke`,
};

interface JokeResponce {
    id: number;
    punchline: string;
    setup: string;
    type: string;
}

const jokeCodec = t.type({
    id: t.number,
    punchline: t.string,
    setup: t.string,
    type: t.string,
});

export const newGamesService = (): JokeService => ({
    getJoke: () =>
        fromPromise(
            axios
                .get(`${API.get}`)
                .then(({ data }) =>
                    pipe(
                        data,
                        jokeCodec.decode,
                        fold(
                            () => either.left('alarm'),
                            (data) => either.right(data)
                        )
                    )
                )
                .catch((error) => {
                    return either.left(
                        `Something goes wrong status = ${error.response.status}`
                    );
                })
        ),
});
