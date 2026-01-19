import { useState, useCallback } from "react";
import UserGrid from "./components/SimpleGrid/SimpleGrid";
import { ComplexGrid } from "./components/ComplexGrid";
import { TabSwitcher, TabId } from "./components/TabSwitcher";
import type { Tab } from "./components/TabSwitcher";

const TABS: Tab[] = [
	{ id: TabId.SIMPLE, label: "Simple" },
	{ id: TabId.COMPLEX, label: "Complex" },
];

const App: React.FC = () => {
	const [activeTab, setActiveTab] = useState<string>(TabId.SIMPLE);

	const handleTabChange = useCallback((tabId: string) => {
		setActiveTab(tabId);
	}, []);

	const renderTabContent = () => {
		switch (activeTab) {
			case TabId.SIMPLE:
				return <UserGrid />;
			case TabId.COMPLEX:
				return <ComplexGrid />;
			default:
				return <UserGrid />;
		}
	};

	return (
		<div className="h-screen w-full flex flex-col bg-gray-700">
			<div className="flex justify-center p-4 shadow-lg">
				<TabSwitcher
					tabs={TABS}
					activeTabId={activeTab}
					onTabChange={handleTabChange}
				/>
			</div>

			<div className="flex-1 overflow-hidden">{renderTabContent()}</div>
		</div>
	);
};

export default App;
