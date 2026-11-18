import { useRegisterSW } from "virtual:pwa-register/react";

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  function handleUpdate() {
    // Reload when the new service worker takes control
    navigator.serviceWorker.addEventListener("controllerchange", () =>
      window.location.reload(),
    );
    updateServiceWorker(false);
    // If nothing changed, reload anyway to get the latest version
    setTimeout(() => window.location.reload(), 2000);
  }

  if (!needRefresh) return null;

  return (
    <div className="update-bar">
      <span>A new version is available.</span>
      <button className="button" onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
}
