import { useCallback, useState, useRef } from "react";
import type { GridApi } from "ag-grid-community";


interface UseGridActionsReturn {
	gridApiRef: React.RefObject<GridApi | null>;
	quickFilterText: string;
	selectedRowCount: number;
	setQuickFilterText: (text: string) => void;
	handleGridReady: (api: GridApi) => void;
	handleSelectionChanged: () => void;
	exportToCsv: () => void;
	clearAllFilters: () => void;
	getTotalRowCount: () => number;
}


export const useGridActions = (): UseGridActionsReturn => {
	const gridApiRef = useRef<GridApi | null>(null);
	const [quickFilterText, setQuickFilterText] = useState<string>("");
	const [selectedRowCount, setSelectedRowCount] = useState<number>(0);

	const handleGridReady = useCallback((api: GridApi) => {
		gridApiRef.current = api;
	}, []);

	const handleSelectionChanged = useCallback(() => {
		if (gridApiRef.current) {
			const selectedRows = gridApiRef.current.getSelectedRows();
			setSelectedRowCount(selectedRows.length);
		}
	}, []);

	const exportToCsv = useCallback(() => {
		if (gridApiRef.current) {
			gridApiRef.current.exportDataAsCsv({
				fileName: `user-data-export-${new Date().toISOString().split("T")[0]}.csv`,
				columnSeparator: ",",
				suppressQuotes: false,
			});
		}
	}, []);

	const clearAllFilters = useCallback(() => {
		if (gridApiRef.current) {
			gridApiRef.current.setFilterModel(null);
			setQuickFilterText("");
		}
	}, []);


	const getTotalRowCount = useCallback((): number => {
		if (gridApiRef.current) {
			return gridApiRef.current.getDisplayedRowCount();
		}
		return 0;
	}, []);

	return {
		gridApiRef,
		quickFilterText,
		selectedRowCount,
		setQuickFilterText,
		handleGridReady,
		handleSelectionChanged,
		exportToCsv,
		clearAllFilters,
		getTotalRowCount,
	};
};

export default useGridActions;