import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Shell } from "./shell-IN7XKgpJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BHcEVFWh.js
var import_jsx_runtime = require_jsx_runtime();
var letters = [
	"e",
	"k",
	"s",
	"t",
	"a",
	"z"
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-[calc(100svh-4.5rem)] flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col items-center justify-center px-6 py-20 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "rise flex w-full items-end justify-center gap-1 md:gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: "EKSTAZ"
					}), letters.map((letter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: `/media/type/${letter}.png`,
						alt: "",
						className: "h-[clamp(4.25rem,14vw,13rem)] w-auto"
					}, letter))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rise mt-10 max-w-md font-serif text-sm uppercase tracking-[0.32em] text-bone md:text-base",
					children: "A new strain of exotic hype design"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pb-14 text-center font-serif text-xs uppercase tracking-[0.5em] text-crimson",
				children: "Don't fit in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/media/soul/pain.jpg",
				alt: "Pain. Hands around an eye.",
				className: "w-full"
			})
		]
	}) });
}
//#endregion
export { Home as component };
