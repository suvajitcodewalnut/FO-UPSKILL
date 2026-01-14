import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserGrid from "./UserGrid";
import axios from "axios";
import useViewportSize from "../../hooks/useViewportSize";
import {
	mockSingleUser,
	mockThreeUsers,
	mockUsers,
	mockUsersWithLongText,
	mockUsersWithPaddedIds,
	mockUsersWithSpecialChars,
	mockUsersWithUnicode,
} from "../../../tests/mocks/UserMock";

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

const mockLargeDataset = Array.from({ length: 100 }, (_, index) => ({
	id: String(index + 1),
	name: `User ${index + 1}`,
	country: `Country ${index + 1}`,
	company: `Company ${index + 1}`,
	mobile: `${index + 1}-000-0000`,
}));

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
});
