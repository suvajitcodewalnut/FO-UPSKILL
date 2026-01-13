import { useEffect, useState } from "react";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridReact } from "ag-grid-react";

import type { User } from "./UserGrid.interface";
import type { ColDef } from "ag-grid-community";
import axios from "axios";
import { GridThemeQuartz } from "../../constants/GridTheme";

const UserGrid: React.FC = () => {
	const [rowData, setRowData] = useState<User[]>([]);
	const [colDefs] = useState<ColDef<User>[]>([
		{ field: "id" },
		{ field: "name", filter: true },
		{ field: "company", filter: true },
		{ field: "mobile" },
	]);

	useEffect(() => {
		axios.get("/users").then((response) => setRowData(response.data));
	}, []);

	return (
		<div className="h-screen w-full flex flex-col items-center justify-center bg-gray-700">
			<div className="mt-5 text-white font-bold text-xl">USER DATA GRID</div>
			<div className="w-210 h-190 bg-white rounded-xl shadow-lg">
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
