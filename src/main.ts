import { Platform, Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	PlatformThemeSwitcherSettings,
	PlatformThemeSwitcherSettingTab
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
		const themeName = Platform.isMobile
			? this.settings.mobileThemeName
			: this.settings.desktopThemeName;

		this.setTheme(themeName);
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
