import { Platform, Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	PlatformThemeSwitcherSettings,
	PlatformThemeSwitcherSettingTab,
	DefaultModeOption
} from "./settings";

const NOSWITCH = "Don't switch";

/**
 * Minimal internal interface for Obsidian APIs
 * not exposed in public typings.
 */
interface ObsidianAppInternal {
	changeTheme(theme: "obsidian" | "moonstone"): void;
}

export default class PlatformThemeSwitcherPlugin extends Plugin {
	settings!: PlatformThemeSwitcherSettings;

	async onload(): Promise<void> {
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

		if (themeName === NOSWITCH) {
			this.applyDefaultMode(defaultMode);
			return;
		}

		this.applyThemeAndMode(themeName, defaultMode);
	}

	private applyThemeAndMode(
		themeName: string,
		mode: DefaultModeOption
	): void {
		this.setTheme(themeName);
		this.applyDefaultMode(mode);
	}

	private applyDefaultMode(mode: DefaultModeOption): void {
		const appInternal = this.app as unknown as ObsidianAppInternal;

		switch (mode) {
			case "dark":
				appInternal.changeTheme("obsidian");
				break;

			case "light":
				appInternal.changeTheme("moonstone");
				break;

			case "system":
				// Let Obsidian follow OS / user preference
				break;
		}
	}

	private setTheme(themeName: string): void {
		if (themeName === NOSWITCH) return;

		// customCss *is* typed, so this is lint-safe
		this.app.customCss.setTheme(themeName);
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<PlatformThemeSwitcherSettings>
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
