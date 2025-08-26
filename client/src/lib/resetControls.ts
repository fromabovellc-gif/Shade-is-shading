export function resetControls() {
  try {
    localStorage.removeItem("hue");
    localStorage.removeItem("speed");
    localStorage.removeItem("intensity");
  } catch {}
  window.location.reload();
}
