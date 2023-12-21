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

module.exports = ((Plugin, Api) => {
	/* Configuration */
	const config = {
		/* Settings Panel */
		defaultConfig: [
			{
				/* Sound Settings Catagory */
				id: "GeneralSet",
				name: "General Sound",
				type: "category",
				collapsible: true,
				shown: true,
				settings: [{
					/* Limit Channel */
					id: "LimitChan",
					name: "Limit To Current Channel",
					note: "When enabled, sound effects will only play within the currently selected channel.",
					type: "switch",
					value: true
				},
				{
					/* Sound Delay */
					id: "delay",
					name: "Sound Effect Delay",
					note: "The delay in miliseconds between each sound effect.",
					type: "slider",
					value: 200,
					min: 10,
					max: 1000,
					renderValue: v => Math.round(v) + "ms"
				},
				{
					/* Sound Volume */
					id: "volume",
					name: "Sound Effect Volume",
					note: "How loud the sound effects will be.",
					type: "slider",
					value: 1,
					min: 0.01,
					max: 1,
					renderValue: v => Math.round(v * 100) + "%"
				}]
			},
			{
				/* Toggle Settings Catagory */
				id: "ToggleSet",
				name: "Toggle Sounds",
				type: "category",
				collapsible: true,
				shown: true,
				settings: [{
					id: "noice",
					name: "Noice",
					type: "switch",
					value: true
				},
				{
					id: "bazinga",
					name: "Bazinga",
					type: "switch",
					value: true
				},
				{
					id: "oof",
					name: "Oof",
					type: "switch",
					value: true
				},
				{
					id: "bruh",
					name: "Bruh",
					type: "switch",
					value: true
				},
				{
					id: "VineBoom",
					name: "Vine Boom",
					type: "switch",
					value: true
				}]
			}
		]
	};

	/* Constants */
	const Api = { DiscordModules: { Dispatcher, SelectedChannelStore } };
	const sounds = [
		{ re: /no?ice/gmi, file: "noice.mp3", duration: 600 },
		{ re: /bazinga/gmi, file: "bazinga.mp3", duration: 550 },
		{ re: /oof/gmi, file: "oof.mp3", duration: 250 },
		{ re: /bruh/gmi, file: "bruh.mp3", duration: 470 },
		{ re: /🗿/gmi, file: "vineboom.mp3", duration: 100 }
	];

	/* Double message event fix */
	let lastMessageID = null;

	/* Meme Sounds Class */
	class MemeSounds extends Plugin {
		constructor() {
			super();
			this.initialized = false
		}

		getName() {
			return "MemeSounds"
		}
		getAuthor() {
			return "Lonk1639";
		}
		getDescription() {
			return "Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so please go check him out!";
		}
		getVersion() {
			return "1.0.0";
		}

		getSettingsPanel() {
			return this.buildSettingsPanel().getElement();
		}

		onStart() {
			Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
		}

		messageEvent = async ({ channelId, message, optimistic }) => {
			if (this.settings.GeneralSet.LimitChan && channelId != SelectedChannelStore.getChannelId()) {
				return;
			}
			if (!optimistic && lastMessageID != message.id) {
				lastMessageID = message.id;
				let queue = new Map();

				for (let sound of sounds) {
					for (let match of message.content.matchAll(sound.re)) {
						queue.set(match.index, sound);
					}
				}
				for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
					if (this.settings.ToggleSet[sound[1].file.replace(/\..+$/, "")]) {
						let audio = new Audio("https://github.com/Lonk12/BetterDiscordPlugins/raw/main/MemeSounds/Sounds/" + sound[1].file);
						audio.volume = this.settings.GeneralSet.volume;
						audio.play();
						await new Promise(r => setTimeout(r, sound[1].duration + this.settings.GeneralSet.delay));
					}
				}
			}
		};
		onStop() {
			Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
		};

		initialize() {
			this.initialied = true;
		}
	}
})();
