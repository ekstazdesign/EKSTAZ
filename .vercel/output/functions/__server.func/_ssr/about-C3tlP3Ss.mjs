import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as aboutPlaylist, n as aboutBrand, o as personalSocials, r as aboutElton, t as Shell } from "./shell-IN7XKgpJ.mjs";
import { t as Spotify } from "./spotify-DT-WVawq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-C3tlP3Ss.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "md:sticky md:top-28 md:self-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/media/elton.jpg",
				alt: "Elton D'Souza",
				className: "w-full max-w-md grayscale"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/media/soul/elty.jpg",
				alt: "Elty, drawn",
				className: "mt-4 w-full max-w-md"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-xs uppercase tracking-[0.35em] text-crimson",
						children: "About Elton"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-6 font-serif text-lg leading-relaxed text-bone md:text-xl",
						children: [aboutElton.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, paragraph.slice(0, 24))), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-crimson",
							children: "I am EKSTAZ"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/media/soul/dont-fit-in.jpg",
						alt: "Don't fit in",
						className: "mt-10 w-full max-w-sm"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xs uppercase tracking-[0.35em] text-crimson",
						children: "About EKSTAZ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 font-serif text-lg leading-relaxed text-bone",
						children: aboutBrand
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/media/soul/before-thee.jpg",
						alt: "Before thee, EKSTAZ",
						className: "mt-10 w-full max-w-md"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "border-t border-line pt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-xs uppercase tracking-[0.28em] text-muted",
							children: aboutPlaylist.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spotify, {
								id: aboutPlaylist.id,
								title: aboutPlaylist.title
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-6 flex gap-6",
							children: personalSocials.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: item.href,
								target: "_blank",
								rel: "noreferrer",
								className: "font-serif text-xs uppercase tracking-[0.2em] text-muted hover:text-bone",
								children: item.label
							}) }, item.href))
						})
					]
				})
			]
		})]
	}) });
}
//#endregion
export { About as component };
