export function waitForGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (window.google?.maps) {
        window.clearInterval(interval);
        resolve();
      } else if (attempts > 100) {
        window.clearInterval(interval);
        reject(new Error("Google Maps failed to load"));
      }
    }, 100);
  });
}
