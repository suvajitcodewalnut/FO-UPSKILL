import { useCallback, useMemo } from "react";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridReact } from "ag-grid-react";

import type { User } from "./UserGrid.interface";
import type { ColDef, GetRowIdParams } from "ag-grid-community";
import axios from "axios";
import { GridThemeQuartz } from "../../constants/GridTheme";
import useViewportSize from "../../hooks/useViewportSize";
import { useQuery } from "@tanstack/react-query";
import { columnDefs } from "../../constants/ColDefs";


const UserGrid: React.FC = () => {
	const { width } = useViewportSize();

	const { data = [] } = useQuery<User[]>({
		queryKey: ["userDataGridInformation"],
		queryFn: () => axios.get("/users").then((response) => response.data),
	});

	const defaultColDef = useMemo<ColDef<User>>(
		() => ({
			filter: true,
			sortable: true,
			resizable: true,
		}),
		[],
	);

	const getRowId = useCallback(
		(params: GetRowIdParams<User>) => params.data.id,
		[],
	);

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
					rowData={data}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					getRowId={getRowId}
					animateRows={true}
					suppressCellFocus={true}
					rowBuffer={10}
					className="h-full w-full"
				/>
			</div>
		</div>
	);
};

export default UserGrid;
