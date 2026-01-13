import { colorSchemeDarkBlue, themeQuartz } from "ag-grid-community";

export const GridThemeQuartz = themeQuartz
	.withPart(colorSchemeDarkBlue)
	.withParams({
		wrapperBorder: false,
		headerRowBorder: true,
	});
