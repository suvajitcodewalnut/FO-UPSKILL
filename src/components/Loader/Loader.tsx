import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";

const Loader: React.FC = () => {
	return <Ring size="40" stroke="5" bgOpacity="0" speed="1" color="white" />;
};
export default Loader;
