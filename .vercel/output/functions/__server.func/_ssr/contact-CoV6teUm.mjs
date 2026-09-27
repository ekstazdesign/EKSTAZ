import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as brandSocials, t as Shell } from "./shell-IN7XKgpJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-CoV6teUm.js
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[70svh] max-w-3xl flex-col justify-center px-5 py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-serif text-xs uppercase tracking-[0.35em] text-crimson",
				children: "Find EKSTAZ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-serif text-5xl leading-none text-bone md:text-7xl",
				children: "Contact"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-12 flex flex-col",
				children: brandSocials.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-t border-line last:border-b",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.href,
						target: "_blank",
						rel: "noreferrer",
						className: "flex min-h-16 items-center font-serif text-2xl text-bone hover:text-crimson md:text-4xl",
						children: item.label
					})
				}, item.href))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/media/soul/mark.jpg",
				alt: "EKSTAZ mark",
				className: "mt-16 w-40"
			})
		]
	}) });
}
//#endregion
export { Contact as component };
