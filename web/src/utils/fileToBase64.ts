export default function convertFileToBase64(file: Blob) {
    // return btoa(unescape(encodeURIComponent(file)));

    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            const base64WithHeader = fileReader.result as string;
            resolve(base64WithHeader.split(',')[1]);
        };

        fileReader.onerror = err => {
            reject(err);
        };
    });
}
