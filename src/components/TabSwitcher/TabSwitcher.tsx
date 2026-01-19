import type { TabSwitcherProps } from "./TabSwitcher.types";
import TabButton from "./TabButton";

const TabSwitcher: React.FC<TabSwitcherProps> = ({
	tabs,
	activeTabId,
	onTabChange,
}) => {
	return (
		<div className="flex gap-2 p-1 bg-gray-600 rounded-full" role="tablist">
			{tabs.map((tab) => (
				<TabButton
					key={tab.id}
					tab={tab}
					isActive={tab.id === activeTabId}
					onClick={onTabChange}
				/>
			))}
		</div>
	);
};

export default TabSwitcher;
