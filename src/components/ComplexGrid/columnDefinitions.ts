import type { ColDef, ValueFormatterParams } from "ag-grid-community";
import type { User } from "../SimpleGrid/SimpleGrid.types";
import CountryRenderer from "../Country/CountryRenderer";


const baseColumnProps: Partial<ColDef<User>> = {
	sortable: true,
	resizable: true,
	filter: true,
};

const idColumnDef: ColDef<User> = {
	...baseColumnProps,
	headerName: "ID",
	field: "id",
	width: 120,
	pinned: "left",
	lockPinned: true,
	filter: "agTextColumnFilter",
	headerTooltip: "Unique identifier for each user",
	checkboxSelection: true,
	headerCheckboxSelection: true,
};

const nameColumnDef: ColDef<User> = {
	...baseColumnProps,
	headerName: "Name",
	field: "name",
	minWidth: 150,
	flex: 1,
	filter: "agTextColumnFilter",
	filterParams: {
		filterOptions: [
			"contains",
			"notContains",
			"equals",
			"notEqual",
			"startsWith",
			"endsWith",
		],
		defaultOption: "contains",
	},
	headerTooltip: "Full name of the user",
	editable: true,
	cellEditor: "agTextCellEditor",
};

const companyColumnDef: ColDef<User> = {
	...baseColumnProps,
	headerName: "Company",
	field: "company",
	minWidth: 150,
	flex: 1,
	filter: "agTextColumnFilter",
	filterParams: {
		filterOptions: ["contains", "equals", "startsWith"],
		defaultOption: "contains",
	},
	headerTooltip: "Company or organization affiliation",
	editable: true,
};

const countryColumnDef: ColDef<User> = {
	...baseColumnProps,
	headerName: "Country",
	field: "country",
	minWidth: 180,
	flex: 1,
	cellRenderer: CountryRenderer,
	filter: "agTextColumnFilter",
	filterParams: {
		filterOptions: ["contains", "equals"],
		defaultOption: "contains",
	},
	headerTooltip: "Country of residence",
};

const mobileColumnDef: ColDef<User> = {
	...baseColumnProps,
	headerName: "Mobile",
	field: "mobile",
	minWidth: 150,
	flex: 1,
	filter: "agTextColumnFilter",
	headerTooltip: "Contact mobile number",
	editable: true,
	valueFormatter: (params: ValueFormatterParams<User>) => {
		if (!params.value) return "";
		return params.value;
	},
};

export const getColumnDefinitions = (): ColDef<User>[] => {
	return [
		idColumnDef,
		nameColumnDef,
		companyColumnDef,
		countryColumnDef,
		mobileColumnDef,
	];
};

export const getDefaultColDef = (): ColDef<User> => ({
	sortable: true,
	filter: true,
	resizable: true,
	floatingFilter: true,
	minWidth: 100,
});
