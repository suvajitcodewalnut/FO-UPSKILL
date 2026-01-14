import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserGrid from "./UserGrid";
import axios from "axios";
import useViewportSize from "../../hooks/useViewportSize";

// Mock the viewport hook
jest.mock("../../hooks/useViewportSize", () => ({
	__esModule: true,
	default: jest.fn(() => ({ width: 1024, height: 768 })),
}));

// Mock the CountryRenderer component
jest.mock("../Country/CountryRenderer", () => ({
	__esModule: true,
	default: () => <div data-testid="country-renderer">Country</div>,
}));

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedUseViewportSize = useViewportSize as jest.MockedFunction<
	typeof useViewportSize
>;

const mockUsers = [
	{
		id: "1",
		name: "John Doe",
		country: "USA",
		company: "Tech Corp",
		mobile: "123-456-7890",
	},
	{
		id: "2",
		name: "Jane Smith",
		country: "Canada",
		company: "Dev Inc",
		mobile: "098-765-4321",
	},
];

const renderWithQueryClient = (component: React.ReactElement) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return {
		...render(
			<QueryClientProvider client={queryClient}>
				{component}
			</QueryClientProvider>,
		),
		queryClient,
	};
};

describe("UserGrid", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedUseViewportSize.mockReturnValue({ width: 1024, height: 768 });
		mockedAxios.get.mockResolvedValue({ data: [] });
	});

	it("should render mobile message when viewport width is less than 500", () => {
		mockedUseViewportSize.mockReturnValue({ width: 499, height: 768 });

		renderWithQueryClient(<UserGrid />);

		expect(
			screen.getByText("WE ARE CURRENTLY ON DESKTOP !"),
		).toBeInTheDocument();
		expect(screen.queryByText("USER DATA GRID")).not.toBeInTheDocument();
	});

	it("should render the grid when viewport width is 500 or more", () => {
		mockedUseViewportSize.mockReturnValue({ width: 500, height: 768 });

		renderWithQueryClient(<UserGrid />);

		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
		expect(
			screen.queryByText("WE ARE CURRENTLY ON DESKTOP !"),
		).not.toBeInTheDocument();
	});

	it("should render the grid when viewport width is greater than 500", () => {
		mockedUseViewportSize.mockReturnValue({ width: 1200, height: 900 });

		renderWithQueryClient(<UserGrid />);

		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
	});

	it("should fetch user data from /users endpoint", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(mockedAxios.get).toHaveBeenCalledWith("/users");
		});
	});

	it("should call the API only once on initial render", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(mockedAxios.get).toHaveBeenCalledTimes(1);
		});
	});

	it("should handle empty data gracefully", async () => {
		mockedAxios.get.mockResolvedValue({ data: [] });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(mockedAxios.get).toHaveBeenCalled();
		});

		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
	});

	it("should handle API error gracefully", async () => {
		mockedAxios.get.mockRejectedValue(new Error("Network error"));

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(mockedAxios.get).toHaveBeenCalled();
		});

		// Component should still render the grid structure even on error
		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
	});

	it("should render all column headers", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("ID")).toBeInTheDocument();
		});

		expect(screen.getByText("NAME")).toBeInTheDocument();
		expect(screen.getByText("COMPANY")).toBeInTheDocument();
		expect(screen.getByText("COUNTRY")).toBeInTheDocument();
		expect(screen.getByText("MOBILE")).toBeInTheDocument();
	});

	it("should display user data in the grid", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});

		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
		expect(screen.getByText("Tech Corp")).toBeInTheDocument();
		expect(screen.getByText("Dev Inc")).toBeInTheDocument();
	});

	it("should display user IDs in the grid", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("1")).toBeInTheDocument();
		});

		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("should display mobile numbers in the grid", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("123-456-7890")).toBeInTheDocument();
		});

		expect(screen.getByText("098-765-4321")).toBeInTheDocument();
	});

	it("should use CountryRenderer for country column", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			const countryRenderers = screen.getAllByTestId("country-renderer");
			expect(countryRenderers.length).toBeGreaterThan(0);
		});
	});

	it("should use correct query key", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		const { queryClient } = renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			const queryState = queryClient.getQueryState(["userDataGridInformation"]);
			expect(queryState).toBeDefined();
		});
	});
});
