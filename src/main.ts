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

	private applyPlatformTheme() {
	const isMobile = Platform.isMobile;
	const themeName = isMobile
		? this.settings.mobileThemeName
		: this.settings.desktopThemeName;

	const defaultMode = isMobile
		? this.settings.mobileDefaultMode
		: this.settings.desktopDefaultMode;

	if (themeName === NOSWITCH) {
		this.applyDefaultMode(defaultMode);
	} else {
		this.setTheme(themeName);
	}
}

	private applyDefaultMode(mode: DefaultModeOption) {
		switch (mode) {
			case "light":
				document.body.classList.remove("theme-dark");
				document.body.classList.add("theme-light");
				break;
			case "dark":
				document.body.classList.remove("theme-light");
				document.body.classList.add("theme-dark");
				break;
			case "system":
				document.body.classList.remove("theme-light", "theme-dark");
				break;
		}
	}

	private setTheme(themeName: string) {
		if (themeName !== NOSWITCH) {
			this.app.customCss.setTheme(themeName);
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
