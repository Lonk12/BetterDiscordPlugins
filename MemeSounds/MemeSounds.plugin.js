/**
 * @name MemeSounds
 * @version 1.0.0
 * @description Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so please go check him out!
 * @invite SsTkJAP3SE
 * @author Lonk1639
 * @authorId 557388558017495046
 * @authorLink https://github.com/Lonk12/
 * @source https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js
 */

module.exports = (() => {
	/* Configuration */
	const config = {
		info: {
			name: "MemeSounds",
			authors: [{
				name: "Lonk1639",
				discord_id: "557388558017495046"
			}],
			version: "1.0.0",
			description: "Plays Memetastic sounds when certain words are sent in chat. This plugin was heavily inspired by Metalloriff's bruh plugin so please go check him out!",
			github: "https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js",
			github_raw: "https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js"
		},
		/* Settings */
		defaultConfig: [{
			/* General Settings */
			id: "setting",
			name: "General Sound",
			type: "category",
			collapsible: true,
			shown: false,
			settings: [
				/* Limit Channel */
				{id: "LimitChan", name: "Limit To Current Channel", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true},
				/* Sound Delay */
				{id: "delay", name: "Sound Effect Delay", note: "The delay in milliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms" },
				/* Sound Volume */
				{ id: "volume", name: "Sound Effect Volume", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v * 100) + "%" }
			]
		},
		{
			/* Toggle Sounds */
			id: "toggle",
			name: "Toggle Sounds",
			type: "category",
			collapsible: true,
			shown: false,
			settings: [
				{ id: "bazinga", name: "Bazinga", type: "switch", value: true },
				{ id: "bruh", name: "Bruh", type: "switch", value: true },
				{ id: "cheeseburger", name: "Chezburger", type: "switch", value: true },
				{ id: "hamburger", name: "Hamburger", type: "switch", value: true },
				{ id: "hello", name: "Hello", type: "switch", value: true },
				{ id: "noice", name: "Noice", type: "switch", value: true },
				{ id: "ok", name: "Ok", type: "switch", value: true },
				{ id: "okiedokie", name: "Okiedokie", type: "switch", value: true },
				{ id: "oof", name: "Oof", type: "switch", value: true },
				{ id: "vineboom", name: "Vine Boom", type: "switch", value: true },
				{ id: "vsauce", name: "Vsauce", type: "switch", value: false },
				{ id: "yahoo", name: "Yahoo!", type: "switch", value: true },
				{ id: "yippee", name: "Yippee!", type: "switch", value: true }
			]
		}],
		/* Change Log */
		changelog: [{
			title: "New Sounds!?",
			items: [
				"Mmm-chezburger from Roblox credits to **0x00sec**.",
				"Mario saying `yippee` credits to **0x00sec**.",
				"The hamburger meme.",
				"Mario saying YAHOO!, okiedokie, and hello in Mario64.",
				"Ness saying 'ok' from super smash bros.",
				"The most iconic part of 'moonmen' from basically every vsauce video.",
				"**NOTE: this plays when someone says 'what if' and is currently DISABLED by default!**"
			]
		},
		{
			title: "Bugs Squashed",
			type: "fixed",
			items: [
				"**Got off my ass.**",
				"The plugin."
			]
		},
		{
            title: "Improvements",
            type: "improved",
            items: [
				"You can now toggle individual sounds on and off! Credits to **0x00sec** on discord.",
				"Modified some sound lengths and added sound file metadata.",
                "Code readability.",
                "The plugin."
            ]
        },
        {
            title: "On-Going",
            type: "progress",
            items: [
                "Stuff is *totally* going on over here.",
                "Graduating highschool.",
				"General life.",
                "The plugin."
            ]
        }]
	};

	/* Library Stuff */
	return !global.ZeresPluginLibrary
		? class {
			constructor() {
				this._config = config;
			}
			getName() {
				return config.info.name;
			}
			getAuthor() {
				return config.info.authors.map(a => a.name).join(", ");
			}
			getDescription() {
				return config.info.description;
			}
			getVersion() {
				return config.info.version;
			}
			load() {
				BdApi.showConfirmationModal("Library Missing!", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, { confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => { require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => { if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r)); }); } });
			}
			start() { }
			stop() { }
		}
		: (([Plugin, Api]) => {
			const plugin = (Plugin, Api) => {
				try {
					const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
					const sounds = [
						{re: /bazinga/gmi, file: "bazinga.mp3", duration: 730},
						{re: /bruh/gmi, file: "bruh.mp3", duration: 365},
						{re: /cheeseburger/gmi, file: "cheeseburger.mp3", duration: 1000},
						{re: /hamburger/gmi, file: "hamburger.mp3", duration: 1000},
						{re: /hello/gmi, file: "hello.mp3", duration: 750},
						{re: /no?ice/gmi, file: "noice.mp3", duration: 800},
						{re: /ok/gmi, file: "ok.mp3", duration: 700},
						{re: /okiedokie/gmi, file: "okiedokie.mp3", duration: 907},
						{re: /oof/gmi, file: "oof.mp3", duration: 265},
						{re: /🗿/gmi, file: "vineboom.mp3", duration: 1115},
						{re: /what if/gmi, file: "vsauce.mp3", duration: 7000},
						{re: /yahoo/gmi, file: "yahoo.mp3", duration: 930},
						{re: /yip?pee/gmi, file: "yippee.mp3", duration: 1000}
					];

					let lastMessageID = null;

					return class MemeSounds extends Plugin {
						constructor() {
							super();
						}

						getSettingsPanel() {
							return this.buildSettingsPanel().getElement();
						}

						onStart() {
							Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
						}

						messageEvent = async ({ channelId, message, optimistic }) => {
							if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId()) return;

							if (!optimistic && lastMessageID != message.id) {
								lastMessageID = message.id;
								let queue = new Map();
								const allSounds = [...sounds];

								for (let sound of allSounds) {
									for (let match of message.content.matchAll(sound.re)) {
										queue.set(match.index, sound);
									}
								}

								for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
									if (this.settings.toggle[sound[1].file.replace(/\..+$/, "")]) {
										let audio = new Audio("https://github.com/Lonk12/BetterDiscordPlugins/raw/main/MemeSounds/Sounds/" + sound[1].file);
										audio.volume = this.settings.setting.volume;
										audio.play();
										await new Promise(r => setTimeout(r, sound[1].duration + this.settings.setting.delay));
									}
								}
							}
						};
						onStop() {
							Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
						}
					};
				}
				catch (e) {
					console.error(e);
				}
			};
			return plugin(Plugin, Api);
		})(global.ZeresPluginLibrary.buildPlugin(config));
})();
