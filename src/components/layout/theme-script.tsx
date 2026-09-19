/**
 * Runs synchronously before first paint so the stored theme is applied without a flash.
 * Kept tiny and dependency-free on purpose; ThemeToggle keeps it in sync afterwards.
 */
const script = `(function(){try{var s=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s==="dark"||s==="light"?s:(m?"dark":"light");document.documentElement.dataset.theme=t;if(localStorage.getItem("hide-imageless")==="true"){document.documentElement.dataset.hideImageless="true"}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
