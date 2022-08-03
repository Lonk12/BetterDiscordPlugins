/**
 * @name MemeSounds
 * @version 0.6.1
 * @description Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!
 * @invite SsTkJAP3SE
 * @author Lonk#6942
 * @authorId 557388558017495046
 * @authorLink https://github.com/Lonk12/
 * @source https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js
 */

module.exports = (() => {
	
	/* Configuration */
	const config = {info: {name: "Meme Sounds", authors: [{name: "Lonk#6942", discord_id: "557388558017495046", github_username: "Lonk12", twitter_username: "wolfyypaw"},{name: "FlyMaster#2642", discord_id: "459726660359553025", github_username: "Apceniy"}], version: "0.5.9", description: "Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!", github: "https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js", github_raw: "https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js"}, defaultConfig: [{id: "setting", name: "Sound Settings", type: "category", collapsible: true, shown: true, settings: [{id: "LimitChan", name: "Limit to the current channel only.", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true}, {id: "delay", name: "Sound effect delay.", note: "The delay in miliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms"}, {id: "volume", name: "Sound effect volume.", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v*100) + "%"}]}], changelog: [{title: "New Stuff", items: ["Added the vine boom sound effect when :moyai: is sent into chat.", "Thanks to Orangenal name#9280 for adding vine boom!"]}]};

	/* Library Stuff */
	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
		load() {BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => {require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => {if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));});}});}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {

		const plugin = (Plugin, Api) => { try {
			
			/* Constants */
			const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
			const sounds = [
				{re: /no?ice/gmi, file: "noice.mp3", duration: 600},
				{re: /bazinga/gmi, file: "bazinga.mp3", duration: 550},
				{re: /oof/gmi, file: "oof.mp3", duration: 250},
				{re: /fart/gmi, file: "fart.mp3", duration: 550},
				{re: /bababooey/gmi, file: "bababooey.mp3", duration: 550},
				{re: /realize/gmi, file: "Anime_Realization_Sound.mp3", duration: 470}
				{re: /yay/gmi, file: "Fluttershy - yay.mp3", duration: 8300}
			  {re: /stop/gmi, file: "IT'S TIME TO STOP (1).mp3", duration: 8300}
				{re: /idiot/gmi, file: "Idiot_Savant-36d65c44-e262-3587-8948-974680886754.mp3", duration: 8300}
				{re: /aura/gmi, file: "Lucario_-_MAX_AURA-8b859c39-ad89-4478-a860-c2d4fd2a3db6.mp3.mp3", duration: 8300}
				{re: /bowling/gmi, file: "NIKO-623955e7-3afe-3ef9-ba79-b21846d9a5aa.mp3.mp3", duration: 8300}
			  {re: /illegal/gmi, file: "Wait. That's illegal.mp3", duration: 8300}
				{re: /brown/gmi, file: "bRoWn.mp3", duration: 8300}
				{re: /baba ?booey/gmi, file: "bababooey.mp3", duration: 8300}
			  {re: /baby man/gmi, file: "baby man.mp3", duration: 8300}
				{re: /raboot/gmi, file: "belh.mp3", duration: 8300}
				{re: /bitch/gmi, file: "bitches.mp3", duration: 8300}
			  {re: /bmw/gmi, file: "bmdubya.mp3", duration: 8300}
				{re: /cock/gmi, file: "boner.mp3", duration: 8300}
				{re: /horn?m?y/gmi, file: "boom-horny.mp3", duration: 8300}
				{re: /boooo/gmi, file: "boooooo.mp3", duration: 8300}
				{re: /burp/gmi, file: "burp-eee35e79-57ca-3c4e-9843-be21e7b3f3e3.mp3", duration: 8300}
				{re: /cheese/gmi, file: "cheese.mp3", duration: 8300}
				{re: /conversation/gmi, file: "conversation.mp3", duration: 8300}
			  {re: /drama/gmi, file: "dramatic fart 2 doodoo boogaloo.mp3", duration: 8300}
				{re: /postal/gmi, file: "dude_buttsauce.mp3", duration: 8300}
				{re: /dinner/gmi, file: "elegant dinner.mp3", duration: 8300}
			  {re: /heart/gmi, file: "feast.mp3", duration: 8300}
				{re: /diarrhea/gmi, file: "hehehe diarrhea.mp3", duration: 8300}
			  {re: /pee/gmi, file: "pants.mp3", duration: 8300}
				{re: /mornin/gmi, file: "patrick fucking dies.mp3", duration: 8300}
				{re: /text/gmi, file: "peter text.mp3", duration: 8300}
				{re: /inflat/gmi, file: "pop.mp3", duration: 8300}
			  {re: /pussy/gmi, file: "pussy-By-Tuna.mp3", duration: 8300}
				{re: /quesadilla/gmi, file: "quesadilla.mp3", duration: 8300}
				{re: /scratch/gmi, file: "scratch.mp3", duration: 8300}
				{re: /sniff/gmi, file: "sniffy.mp3", duration: 8300}
			  {re: /porn/gmi, file: "so much porn.mp3", duration: 8300}
				{re: /squeak/gmi, file: "squeak.mp3", duration: 8300}
				{re: /nasty/gmi, file: "that's nasty.mp3", duration: 8300}
				{re: /toilet/gmi, file: "toilet.mp3", duration: 8300}
			  {re: /uhh/gmi, file: "uhhhh.mp3", duration: 8300}
				{re: /sex/gmi, file: "unprotected sex.mp3", duration: 8300}
				{re: /win/gmi, file: "winning.mp3", duration: 8300}
				{re: /wtf/gmi, file: "wtf.mp3", duration: 8300}
			  {re: /ba ?dum ?tss/gmi, file: "yt1s.com - Ba Dum Tss Sound Effect.mp3", duration: 8300}
				{re: /bonk/gmi, file: "yt1s.com - Bonk Sound Effect 2.mp3", duration: 8300}
				{re: /boowomp/gmi, file: "yt1s.com - Boowomp sound effect that they play on Spongebob when something sad happens.mp3", duration: 8300}
				{re: /aneurysm/gmi, file: "yt1s.com - Brain fart .mp3", duration: 8300}
			  {re: /ace/gmi, file: "yt1s.com - Budding Spongebob.mp3", duration: 8300}
				{re: /bye/gmi, file: "yt1s.com - Bye have a beautiful time.mp3", duration: 8300}
				{re: /awooga/gmi, file: "yt1s.com - Cartoon Sound Effect Ahooga.mp3", duration: 8300}
				{re: /poke/gmi, file: "yt1s.com - Cartoon poke sound effect.mp3", duration: 8300}
			  {re: /no ?no ?no/gmi, file: "yt1s.com - Cleveland Brown No no no no NO.mp3", duration: 8300}
				{re: /aww/gmi, file: "yt1s.com - Crowd Aww Sound Effect.mp3", duration: 8300}
				{re: /gay/gmi, file: "yt1s.com - Ha gay sound effect.mp3", duration: 8300}
				{re: /i love you/gmi, file: "yt1s.com - I Love you Patrick StarSpongebob Sound Sound Effect for editing.mp3", duration: 8300}
			  {re: /ily/gmi, file: "yt1s.com - I Love you Patrick StarSpongebob Sound Sound Effect for editing.mp3", duration: 8300}
			  {re: /spaghet/gmi, file: "yt1s.com - Luigi Spaghetti Sound Effect.mp3", duration: 8300}
				{re: /nope/gmi, file: "Nope Construction Worker TF2 Gaming Sound Effect HD (1).mp3", duration: 8300}
				{re: /ok/gmi, file: "yt1s.com - Ok Sound Effect.mp3", duration: 8300}
				{re: /pingas/gmi, file: "yt1s.com - PINGAS Sound Clip.mp3", duration: 8300}
			  {re: /penis/gmi, file: "yt1s.com - PINGAS Sound Clip.mp3", duration: 8300}
			  {re: /hue/gmi, file: "yt1s.com - Patricks retarded laugh.mp3", duration: 8300}
				{re: /who cares/gmi, file: "yt1s.com - Peter Griffin Who The Hell Cares.mp3", duration: 8300}
				{re: /who the hell cares/gmi, file: "yt1s.com - Peter Griffin Who The Hell Cares.mp3", duration: 8300}
				{re: /who the fuck cares/gmi, file: "yt1s.com - Peter Griffin Who The Hell Cares.mp3", duration: 8300}
				{re: /who tf cares/gmi, file: "yt1s.com - Peter Griffin Who The Hell Cares.mp3", duration: 8300}
				{re: /naked/gmi, file: "yt1s.com - Plankton GOOD GRIEF HES NAKED.mp3", duration: 8300}
				{re: /punch/gmi, file: "yt1s.com - Punch Gaming Sound Effect HD.mp3", duration: 8300}
			  {re: /sad/gmi, file: "yt1s.com - Sad Trombone Gaming Sound Effect HD.mp3", duration: 8300}
				{re: /oops/gmi, file: "yt1s.com - Schaffrillas Oops.mp3", duration: 8300}
				{re: /sitcom/gmi, file: "yt1s.com - Sitcom Laughter 01 Sound Effect.mp3", duration: 8300}
				{re: /racist/gmi, file: "yt1s.com - THATS RACIST Gaming Sound Effect HD.mp3", duration: 8300}
			  {re: /taco/gmi, file: "yt1s.com - Taco Bell Bong SFX.mp3", duration: 8300}
				{re: /lose/gmi, file: "yt1s.com - The Price is Right Losing Horn Gaming Sound Effect.mp3", duration: 8300}
				{re: /splat/gmi, file: "yt1s.com - deltarune splat sfx.mp3", duration: 8300}
				{re: /cum/gmi, file: "yt1s.com - deltarune splat sfx.mp3", duration: 8300}
				{re: /ha ?ha/gmi, file: "yt1s.com - ha ha sound effect.mp3", duration: 8300}
			  {re: /hand/gmi, file: "yt5s.com - A NEW HAND TOUCHES THE BEACON (128 kbps).mp3", duration: 8300}
				{re: /monke/gmi, file: "yt5s.com - Angry Monkey - Sound Effect _ ProSounds (128 kbps).mp3", duration: 8300}
				{re: /beans/gmi, file: "yt5s.com - Beans wtf_ (FULL VIDEO) (128 kbps).mp3", duration: 8300}
				{re: /boob/gmi, file: "yt5s.com - Boobs Sound Effect #1 (128 kbps).mp3.mp3", duration: 8300}
			  {re: /mom/gmi, file: "yt5s.com - Doin' Your Mom Sound Effect (128 kbps).mp3", duration: 8300}
				{re: /jackass/gmi, file: "yt5s.com - Donkey - Sound Effect (128 kbps).mp3", duration: 8300}
				{re: /florida/gmi, file: "yt5s.com - Dumb Florida Moron (128 kbps).mp3", duration: 8300}
				{re: /elephant/gmi, file: "yt5s.com - ELEPHANT SOUND (128 kbps).mp3", duration: 8300}
			  {re: /giraffe/gmi, file: "yt5s.com - ELEPHANT SOUND (128 kbps).mp3", duration: 8300}
			  {re: /cheat/gmi, file: "yt5s.com - GTA SA Cheat activated_Cheat deactivated (Green Screen & Sound Effect) HQ (128 kbps).mp3", duration: 8300}
				{re: /butt/gmi, file: "yt5s.com - GTA Vice City - Nice ass baby! (128 kbps).mp3", duration: 8300}
				{re: /get out/gmi, file: "yt5s.com - Get that dick weed outta my sight (128 kbps).mp3", duration: 8300}
				{re: /british/gmi, file: "yt5s.com - I'm British Cuz the schewpid Americans frew the t in the ocean (128 kbps).mp3", duration: 8300}
			  {re: /stfu/gmi, file: "yt5s.com - Loona - SHUT THE FUCK UP (128 kbps).mp3", duration: 8300}
				{re: /shut the hell up/gmi, file: "yt5s.com - Loona - SHUT THE FUCK UP (128 kbps).mp3", duration: 8300}
				{re: /shut the fuck up/gmi, file: "yt5s.com - Loona - SHUT THE FUCK UP (128 kbps).mp3", duration: 8300}
				{re: /shut up/gmi, file: "yt5s.com - Loona - SHUT THE FUCK UP (128 kbps).mp3", duration: 8300}
				{re: /moo/gmi, file: "yt5s.com - MOO - Sound Effect (128 kbps).mp3", duration: 8300}
				{re: /cow/gmi, file: "yt5s.com - MOO - Sound Effect (128 kbps).mp3", duration: 8300}
				{re: /evil/gmi, file: "yt5s.com - Mermaid man - evil (128 kbps).mp3", duration: 8300}
				{re: /oh no/gmi, file: "yt5s.com - Oh no! Anyway... (128 kbps).mp3", duration: 8300}
			  {re: /riolu/gmi, file: "yt5s.com - Pokemon Cries - #447 Riolu (128 kbps).mp3", duration: 8300}
				{re: /kidding/gmi, file: "yt5s.com - Postal Dude - You Gotta Be Fucking Kidding (128 kbps).mp3", duration: 8300}
				{re: /savage/gmi, file: "yt5s.com - Savage Roast Sound Effect (128 kbps).mp3", duration: 8300}
				{re: /money/gmi, file: "yt5s.com - That was MY money, Tommy. MY MONEY! (128 kbps).mp3", duration: 8300}
				{re: /dog/gmi, file: "yt5s.com - What the dog doin_ (sound effect) (128 kbps).mp3", duration: 8300}
				{re: /cario/gmi, file: "yt5s.com - lucario cry (128 kbps).mp3", duration: 8300}
				{re: /scrunkly/gmi, file: "yt5s.com - the skrunkly (128 kbps).mp3", duration: 8300}
				];

			/* Double message event fix */
			let lastMessageID = null;

			/* Meme Sounds Class */
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
					if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId())
						return;

					if (!optimistic && lastMessageID != message.id) {
						lastMessageID = message.id;
						let queue = new Map();
						for (let sound of sounds) {
							for (let match of message.content.matchAll(sound.re))
								queue.set(match.index, sound);
						}
						for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
							let audio = new Audio("https://github.com/Jaycario/BetterDiscordPlugins/tree/main/MemeSounds/Sounds"+sound[1].file);
							audio.volume = this.settings.setting.volume;
							audio.play();
							await new Promise(r => setTimeout(r, sound[1].duration+this.settings.setting.delay));
						}
					}
					
				};
				
				onStop() {
					Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
				}
			}
		} catch (e) { console.error(e); }};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
