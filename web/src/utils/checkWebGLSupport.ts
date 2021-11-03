export default function checkWebGlSupport(): boolean {
    try {
        var canvas = document.createElement('canvas');
        return Boolean(
            window.WebGLRenderingContext &&
                (canvas.getContext('webgl') ||
                    canvas.getContext('experimental-webgl')),
        );
    } catch (e) {}
    
    return false;
}
