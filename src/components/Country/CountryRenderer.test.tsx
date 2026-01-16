import { render, screen } from "@testing-library/react";
import CountryRenderer from "./CountryRenderer";
import type { CustomCellRendererProps } from "ag-grid-react";

const createMockProps = (
	value: { flag: string; name: string } | null | undefined,
): CustomCellRendererProps => {
	return {
		value,
		valueFormatted: null,
		getValue: jest.fn(),
		setValue: jest.fn(),
		formatValue: jest.fn(),
		data: {},
		node: {} as CustomCellRendererProps["node"],
		colDef: {} as CustomCellRendererProps["colDef"],
		column: {} as CustomCellRendererProps["column"],
		api: {} as CustomCellRendererProps["api"],
		context: {},
		rowIndex: 0,
		refreshCell: jest.fn(),
		eGridCell: document.createElement("div"),
		eParentOfValue: document.createElement("div"),
		registerRowDragger: jest.fn(),
		setTooltip: jest.fn(),
	} as CustomCellRendererProps;
};

const renderComponent = (flag: string, name: string) => {
	const props = createMockProps({ flag, name });
	return render(<CountryRenderer {...props} />);
};

describe("CountryRenderer", () => {
	it("should render a span containing icon and country name", () => {
		const { container } = renderComponent("us", "United States");

		const span = container.querySelector("span");
		const icon = container.querySelector("i");

		expect(span).toBeInTheDocument();
		expect(icon).toBeInTheDocument();
		expect(screen.getByText("United States")).toBeInTheDocument();
	});

	it("should apply correct flag class to icon", () => {
		const { container } = renderComponent("gb", "United Kingdom");

		const icon = container.querySelector("i");

		expect(icon).toHaveClass("fi");
		expect(icon).toHaveClass("fi-gb");
	});

	it("should render icon before country name", () => {
		const { container } = renderComponent("ca", "Canada");

		const span = container.querySelector("span");
		const icon = span?.querySelector("i");

		expect(span?.firstChild).toBe(icon);
	});

	it("should handle empty flag string", () => {
		const { container } = renderComponent("", "Unknown");

		const icon = container.querySelector("i");

		expect(icon?.className).toBe("fi fi-");
		expect(screen.getByText("Unknown")).toBeInTheDocument();
	});

	it("should handle special characters in country name", () => {
		renderComponent("ci", "Cote d'Ivoire");

		expect(screen.getByText("Cote d'Ivoire")).toBeInTheDocument();
	});
});
