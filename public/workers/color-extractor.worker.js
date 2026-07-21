// color-extractor.worker.js
self.onmessage = async (e) => {
  const { imageUrl } = e.data;

  try {
    // Attempt to fetch the image. We assume the URL passed is already proxied or allows CORS.
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    
    // Create an OffscreenCanvas to draw the image and extract pixels
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Could not get 2D context from OffscreenCanvas");
    }

    ctx.drawImage(bitmap, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let r = 0, g = 0, b = 0;
    let count = 0;
    
    // Sample every 4th pixel (step by 16) to speed up extraction
    for (let i = 0; i < data.length; i += 16) {
      // Ignore pixels that are too dark or too transparent
      if (data[i + 3] > 128 && (data[i] > 20 || data[i+1] > 20 || data[i+2] > 20)) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
    }
    
    if (count > 0) {
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
    } else {
      // Fallback
      r = 128; g = 128; b = 128;
    }
    
    self.postMessage({ success: true, color: { r, g, b } });
    
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
