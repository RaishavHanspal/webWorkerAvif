// worker code

importScripts('wasm_avif.js'); // Import the wasm_avif.js file
importScripts('wasm_webp.js'); // Import the wasm_webp.js file
var webpOptions = {
    quality: 75,
    target_size: 0,
    target_PSNR: 0,
    method: 4,
    sns_strength: 50,
    filter_strength: 60,
    filter_sharpness: 0,
    filter_type: 1,
    partitions: 0,
    segments: 4,
    pass: 1,
    show_compressed: 0,
    preprocessing: 0,
    autofilter: 0,
    partition_limit: 0,
    alpha_compression: 1,
    alpha_filtering: 1,
    alpha_quality: 100,
    lossless: 0,
    exact: 0,
    image_hint: 0,
    emulate_jpeg_size: 0,
    thread_level: 0,
    low_memory: 0,
    near_lossless: 100,
    use_delta_palette: 0,
    use_sharp_yuv: 0
};

self.addEventListener('message', async function (event) {
    const URL = event.data.imageUrl;
    const fetchImage = async () => new Uint8Array(await fetch(URL).then(res => res.arrayBuffer()));
    /** first fetch, then decode from avif, then encode to webp */
    Promise.all([fetchImage(), wasm_avif(), wasm_webp()])
        .then(([buffer, decoder, encoder]) => {
            // log source AVIF image
            console.log(buffer);

            // decode AVIF image into raw RGB Uint8Array
            const alpha = true; // return RGBA instead of RGB
            const decoded = decoder.decode(buffer, buffer.length, alpha);   // buffer, length, return alpha channel?
            const { channels, width, height } = decoder.dimensions();

            // encode raw RGB image into JPEG format using the Webp encoder and its default options
            const encoded = encoder.encode(decoded, width, height, channels, webpOptions);

            // clean up WebAssembly memory
            decoder.free();
            encoder.free();

            return encoded;
        })
        .then(this.self.postMessage);
});


