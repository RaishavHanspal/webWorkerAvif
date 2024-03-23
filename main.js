// Main thread

// Create a new web worker
const worker = new Worker('worker.js');

// Listen for messages from the worker
worker.onmessage = function (event) {
    // Obtain a blob: URL for the image data.
    const arrayBuffer = event.data;
    let bytes = new Uint8Array(arrayBuffer);

    let image = document.querySelector('img');
    image.src = 'data:image/png;base64,' + encode(bytes);
};


// public method for encoding an Uint8Array to base64
function encode(input) {
    let keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
            keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}

// load an avif file to encode it back to webp using webworker 
worker.postMessage({
    imageUrl: "./assets/abc.avif"
});
