import { injectable } from '@injectable-ts/core';
import { newJokeViewModel } from './joke.view-model';
import { useValueWithEffect } from '../../utils/run-view-model.utils';
import React from 'react';
import { Jokes } from './joke.component';
import { useProperty } from '@frp-ts/react';

export const JoksContainer = injectable(
    newJokeViewModel,
    (newJokeViewModel) => () => {
        const vm = useValueWithEffect(() => newJokeViewModel(), []);

        const jokes = useProperty(vm.jokes);

        return React.createElement(Jokes, { ...vm, jokes });
    }
);
