import { useEffect, useState } from "react";

interface ViewportValues {
	height: number;
	width: number;
}

const getViewportSize = (): ViewportValues => {
	if (typeof window === "undefined") {
		return { width: 0, height: 0 };
	}
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
};

const useViewportSize = (): ViewportValues => {
	const [viewport, setViewport] = useState<ViewportValues>(getViewportSize);
	useEffect(() => {
		const handleResize = () => {
			setViewport(getViewportSize());
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);
	return viewport;
};

export default useViewportSize;
