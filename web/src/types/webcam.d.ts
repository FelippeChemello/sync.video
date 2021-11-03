type WebcamBackgroundTypes = 'normal' | 'image' | 'blur';

type WebcamBackgroundTypesDisplay = {
    label: string;
    type: WebcamBackgroundTypes;
    image: string | ReactNode;
};
