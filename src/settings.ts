import { App, PluginSettingTab, Setting } from "obsidian";
import PlatformThemeSwitcherPlugin from "./main";

const NOSWITCH = "Don't switch";

export interface PlatformThemeSwitcherSettings {
	mobileThemeName: string;
	desktopThemeName: string;
}

export const DEFAULT_SETTINGS: PlatformThemeSwitcherSettings = {
	mobileThemeName: NOSWITCH,
	desktopThemeName: NOSWITCH
};

export class PlatformThemeSwitcherSettingTab extends PluginSettingTab {
	plugin: PlatformThemeSwitcherPlugin;

	private readonly DEFAULT_THEME_KEY = "";
	private readonly DEFAULT_THEME_TEXT = "Default";

	constructor(app: App, plugin: PlatformThemeSwitcherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Platform-based theme switcher")
			.setHeading();

		new Setting(containerEl)
			.setName("Mobile theme")
			.setDesc("Theme to use on mobile devices.")
			.addDropdown(dropdown => {
				dropdown.addOption(NOSWITCH, NOSWITCH);

				for (const key of this.getThemes()) {
					dropdown.addOption(key, this.getThemeNames(key));
				}

				dropdown.setValue(this.plugin.settings.mobileThemeName);
				dropdown.onChange(async value => {
					this.plugin.settings.mobileThemeName = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Desktop theme")
			.setDesc("Theme to use on desktop devices.")
			.addDropdown(dropdown => {
				dropdown.addOption(NOSWITCH, NOSWITCH);

				for (const key of this.getThemes()) {
					dropdown.addOption(key, this.getThemeNames(key));
				}

				dropdown.setValue(this.plugin.settings.desktopThemeName);
				dropdown.onChange(async value => {
					this.plugin.settings.desktopThemeName = value;
					await this.plugin.saveSettings();
				});
			});
	}

	private getThemes(): string[] {
		const customCss = (this.app as any).customCss;

		return [
			this.DEFAULT_THEME_KEY,
			...Object.keys(customCss.themes),
			...customCss.oldThemes
		];
	}

	private getThemeNames(key: string): string {
		return key === this.DEFAULT_THEME_KEY
			? this.DEFAULT_THEME_TEXT
			: key;
	}
}
