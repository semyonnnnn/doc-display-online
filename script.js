const script_id = "script_vacs_25_09_2025";
const script = document.getElementById(script_id);
const script_parent = script.parentElement;

const iframe = document.createElement("iframe");
iframe.style.width = "100%";
iframe.style.height = "100%";
iframe.style.border = "none";

iframe.src = "";

script_parent.appendChild(iframe);
