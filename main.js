import { Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
const DEFAULT_SETTINGS = {
    translation: "ESV",
    includeRefLy: true,
    includeLogosOpen: true,
    includeBiblia: true,
    separator: " • ",
    useClipboardIfNoSelection: true
};
/** -------- Helpers -------- */
function normalizeRefForDots(refRaw) {
    return refRaw
        .trim()
        .replace(/\s+/g, " ")
        .replace(/:/g, ".")
        .replace(/\u2013|\u2014/g, "-");
}
function buildRefLy(refRaw, translation) {
    const withDots = normalizeRefForDots(refRaw).replace(/\s/g, "");
    return `https://ref.ly/${withDots};${(translation || "ESV").toUpperCase()}`;
}
function buildLogosBridge(refRaw, translation) {
    const upper = (translation || "ESV").toUpperCase();
    const lower = (translation || "ESV").toLowerCase();
    const refForLogos = normalizeRefForDots(refRaw).replace(/\s/g, "");
    return `https://ref.ly/logosres/${lower}?ref=Bible${upper}.${refForLogos}`;
}
function buildBiblia(refRaw, translation) {
    const t = (translation || "ESV").toLowerCase();
    const raw = refRaw.trim().replace(/\u2013|\u2014/g, "-");
    const m = raw.match(/^([\dI]{0,3}\s*[A-Za-z. ]+)\s+(\d+)(?::(\d+(?:-\d+)?))?$/i);
    if (m) {
        let book = m[1]
            .replace(/\./g, "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
        const chapter = m[2];
        const verses = m[3] ?? "";
        const path = verses ? `${book}/${chapter}/${verses}` : `${book}/${chapter}`;
        return `https://biblia.com/bible/${t}/${path}`;
    }
    const refDots = refRaw.trim().replace(/:/g, ".").replace(/\s+/g, " ");
    const encoded = encodeURIComponent(refDots);
    return `https://biblia.com/bible/${t}/${encoded}`;
}
function buildDisplayLabel(refRaw, translation) {
    const pretty = refRaw.trim().replace(/\s+/g, " ");
    return `${pretty} ${(translation ? `(${translation.toUpperCase()})` : "")}`.trim();
}
async function getReferenceFromEditorOrClipboard(app, editor, useClipboard) {
    const sel = editor.getSelection().trim();
    if (sel)
        return sel;
    if (useClipboard && typeof navigator !== "undefined" && "clipboard" in navigator) {
        try {
            const clip = await navigator.clipboard.readText();
            if (clip && clip.trim().length > 0)
                return clip.trim();
        }
        catch { }
    }
    return null;
}
/** -------- Plugin -------- */
export default class LogosLinkerPlugin extends Plugin {
    async onload() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        this.addCommand({
            id: "logos-linker-convert-selection",
            name: "Convert Bible reference to links",
            editorCallback: async (editor, view) => {
                const ref = await getReferenceFromEditorOrClipboard(this.app, editor, this.settings.useClipboardIfNoSelection);
                if (!ref) {
                    new Notice("Select a Bible reference (or copy one to clipboard) and run the command again.");
                    return;
                }
                const parts = [];
                const label = buildDisplayLabel(ref, this.settings.translation);
                if (this.settings.includeRefLy) {
                    parts.push(`[${label}](${buildRefLy(ref, this.settings.translation)})`);
                }
                else {
                    parts.push(`${label}`);
                }
                if (this.settings.includeLogosOpen) {
                    parts.push(`[Open in Logos](${buildLogosBridge(ref, this.settings.translation)})`);
                }
                if (this.settings.includeBiblia) {
                    parts.push(`[Biblia](${buildBiblia(ref, this.settings.translation)})`);
                }
                const line = parts.join(this.settings.separator);
                if (editor.getSelection().length > 0) {
                    editor.replaceSelection(line);
                }
                else {
                    const pos = editor.getCursor();
                    editor.replaceRange(line, pos);
                }
                new Notice("Passage links inserted.");
            }
        });
        this.addSettingTab(new LogosLinkerSettingTab(this.app, this));
    }
    onunload() { }
    async saveSettings() {
        await this.saveData(this.settings);
    }
}
class LogosLinkerSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Logos Linker Settings" });
        new Setting(containerEl)
            .setName("Default translation")
            .setDesc("Examples: ESV, NIV, NKJV, NRSV, etc.")
            .addText((t) => t
            .setPlaceholder("ESV")
            .setValue(this.plugin.settings.translation)
            .onChange(async (v) => {
            this.plugin.settings.translation = v.trim() || "ESV";
            await this.plugin.saveSettings();
        }));
        new Setting(containerEl)
            .setName("Include ref.ly link")
            .addToggle((t) => t.setValue(this.plugin.settings.includeRefLy).onChange(async (v) => {
            this.plugin.settings.includeRefLy = v;
            await this.plugin.saveSettings();
        }));
        new Setting(containerEl)
            .setName(`Include "Open in Logos" link`)
            .setDesc("Uses ref.ly’s logosres bridge to open the Logos app when available.")
            .addToggle((t) => t.setValue(this.plugin.settings.includeLogosOpen).onChange(async (v) => {
            this.plugin.settings.includeLogosOpen = v;
            await this.plugin.saveSettings();
        }));
        new Setting(containerEl)
            .setName("Include Biblia.com link")
            .addToggle((t) => t.setValue(this.plugin.settings.includeBiblia).onChange(async (v) => {
            this.plugin.settings.includeBiblia = v;
            await this.plugin.saveSettings();
        }));
        new Setting(containerEl)
            .setName("Separator")
            .setDesc("String placed between links.")
            .addText((t) => t
            .setPlaceholder(" • ")
            .setValue(this.plugin.settings.separator)
            .onChange(async (v) => {
            this.plugin.settings.separator = v;
            await this.plugin.saveSettings();
        }));
        new Setting(containerEl)
            .setName("Fallback to clipboard")
            .setDesc("If no text is selected, try to use clipboard text as the reference.")
            .addToggle((t) => t.setValue(this.plugin.settings.useClipboardIfNoSelection).onChange(async (v) => {
            this.plugin.settings.useClipboardIfNoSelection = v;
            await this.plugin.saveSettings();
        }));
    }
}
//# sourceMappingURL=main.js.map