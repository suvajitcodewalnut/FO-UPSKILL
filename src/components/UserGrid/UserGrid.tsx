import { useState } from "react";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridReact } from "ag-grid-react";

import type { User } from "./UserGrid.interface";
import type { ColDef } from "ag-grid-community";
import axios from "axios";
import { GridThemeQuartz } from "../../constants/GridTheme";
import CountryRenderer from "../Country/CountryRenderer";
import useViewportSize from "../../hooks/useViewportSize";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";

const UserGrid: React.FC = () => {
	const { width } = useViewportSize();

	const {
		data = [],
		isLoading,
		error,
	} = useQuery<User[]>({
		queryKey: ["userDataGridInformation"],
		queryFn: () => axios.get("/users").then((response) => response.data),
	});

	const [colDefs] = useState<ColDef<User>[]>([
		{
			headerName: "ID",
			field: "id",
			headerTooltip: "Unique identifier assigned to each user",
		},
		{
			headerName: "NAME",
			field: "name",
			filter: true,
			headerTooltip: "Full name of the user",
		},
		{
			headerName: "COMPANY",
			field: "company",
			filter: true,
			headerTooltip: "Company or organization the user is associated with",
		},
		{
			headerName: "COUNTRY",
			field: "country",
			cellRenderer: CountryRenderer,
			filter: true,
			headerTooltip: "Country where the user is located",
		},
		{
			headerName: "MOBILE",
			field: "mobile",
			headerTooltip: "User’s registered mobile phone number",
		},
	]);

	if (width < 500) {
		return (
			<div className="h-full w-full flex items-center justify-center bg-gray-700">
				<div className="text-white font-bold">
					WE ARE CURRENTLY ON DESKTOP !
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="h-full w-full flex items-center justify-center bg-gray-700">
				<div className="text-white font-bold text-xl">
					<Loader />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-full w-full flex items-center justify-center bg-gray-700">
				<div className="text-red-400 font-bold text-xl">
					Error loading data. Please try again.
				</div>
			</div>
		);
	}

	return (
		<div className="h-full w-full flex flex-col  bg-gray-700 p-4">
			<div className="mb-4 text-white font-bold text-xl">
				SIMPLE USER DATA GRID
			</div>
			<div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg">
				<AgGridReact
					theme={GridThemeQuartz}
					rowData={data}
					columnDefs={colDefs}
					className="h-full w-full"
				/>
			</div>
		</div>
	);
};

export default UserGrid;
