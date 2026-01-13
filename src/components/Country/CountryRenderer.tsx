import type { CustomCellRendererProps } from "ag-grid-react";

const CountryRenderer: React.FC<CustomCellRendererProps> = (props: CustomCellRendererProps) => {
	return (
		<span>
			<i className={`fi fi-${props.value.flag}`}></i> {props.value.name}
		</span>
	);
};

export default CountryRenderer;
