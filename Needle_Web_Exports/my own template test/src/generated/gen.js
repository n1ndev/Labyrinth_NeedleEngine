﻿import "./register_types.ts"

export const needle_exported_files = new Array();
globalThis["needle:codegen_files"] = needle_exported_files;
needle_exported_files.push("assets/gameObject.glb?v=1704383714399");

document.addEventListener("DOMContentLoaded", () =>
{
	const needleEngine = document.querySelector("needle-engine");
	if(needleEngine && needleEngine.getAttribute("src") === null)
	{
		needleEngine.setAttribute("hash", "1704383714399");
		needleEngine.setAttribute("src", JSON.stringify(needle_exported_files));
	}
});
