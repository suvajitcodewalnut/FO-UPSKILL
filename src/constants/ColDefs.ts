import type { ColDef } from "ag-grid-community";
import type { User } from "../components/UserGrid/UserGrid.interface";
import CountryRenderer from "../components/Country/CountryRenderer";

export const columnDefs: ColDef<User>[] = [
	{
		headerName: "ID",
		field: "id",
		headerTooltip: "Unique identifier assigned to each user",
	},
	{
		headerName: "NAME",
		field: "name",
		headerTooltip: "Full name of the user",
	},
	{
		headerName: "COMPANY",
		field: "company",
		headerTooltip: "Company or organization the user is associated with",
	},
	{
		headerName: "COUNTRY",
		field: "country",
		cellRenderer: CountryRenderer,
		headerTooltip: "Country where the user is located",
	},
	{
		headerName: "MOBILE",
		field: "mobile",
		headerTooltip: "User's registered mobile phone number",
	},
];
