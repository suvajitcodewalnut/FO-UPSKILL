export interface Tab {
	id: string;
	label: string;
}

export interface TabButtonProps {
	tab: Tab;
	isActive: boolean;
	onClick: (tabId: string) => void;
}

export interface TabSwitcherProps {
	tabs: Tab[];
	activeTabId: string;
	onTabChange: (tabId: string) => void;
}


export const TabId = {
	SIMPLE: "simple",
	COMPLEX: "complex",
} as const;

export type TabId = (typeof TabId)[keyof typeof TabId];
