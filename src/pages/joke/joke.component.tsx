import { constant, pipe } from 'fp-ts/lib/function';
import { Joke } from './joke.view-model';
import { Option } from 'fp-ts/lib/Option';
import * as O from 'fp-ts/Option';

interface JoksComponentProps {
    addJoke: () => void;
    jokes: ReadonlyArray<Option<Joke>>;
}

interface OptionSpanProps {
    data: Option<string>;
}

const OptionSpan = ({ data }: OptionSpanProps) => {
    return <span>{pipe(data, O.getOrElse(constant('-')))}</span>;
};

export const Jokes = ({ addJoke, jokes }: JoksComponentProps) => {
    return (
        <>
            <button onClick={addJoke}>generate joke</button>
            <div
                className="wrap-joke"
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                {jokes.map((j) =>
                    pipe(
                        j,
                        O.map((data) => data.joke),
                        (props) => <OptionSpan data={props} />
                    )
                )}
            </div>
        </>
    );
};
