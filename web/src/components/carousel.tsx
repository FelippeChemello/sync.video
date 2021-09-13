import { Children, useState, useCallback } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

import { random } from '../utils/random';

export default function Carousel({ children }) {
    const quantity = Children.count(children);
    const [position, setPosition] = useState(random(0, quantity));

    const next = useCallback(() => {
        const nextPosition = position + 1 === quantity ? 0 : position + 1;

        setPosition(nextPosition);
    }, [position]);

    const back = useCallback(() => {
        const previousPosition =
            position - 1 === -1 ? quantity - 1 : position - 1;

        setPosition(previousPosition);
    }, [position]);

    return (
        <>
            <BiChevronLeft
                size={32}
                onClick={back}
                style={{ cursor: 'pointer' }}
            />
            {Children.map(children, (child, index) => {
                if (index === position) return child;
            })}
            <BiChevronRight
                size={32}
                onClick={next}
                style={{ cursor: 'pointer' }}
            />
        </>
    );
}
