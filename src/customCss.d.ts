import "obsidian";

declare module "obsidian" {
	interface App {
		customCss: {
			themes: Record<string, string>;
			oldThemes: Record<string, string>;
			setTheme: (name: string) => void;
		};
	}
}
