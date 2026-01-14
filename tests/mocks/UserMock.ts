// Mock Data
export const mockUsers = [
	{
		id: "1",
		name: "John Doe",
		country: "USA",
		company: "Tech Corp",
		mobile: "123-456-7890",
	},
	{
		id: "2",
		name: "Jane Smith",
		country: "Canada",
		company: "Dev Inc",
		mobile: "098-765-4321",
	},
];

export const mockSingleUser = [mockUsers[0]];

export const mockThreeUsers = [
	...mockUsers,
	{
		id: "3",
		name: "Bob Wilson",
		country: "France",
		company: "Design Co",
		mobile: "555-123-4567",
	},
];

export const mockUsersWithSpecialChars = [
	{
		id: "1",
		name: "José García-López",
		country: "España",
		company: "Müller & Co.",
		mobile: "+49-123-456-7890",
	},
	{
		id: "2",
		name: "François O'Brien",
		country: "France",
		company: "Café Résumé Ltd.",
		mobile: "+33 (0) 1 23 45 67 89",
	},
];

export const mockUsersWithUnicode = [
	{
		id: "1",
		name: "田中太郎",
		country: "日本",
		company: "株式会社テスト",
		mobile: "090-1234-5678",
	},
	{
		id: "2",
		name: "Владимир Петров",
		country: "Россия",
		company: "ООО Тест",
		mobile: "+7-999-123-4567",
	},
];

export const mockUsersWithEmptyFields = [
	{
		id: "1",
		name: "",
		country: "USA",
		company: "",
		mobile: "123-456-7890",
	},
];

export const mockUsersWithPaddedIds = [
	{
		id: "001",
		name: "Padded ID User",
		country: "USA",
		company: "Test Corp",
		mobile: "111-222-3333",
	},
	{
		id: "999",
		name: "Large ID User",
		country: "Canada",
		company: "Test Inc",
		mobile: "444-555-6666",
	},
];

export const mockUsersWithLongText = [
	{
		id: "1",
		name: "A Very Long Name That Could Potentially Cause Layout Issues In The Grid",
		country: "United States of America",
		company:
			"A Very Long Company Name That Exceeds Normal Expectations For Display",
		mobile: "+1-123-456-7890-ext-12345",
	},
];
