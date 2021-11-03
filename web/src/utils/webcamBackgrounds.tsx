import { MdBlock, MdBlurOn } from 'react-icons/md';

// TODO: i18n
export const webcamBackgrounds: {
    camera: WebcamBackgroundTypesDisplay[];
    virtual: WebcamBackgroundTypesDisplay[];
} = {
    camera: [
        {
            label: 'Normal',
            type: 'normal',
            image: MdBlock,
        },
        {
            label: 'Blur',
            type: 'blur',
            image: MdBlurOn,
        },
    ],
    virtual: [
        {
            label: 'Cinema',
            type: 'image',
            image: '../assets/backgrounds/cinema.jpg',
        },
        {
            label: 'Room',
            type: 'image',
            image: '../assets/backgrounds/room.jpg',
        },
        {
            label: 'Sofa',
            type: 'image',
            image: '../assets/backgrounds/sofa.jpg',
        },
    ],
};
