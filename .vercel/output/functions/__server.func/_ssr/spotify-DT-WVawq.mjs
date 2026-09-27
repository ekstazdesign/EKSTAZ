import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spotify-DT-WVawq.js
var import_jsx_runtime = require_jsx_runtime();
function Spotify({ id, title, tall = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
		title,
		src: `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`,
		width: "100%",
		height: tall ? 352 : 152,
		allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
		loading: "lazy",
		className: "border-0 bg-ink"
	});
}
function Youtube({ id, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "aspect-video w-full bg-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			title,
			src: `https://www.youtube.com/embed/videoseries?list=${id}`,
			width: "100%",
			height: "100%",
			allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
			allowFullScreen: true,
			loading: "lazy",
			className: "h-full w-full border-0"
		})
	});
}
//#endregion
export { Youtube as n, Spotify as t };
