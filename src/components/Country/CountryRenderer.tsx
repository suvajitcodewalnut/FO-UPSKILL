import { memo } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";

const CountryRenderer = memo(
	(props: CustomCellRendererProps) => {
		return (
			<span>
				<i className={`fi fi-${props.value.flag}`}></i> {props.value.name}
			</span>
		);
	},
	(prevProps, nextProps) =>
		prevProps.value?.flag === nextProps.value?.flag &&
		prevProps.value?.name === nextProps.value?.name,
);

export default CountryRenderer;
