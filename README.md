# Logos Linker

Convert Bible references in Obsidian into Markdown links for **ref.ly**, **Logos**, and **Biblia.com**.

## ✨ Features

- Select a Bible reference (or use clipboard if none selected).
- Generates Markdown links:
  - [Ref.ly](https://ref.ly) short link with translation
  - “Open in Logos” link that deep-links into the Logos app
  - [Biblia.com](https://biblia.com) link (path-style: `/book/chapter/verse`)
- Works on desktop and mobile (no modals, just notifications).
- Customizable settings:
  - Default translation (e.g., ESV, NIV, NKJV)
  - Toggle which links to include
  - Separator between links
  - Clipboard fallback

## 📦 Installation

1. Download the [obsidian-logos-linker.zip](./obsidian-logos-linker.zip) and extract it.
2. Place the `obsidian-logos-linker` folder into your vault’s `.obsidian/plugins/` directory.
3. Open Obsidian → **Settings → Community plugins → Reload plugins**.
4. Enable **Logos Linker**.

## ⌨️ Usage

1. Select a reference like `John 3:16–18` in the editor  
   (or copy a reference to clipboard if nothing is selected).
2. Run the command palette → **Convert Bible reference to links**  
   (or assign a hotkey in **Settings → Hotkeys → Logos Linker**).
3. The reference will be replaced/inserted with something like:

```markdown
[John 3:16–18 (ESV)](https://ref.ly/John3.16-18;ESV) • [Open in Logos](https://ref.ly/logosres/esv?ref=BibleESV.John3.16-18) • [Biblia](https://biblia.com/bible/esv/john/3/16-18)
```

## ⚙️ Settings

- **Default translation**: abbreviation (ESV, NIV, etc.)
- **Include Ref.ly link**: toggle on/off
- **Include Logos link**: toggle on/off
- **Include Biblia link**: toggle on/off
- **Separator**: string between links (default: ` • `)
- **Fallback to clipboard**: if no selection is made

## 🔗 Link Formats

- **Ref.ly:** `https://ref.ly/John3.16-18;ESV`
- **Logos bridge:** `https://ref.ly/logosres/esv?ref=BibleESV.John3.16-18`
- **Biblia:** `https://biblia.com/bible/esv/john/3/16-18`

---

Made with ❤️ for faster Bible study and sermon prep.
