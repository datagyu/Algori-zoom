/* Check for a new deployment when a saved app/page is opened again. */
(() => {
  const script = document.currentScript;
  const version = script?.dataset.version;
  if (!version) return; // Enabled by the Pages build, not the local preview.
  const versionUrl = new URL('../version.json', script.src);
  let checking = false;
  let reloading = false;

  async function checkForUpdate() {
    if (document.visibilityState !== 'visible' || checking || reloading) return;
    checking = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(versionUrl, {
        cache: 'no-store', signal: controller.signal,
      });
      if (!response.ok) return;
      const latest = (await response.json()).version;
      if (typeof latest !== 'string' || !/^[a-f0-9]{12}$/.test(latest) || latest === version) return;
      if (document.visibilityState !== 'visible') return;
      const url = new URL(location.href);
      // Avoid a reload loop if a CDN temporarily serves an older HTML file.
      if (url.searchParams.get('_appVersion') === latest) return;
      url.searchParams.set('_appVersion', latest);
      reloading = true;
      location.replace(url.href);
    } catch (_) {
      // Offline or failed checks must leave the current page usable.
    } finally {
      clearTimeout(timeout);
      checking = false;
    }
  }

  document.addEventListener('visibilitychange', checkForUpdate);
  window.addEventListener('pageshow', checkForUpdate);
  window.addEventListener('online', checkForUpdate);
  checkForUpdate();
})();
