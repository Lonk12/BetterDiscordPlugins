/**
 * @name MemeSounds
 * @version 0.5.4
 * @description Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!
 * @invite YMqKjWEVxG
 * @author Lonk#6942
 * @authorId 557388558017495046
 * @authorLink https://github.com/Lonk12/
 * @website https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js
 * @source https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"info":{"name":"MemeSounds","authors":[{"name":"Lonk#6942","discord_id":"557388558017495046","github_username":"Lonk12","twitter_username":"wolfyypaw12"}],"version":"0.5.3","description":"Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!","github":"https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js","github_raw":"https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js"},"changelog":[{"title":"New Stuff","items":["Added automatic updates","Added changelog"]},{"title":"Bugs Squashed","type":"fixed","items":["No bugs *yet*"]},{"title":"Improvements","type":"improved","items":["Improvements to the response time"]},{"title":"On-going","type":"progress","items":["More sounds being added","Other"]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
    
	/* Constants */
	const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
	const audio = new Audio();
	const {Patcher} = Library;
	
	/* Meme Sounds Class */
    return class MemeSounds extends Plugin {

		constructor() {
			super();
		}

		getSettingsPanel() {
			return this.buildSettingsPanel().getElement();
		}

        onStart() {
            Patcher.before(Logger, "log", (t, a) => {
                a[0] = "Patched Message: Simplified some code." + a[0];
            });
        }
		
		messageEvent = async ({ channelId, message, optimistic }) => {
			if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId())
				return;

			if (!optimistic) {
				const count = (message.content.match(/no?ice/gmi) || []).length;
				
				for (let i = 0; i < count; i++) {
					this.playNice();

					await new Promise(r => setTimeout(r, this.settings.setting.delay));
				}
			}
					
		};
				
		/* Players */
		playNice() {
			audio.src = "https://github.com/Lonk12/BetterDiscordPlugins/raw/main/MemeSounds/Sounds/noice.mp3";
			audio.play();
		}

        onStop() {
            Patcher.unpatchAll();
        }
    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
