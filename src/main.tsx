import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("ROOT ELEMENT IS MISSING !");
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
