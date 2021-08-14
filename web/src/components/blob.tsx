import { random } from '../utils/random';

interface BlobProps {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
    width?: number;
    height?: number;
}

export default function Blob({
    bottom,
    left,
    right,
    top,
    height,
    width,
}: BlobProps) {
    const cord1 = random(25, 75);
    const cord2 = random(25, 75);
    const cord3 = random(25, 75);
    const cord4 = random(25, 75);

    return (
        <div
            style={{
                boxShadow: '0 0 0 1px rgba(0,0,0,0)',
                borderRadius: `
                ${random(25, 75)}% ${random(25, 75)}% 
                ${random(25, 75)}% ${random(25, 75)}% / 
                ${random(25, 75)}% ${random(25, 75)}% 
                ${random(25, 75)}% ${random(25, 75)}%`,
                width: `${width ? width : 150}px`,
                height: `${height ? height : 150}px`,
                background: '#ebf8ff',
                position: 'fixed',
                zIndex: -1,
                left,
                right,
                bottom,
                top,
            }}
        ></div>
    );
}
