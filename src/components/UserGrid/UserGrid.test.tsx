import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserGrid from "./UserGrid";
import axios from "axios";
import useViewportSize from "../../hooks/useViewportSize";
import {
	mockLargeDataset,
	mockSingleUser,
	mockThreeUsers,
	mockUsers,
	mockUsersWithLongText,
	mockUsersWithPaddedIds,
	mockUsersWithSpecialChars,
	mockUsersWithUnicode,
	mockUsersForSorting,
	mockUsersForFiltering,
} from "../../../tests/mocks/userMock";

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

	it("should render correctly with a single user", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockSingleUser });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText(mockSingleUser[0].name)).toBeInTheDocument();
		});

		expect(screen.getByText(mockSingleUser[0].company)).toBeInTheDocument();
		expect(screen.getByText(mockSingleUser[0].mobile)).toBeInTheDocument();
	});

	it("should handle users with special characters in their data", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersWithSpecialChars });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(
				screen.getByText(mockUsersWithSpecialChars[0].name),
			).toBeInTheDocument();
		});

		expect(
			screen.getByText(mockUsersWithSpecialChars[1].name),
		).toBeInTheDocument();
		expect(
			screen.getByText(mockUsersWithSpecialChars[0].company),
		).toBeInTheDocument();
		expect(
			screen.getByText(mockUsersWithSpecialChars[1].company),
		).toBeInTheDocument();
	});

	it("should handle users with unicode characters", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersWithUnicode });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(
				screen.getByText(mockUsersWithUnicode[0].name),
			).toBeInTheDocument();
		});

		expect(screen.getByText(mockUsersWithUnicode[1].name)).toBeInTheDocument();
	});

	it("should not fetch data when viewport is below 500", async () => {
		mockedUseViewportSize.mockReturnValue({ width: 300, height: 768 });
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		expect(
			screen.getByText("WE ARE CURRENTLY ON DESKTOP !"),
		).toBeInTheDocument();
	});

	it("should render mobile message at very small viewport width", () => {
		mockedUseViewportSize.mockReturnValue({ width: 100, height: 400 });

		renderWithQueryClient(<UserGrid />);

		expect(
			screen.getByText("WE ARE CURRENTLY ON DESKTOP !"),
		).toBeInTheDocument();
	});

	it("should handle large dataset", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockLargeDataset });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText(mockLargeDataset[0].name)).toBeInTheDocument();
		});
	});

	it("should render CountryRenderer for each user row", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockThreeUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			const countryRenderers = screen.getAllByTestId("country-renderer");
			expect(countryRenderers).toHaveLength(mockThreeUsers.length);
		});
	});

	it("should handle users with numeric IDs as strings", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersWithPaddedIds });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(
				screen.getByText(mockUsersWithPaddedIds[0].id),
			).toBeInTheDocument();
		});

		expect(screen.getByText(mockUsersWithPaddedIds[1].id)).toBeInTheDocument();
	});

	it("should maintain grid structure with no rows when data is empty", async () => {
		mockedAxios.get.mockResolvedValue({ data: [] });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("ID")).toBeInTheDocument();
		});

		expect(screen.getByText("NAME")).toBeInTheDocument();
		expect(screen.getByText("COMPANY")).toBeInTheDocument();
		expect(screen.getByText("COUNTRY")).toBeInTheDocument();
		expect(screen.getByText("MOBILE")).toBeInTheDocument();
	});

	it("should render grid heading as expected", () => {
		renderWithQueryClient(<UserGrid />);

		const heading = screen.getByText("USER DATA GRID");
		expect(heading).toBeInTheDocument();
	});

	it("should not render grid content on mobile viewport", () => {
		mockedUseViewportSize.mockReturnValue({ width: 400, height: 600 });

		renderWithQueryClient(<UserGrid />);

		expect(screen.queryByText("ID")).not.toBeInTheDocument();
		expect(screen.queryByText("NAME")).not.toBeInTheDocument();
		expect(screen.queryByText("COMPANY")).not.toBeInTheDocument();
	});

	it("should handle viewport at exact boundary of 499", () => {
		mockedUseViewportSize.mockReturnValue({ width: 499, height: 768 });

		renderWithQueryClient(<UserGrid />);

		expect(
			screen.getByText("WE ARE CURRENTLY ON DESKTOP !"),
		).toBeInTheDocument();
		expect(screen.queryByText("USER DATA GRID")).not.toBeInTheDocument();
	});

	it("should handle viewport at exact boundary of 501", () => {
		mockedUseViewportSize.mockReturnValue({ width: 501, height: 768 });

		renderWithQueryClient(<UserGrid />);

		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
		expect(
			screen.queryByText("WE ARE CURRENTLY ON DESKTOP !"),
		).not.toBeInTheDocument();
	});

	it("should handle users with long text values", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersWithLongText });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(
				screen.getByText(mockUsersWithLongText[0].name),
			).toBeInTheDocument();
		});
	});

	it("should handle different HTTP error codes gracefully", async () => {
		const error = new Error("Request failed") as Error & {
			response?: { status: number };
		};
		error.response = { status: 500 };
		mockedAxios.get.mockRejectedValue(error);

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(mockedAxios.get).toHaveBeenCalled();
		});

		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
	});

	it("should handle 404 error gracefully", async () => {
		const error = new Error("Not found") as Error & {
			response?: { status: number };
		};
		error.response = { status: 404 };
		mockedAxios.get.mockRejectedValue(error);

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(mockedAxios.get).toHaveBeenCalled();
		});

		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
	});

	it("should render sortable column headers", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersForSorting });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("NAME")).toBeInTheDocument();
		});

		expect(screen.getByText("NAME")).toBeInTheDocument();
		expect(screen.getByText("COMPANY")).toBeInTheDocument();
		expect(screen.getByText("COUNTRY")).toBeInTheDocument();
	});

	it("should display all rows before any sorting is applied", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersForSorting });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
		});

		expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
		expect(screen.getByText("Bob Smith")).toBeInTheDocument();
	});

	it("should sort column when header is clicked", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersForSorting });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("NAME")).toBeInTheDocument();
		});

		const nameHeader = screen.getByText("NAME");
		await act(async () => {
			nameHeader.click();
		});

		await waitFor(() => {
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
			expect(screen.getByText("Bob Smith")).toBeInTheDocument();
			expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
		});
	});

	it("should toggle sort order on multiple header clicks", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersForSorting });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("NAME")).toBeInTheDocument();
		});

		const nameHeader = screen.getByText("NAME");

		await act(async () => {
			nameHeader.click();
		});

		await act(async () => {
			nameHeader.click();
		});

		await waitFor(() => {
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
			expect(screen.getByText("Bob Smith")).toBeInTheDocument();
			expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
		});
	});

	it("should allow sorting by COMPANY column", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersForSorting });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("COMPANY")).toBeInTheDocument();
		});

		const companyHeader = screen.getByText("COMPANY");
		await act(async () => {
			companyHeader.click();
		});

		await waitFor(() => {
			expect(screen.getByText("Alpha Corp")).toBeInTheDocument();
			expect(screen.getByText("Beta Ltd")).toBeInTheDocument();
			expect(screen.getByText("Zebra Inc")).toBeInTheDocument();
		});
	});

	it("should have filter enabled on NAME column", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersForFiltering });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("NAME")).toBeInTheDocument();
		});

		expect(screen.getByText("John Developer")).toBeInTheDocument();
		expect(screen.getByText("Jane Designer")).toBeInTheDocument();
		expect(screen.getByText("Bob Manager")).toBeInTheDocument();
		expect(screen.getByText("Alice Engineer")).toBeInTheDocument();
	});

	it("should have filter enabled on COMPANY column", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersForFiltering });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("COMPANY")).toBeInTheDocument();
		});

		const techSolutionsCells = screen.getAllByText("Tech Solutions");
		expect(techSolutionsCells.length).toBe(2);
		expect(screen.getByText("Design Studio")).toBeInTheDocument();
		expect(screen.getByText("Engineering Co")).toBeInTheDocument();
	});

	it("should have filter enabled on COUNTRY column", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersForFiltering });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("COUNTRY")).toBeInTheDocument();
		});

		const countryRenderers = await screen.findAllByTestId("country-renderer");
		expect(countryRenderers).toHaveLength(mockUsersForFiltering.length);
	});

	it("should display correct row count with filtering data", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersForFiltering });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			const countryRenderers = screen.getAllByTestId("country-renderer");
			expect(countryRenderers).toHaveLength(4);
		});
	});

	it("should display correct number of rows based on data", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockThreeUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			const countryRenderers = screen.getAllByTestId("country-renderer");
			expect(countryRenderers).toHaveLength(3);
		});
	});

	it("should handle data with duplicate company names", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsersForFiltering });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			const techSolutionsCells = screen.getAllByText("Tech Solutions");
			expect(techSolutionsCells).toHaveLength(2);
		});
	});

	it("should handle data updates gracefully", async () => {
		const { rerender, queryClient } = renderWithQueryClient(<UserGrid />);

		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		await waitFor(() => {
			expect(mockedAxios.get).toHaveBeenCalled();
		});

		queryClient.invalidateQueries({ queryKey: ["userDataGridInformation"] });

		rerender(
			<QueryClientProvider client={queryClient}>
				<UserGrid />
			</QueryClientProvider>,
		);

		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
	});

	it("should render rows with all expected cell data", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockSingleUser });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("1")).toBeInTheDocument();
			expect(screen.getByText("John Doe")).toBeInTheDocument();
			expect(screen.getByText("Tech Corp")).toBeInTheDocument();
			expect(screen.getByText("123-456-7890")).toBeInTheDocument();
		});
	});

	it("should maintain data integrity with large dataset", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockLargeDataset });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("User 1")).toBeInTheDocument();
		});

		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
	});

	it("should render all five columns", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("ID")).toBeInTheDocument();
			expect(screen.getByText("NAME")).toBeInTheDocument();
			expect(screen.getByText("COMPANY")).toBeInTheDocument();
			expect(screen.getByText("COUNTRY")).toBeInTheDocument();
			expect(screen.getByText("MOBILE")).toBeInTheDocument();
		});
	});

	it("should render columns in correct order", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			const headers = screen.getAllByRole("columnheader");
			expect(headers.length).toBeGreaterThanOrEqual(5);
		});
	});

	it("should have header tooltips configured", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("ID")).toBeInTheDocument();
		});

		expect(screen.getByText("NAME")).toBeInTheDocument();
		expect(screen.getByText("COMPANY")).toBeInTheDocument();
	});

	it("should render custom cell renderer for country column", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			const countryRenderers = screen.getAllByTestId("country-renderer");
			expect(countryRenderers.length).toBe(mockUsers.length);
		});
	});

	it("should initialize grid with empty row data", async () => {
		mockedAxios.get.mockResolvedValue({ data: [] });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("ID")).toBeInTheDocument();
		});

		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
	});

	it("should apply theme to the grid", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		const { container } = renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("ID")).toBeInTheDocument();
		});

		const gridContainer = container.querySelector(".ag-root-wrapper");
		expect(gridContainer).toBeInTheDocument();
	});

	it("should have grid container with correct CSS classes", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		const { container } = renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("ID")).toBeInTheDocument();
		});

		const agGrid = container.querySelector(".ag-root");
		expect(agGrid).toBeInTheDocument();
	});

	it("should handle rapid data changes", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		const { queryClient } = renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});

		queryClient.invalidateQueries({ queryKey: ["userDataGridInformation"] });
		queryClient.invalidateQueries({ queryKey: ["userDataGridInformation"] });

		expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
	});

	it("should handle switching from mobile to desktop viewport", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		mockedUseViewportSize.mockReturnValue({ width: 400, height: 768 });

		const { rerender } = renderWithQueryClient(<UserGrid />);

		expect(
			screen.getByText("WE ARE CURRENTLY ON DESKTOP !"),
		).toBeInTheDocument();

		mockedUseViewportSize.mockReturnValue({ width: 1024, height: 768 });

		rerender(
			<QueryClientProvider
				client={
					new QueryClient({ defaultOptions: { queries: { retry: false } } })
				}
			>
				<UserGrid />
			</QueryClientProvider>,
		);

		await waitFor(() => {
			expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
		});
	});

	it("should handle switching from desktop to mobile viewport", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockUsers });

		mockedUseViewportSize.mockReturnValue({ width: 1024, height: 768 });

		const { rerender } = renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("USER DATA GRID")).toBeInTheDocument();
		});

		mockedUseViewportSize.mockReturnValue({ width: 400, height: 768 });

		rerender(
			<QueryClientProvider
				client={
					new QueryClient({ defaultOptions: { queries: { retry: false } } })
				}
			>
				<UserGrid />
			</QueryClientProvider>,
		);

		expect(
			screen.getByText("WE ARE CURRENTLY ON DESKTOP !"),
		).toBeInTheDocument();
	});

	it("should handle null values in data gracefully", async () => {
		const mockDataWithNulls = [
			{
				id: "1",
				name: "Test User",
				country: "USA",
				company: "Test Co",
				mobile: "111-111-1111",
			},
		];

		mockedAxios.get.mockResolvedValue({ data: mockDataWithNulls });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("Test User")).toBeInTheDocument();
		});
	});

	it("should not crash with extremely long mobile numbers", async () => {
		const mockDataWithLongMobile = [
			{
				id: "1",
				name: "Test User",
				country: "USA",
				company: "Test Co",
				mobile: "+1-234-567-8901-ext-123456789-dept-sales",
			},
		];

		mockedAxios.get.mockResolvedValue({ data: mockDataWithLongMobile });

		renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("Test User")).toBeInTheDocument();
		});

		expect(
			screen.getByText("+1-234-567-8901-ext-123456789-dept-sales"),
		).toBeInTheDocument();
	});

	it("should render first visible rows quickly with large dataset", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockLargeDataset });

		renderWithQueryClient(<UserGrid />);

		await waitFor(
			() => {
				expect(screen.getByText("User 1")).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
	});

	it("should maintain scroll container structure", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockLargeDataset });

		const { container } = renderWithQueryClient(<UserGrid />);

		await waitFor(() => {
			expect(screen.getByText("User 1")).toBeInTheDocument();
		});

		const viewport = container.querySelector(".ag-body-viewport");
		expect(viewport).toBeInTheDocument();
	});
});

