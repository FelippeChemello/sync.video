export default function isTouchDevice() {
    try {
        let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

        let midiaQuery = function (query: string) {
            return window.matchMedia(query).matches;
        };

        if ('ontouchstart' in window) {
            return true;
        }

        return midiaQuery(
            ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(''),
        );
    } catch (e) {
        console.error('(Touch detect failed)', e);
        return false;
    }
}
