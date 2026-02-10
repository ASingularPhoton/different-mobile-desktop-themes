import { App, PluginSettingTab, Setting } from "obsidian";
import PlatformThemeSwitcherPlugin from "./main";

const NOSWITCH = "Don't switch";

// Options for default mode
export type DefaultModeOption = "light" | "dark" | "system";

export interface PlatformThemeSwitcherSettings {
	mobileThemeName: string;
	desktopThemeName: string;
	mobileDefaultMode: DefaultModeOption;
	desktopDefaultMode: DefaultModeOption;
}

export const DEFAULT_SETTINGS: PlatformThemeSwitcherSettings = {
	mobileThemeName: NOSWITCH,
	desktopThemeName: NOSWITCH,
	mobileDefaultMode: "system",
	desktopDefaultMode: "system"
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

		// Mobile theme
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

		// Mobile default mode
		new Setting(containerEl)
			.setName("Mobile default mode")
			.setDesc("Choose the default appearance mode for mobile.")
			.addDropdown(dropdown => {
				const options: Record<DefaultModeOption, string> = {
					light: "Light",
					dark: "Dark",
					system: "Adapt to system"
				};
				for (const [key, label] of Object.entries(options)) {
					dropdown.addOption(key, label);
				}
				dropdown.setValue(this.plugin.settings.mobileDefaultMode);
				dropdown.onChange(async value => {
					this.plugin.settings.mobileDefaultMode = value as DefaultModeOption;
					await this.plugin.saveSettings();
				});
			});

		// Desktop theme
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

		// Desktop default mode
		new Setting(containerEl)
			.setName("Desktop default mode")
			.setDesc("Choose the default appearance mode for desktop.")
			.addDropdown(dropdown => {
				const options: Record<DefaultModeOption, string> = {
					light: "Light",
					dark: "Dark",
					system: "Adapt to system"
				};
				for (const [key, label] of Object.entries(options)) {
					dropdown.addOption(key, label);
				}
				dropdown.setValue(this.plugin.settings.desktopDefaultMode);
				dropdown.onChange(async value => {
					this.plugin.settings.desktopDefaultMode = value as DefaultModeOption;
					await this.plugin.saveSettings();
				});
			});
	}

	private getThemes(): string[] {
		const customCss = this.app.customCss;
		const themes: string[] = [
			this.DEFAULT_THEME_KEY,
			...Object.keys(customCss.themes),
			...Object.keys(customCss.oldThemes)
		];
		return themes;
	}

	private getThemeNames(key: string): string {
		return key === this.DEFAULT_THEME_KEY ? this.DEFAULT_THEME_TEXT : key;
	}
}
