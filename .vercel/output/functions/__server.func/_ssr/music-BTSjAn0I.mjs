import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as youtube, s as spotify, t as Shell } from "./shell-IN7XKgpJ.mjs";
import { n as Youtube, t as Spotify } from "./spotify-DT-WVawq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/music-BTSjAn0I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Music() {
	const [open, setOpen] = (0, import_react.useState)(spotify[0].id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-5 py-16 md:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-serif text-xs uppercase tracking-[0.35em] text-crimson",
				children: "Listen"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-serif text-5xl leading-none text-bone md:text-7xl",
				children: "Music"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/media/soul/lsd.jpg",
				alt: "LSD",
				className: "mt-12 w-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-14 flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-xs uppercase tracking-[0.28em] text-muted",
					children: "Spotify"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-line border-y border-line",
					children: spotify.map((item) => {
						const active = open === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-expanded": active,
							onClick: () => setOpen(item.id),
							className: "flex min-h-14 w-full items-center justify-between text-left font-serif text-lg text-bone",
							children: [item.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.22em] text-crimson",
								children: active ? "Open" : "Play"
							})]
						}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spotify, {
								id: item.id,
								title: item.title,
								tall: true
							})
						}) : null] }, item.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-xs uppercase tracking-[0.28em] text-muted",
					children: "YouTube"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-line border-y border-line",
					children: youtube.map((item) => {
						const key = `yt-${item.id}`;
						const active = open === key;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-expanded": active,
							onClick: () => setOpen(key),
							className: "flex min-h-14 w-full items-center justify-between text-left font-serif text-lg text-bone",
							children: [item.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.22em] text-crimson",
								children: active ? "Open" : "Play"
							})]
						}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, {
								id: item.id,
								title: item.title
							})
						}) : null] }, item.id);
					})
				})]
			})
		]
	}) });
}
//#endregion
export { Music as component };
