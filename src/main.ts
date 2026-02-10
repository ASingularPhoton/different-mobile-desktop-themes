import { Platform, Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	PlatformThemeSwitcherSettings,
	PlatformThemeSwitcherSettingTab,
	DefaultModeOption
} from "./settings";

const NOSWITCH = "Don't switch";

export default class PlatformThemeSwitcherPlugin extends Plugin {
	settings: PlatformThemeSwitcherSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(
			new PlatformThemeSwitcherSettingTab(this.app, this)
		);

		this.app.workspace.onLayoutReady(() => {
			this.applyPlatformTheme();
		});

		this.addCommand({
			id: "apply-platform-theme",
			name: "Apply platform-appropriate theme",
			callback: () => this.applyPlatformTheme()
		});
	}

	private applyPlatformTheme(): void {
		const isMobile = Platform.isMobile;

		const themeName = isMobile
			? this.settings.mobileThemeName
			: this.settings.desktopThemeName;

		const defaultMode = isMobile
			? this.settings.mobileDefaultMode
			: this.settings.desktopDefaultMode;

		if (themeName !== NOSWITCH) {
			// Apply community theme
			// @ts-ignore — internal Obsidian API
			this.app.customCss.setTheme(themeName);
		}

		this.applyDefaultMode(defaultMode);
	}

	private applyDefaultMode(mode: DefaultModeOption): void {
		switch (mode) {
			case "dark":
				// @ts-ignore — internal Obsidian API
				this.app.changeTheme("obsidian");
				break;

			case "light":
				// @ts-ignore — internal Obsidian API
				this.app.changeTheme("moonstone");
				break;

			case "system":
				// Do nothing — allow Obsidian to follow OS / user preference
				break;
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData() as Partial<PlatformThemeSwitcherSettings>
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
