import { useEffect, useState } from "react";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridReact } from "ag-grid-react";

import type { User } from "./UserGrid.interface";
import type { ColDef } from "ag-grid-community";
import axios from "axios";
import { GridThemeQuartz } from "../../constants/GridTheme";
import CountryRenderer from "../Country/CountryRenderer";
import useViewportSize from "../../hooks/useViewportSize";

const UserGrid: React.FC = () => {
	const { width } = useViewportSize();

	const [rowData, setRowData] = useState<User[]>([]);
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

	useEffect(() => {
		axios.get("/users").then((response) => setRowData(response.data));
	}, []);

	if (width < 500) {
		return (
			<div className="h-screen w-full flex items-center justify-center bg-gray-700">
				<div className="text-white font-bold">
					WE ARE CURRENTLY ON DESKTOP !
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen w-full flex flex-col items-center justify-center bg-gray-700">
			<div className="mt-5 text-white font-bold text-xl">USER DATA GRID</div>
			<div className="w-255 h-190 bg-white rounded-xl shadow-lg">
				<AgGridReact
					theme={GridThemeQuartz}
					rowData={rowData}
					columnDefs={colDefs}
					className="h-full w-full"
				/>
			</div>
		</div>
	);
};

export default UserGrid;
