import {Platform, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab} from "./settings";

const NOSWITCH = "Don't switch";

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	private isMobileBefore: boolean;

	async onload() {
		await this.loadSettings();

		// Store initial platform state
		this.isMobileBefore = this.getIsMobile();

		// Add settings tab
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// Apply appropriate theme when Obsidian loads
		this.app.workspace.onLayoutReady(() => {
			this.applyPlatformTheme();
		});

		// Listen for platform changes (e.g., window resize, device orientation)
		this.registerEvent(
			this.app.workspace.on('css-change', () => {
				const isMobileNow = this.getIsMobile();
				if (this.isMobileBefore !== isMobileNow) {
					this.isMobileBefore = isMobileNow;
					this.applyPlatformTheme();
				}
			})
		);

		// Add a command to manually apply the theme
		this.addCommand({
			id: 'apply-platform-theme',
			name: 'Apply platform-appropriate theme',
			callback: () => {
				this.applyPlatformTheme();
			}
		});
	}

	private getIsMobile(): boolean {
		if (Platform.isMobile) {
			return true;
		}
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	private applyPlatformTheme() {
		const themeName = this.getIsMobile()
			? this.settings.mobileThemeName
			: this.settings.desktopThemeName;

		this.setTheme(themeName);
	}

	private setTheme(themeName: string) {
		if (themeName !== NOSWITCH) {
			//@ts-ignore
			this.app.customCss.setTheme(themeName);
		}
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
