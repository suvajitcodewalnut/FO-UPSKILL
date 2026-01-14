import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("ROOT ELEMENT IS MISSING !");
}

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>,
);
