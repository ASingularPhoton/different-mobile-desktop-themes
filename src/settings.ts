import {App, PluginSettingTab, Setting} from "obsidian";
import MyPlugin from "./main";

const NOSWITCH = "Don't switch";

export interface MyPluginSettings {
	mobileThemeName: string;
	desktopThemeName: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	mobileThemeName: NOSWITCH,
	desktopThemeName: NOSWITCH
}

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;
	private readonly DEFAULT_THEME_KEY = '';
	private readonly DEFAULT_THEME_TEXT = 'Default';

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Platform-based Theme Switcher'});

		new Setting(containerEl)
			.setName('Mobile theme')
			.setDesc('Theme to use on mobile devices')
			.addDropdown(async dropdown => {
				dropdown.addOption(NOSWITCH, NOSWITCH);
				for (const key of Object.values(this.getThemes())) {
					dropdown.addOption(key, this.getThemeNames(key));
				}
				dropdown.setValue(this.plugin.settings.mobileThemeName);
				dropdown.onChange(async (value) => {
					this.plugin.settings.mobileThemeName = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Desktop theme')
			.setDesc('Theme to use on desktop devices')
			.addDropdown(async dropdown => {
				dropdown.addOption(NOSWITCH, NOSWITCH);
				for (const key of Object.values(this.getThemes())) {
					dropdown.addOption(key, this.getThemeNames(key));
				}
				dropdown.setValue(this.plugin.settings.desktopThemeName);
				dropdown.onChange(async (value) => {
					this.plugin.settings.desktopThemeName = value;
					await this.plugin.saveSettings();
				});
			});

	}

	private getThemes(): string[] {
		//@ts-ignore
		return [this.DEFAULT_THEME_KEY, ...Object.keys(this.app.customCss.themes), ...this.app.customCss.oldThemes];
	}

	private getThemeNames(item: string): string {
		if (item === this.DEFAULT_THEME_KEY) {
			return this.DEFAULT_THEME_TEXT;
		}
		return item;
	}
}
