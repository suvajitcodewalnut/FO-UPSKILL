import type { TabButtonProps } from "./TabSwitcher.types";

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onClick }) => {
	const baseStyles =
		"px-6 py-3 font-semibold text-sm transition-all duration-200 rounded-full";
	const activeStyles = "bg-blue-600 text-white shadow-lg";
	const inactiveStyles =
		"bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white";

	return (
		<button
			type="button"
			onClick={() => onClick(tab.id)}
			className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
			aria-selected={isActive}
			role="tab"
		>
			{tab.label}
		</button>
	);
};

export default TabButton;
