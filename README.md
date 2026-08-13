# 💵 NARCOS EMPIRE

**Drug Empire Idle** — build a cartel, package product by the gram, hire an army, raid rivals, and climb the global cartel board. A fully offline-capable, dependency-free HTML5 idle game.

> ⚠️ **Disclaimer:** NARCOS EMPIRE is a **fictional idle game** made for entertainment. It is not affiliated with, endorsed by, or connected to any real cartel, criminal organization, person, or TV series. It does not promote illegal activity.

---

## 🎮 Play

Open `index.html` in any modern browser — no build step, no install, no server required.

Or host it anywhere: GitHub Pages, Netlify, Vercel, itch.io, or a USB stick.

[▶ Play now](https://github.com/dave-vrx/NARCOS)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Tap-to-package** | Tap the money brick 💵 to package product. Combos, floating weight numbers, golden cash drops |
| **16 cartel operations** | Street Corner → Corner Dealer → Grow House → Coke Kitchen → … → Narco Empire 👑 |
| **🏴 Cartel army** | Hire **10 personnel types** (Lookouts, Sicarios, Soldiers, Hitmen, Capos…) and buy **12 weapons** (Knives → War Machine 🤖) |
| **Raids (PvP)** | Live cloud stash — raid other cartels. Army power & defense decide who wins |
| **Merge mini-game** 🧪 | Classic stacking — cook product: Leaf → Bud → Joint → Pills → Vial → Ice → Brick → Cash Stack → Diamond → Empire → **Narco King** |
| **Whack-a-Cartel** 🥷 | Whack thugs before they vanish. Bosses are worth ×5 |
| **Crystal Roulette** 🎡 | Spin for 💎 crystals, jackpots and boosts |
| **Smuggling runs** 🚤 | Reel in product across zones from the Shallows to the Forbidden |
| **Contraband Pop** 🎈 | Pop floating contraband balloons before they drift away |
| **Rebuild prestige** 🗝️ | Rebuild your empire to earn **Connections** — permanent production boosts |
| **💎 Crystal shop** | Permanent boosts + 20+ brick skins |
| **Contracts** | Daily + story quests with crystals, XP and crate rewards |
| **Boss raids** | DEA Agent 🚔, Federal Raid 🚨, SWAT Team 🚓, DEA Chopper 🛩️, Rival Kingpin 🎩 |
| **Global events** | Cartel War, Cash Rain, Product Rush and more hit everyone at once |
| **Crates & collection** | 40+ collectibles, achievements, crate drops |
| **Offline earnings** | Keep packaging while you're away |
| **Global board + chat** | Live cross-player leaderboard and chat (MantleDB) |
| **PWA-ready** | Web manifest + icons for installable / standalone play |

---

## 🏴 The Cartel Tab

Your army is your endgame engine. Hire personnel to raise **Power** (raid offense), **Defense** (raid protection), and **Production** (a bonus on all product output).

```
PERSONNEL (10)                      WEAPONS (12)
Lookout 🐀          200g            Street Knives 🔪     ×1.5 power
Sicario 🥷          2,000g          Pistols 🔫           ×1.5 power
Cartel Soldier 🪖   20,000g         Bulletproof Vests 🦺 ×1.8 defense
Hitman 🔫           200kg           Machetes 🪓          ×1.5 power
Lieutenant 🎓       2,000kg         Grenades 🧨          ×1.6 power
Capo 🎖️            20,000kg         Assault Rifles 🔫    ×1.8 power
Underboss 👔        200t            Armored Cars 🚗      ×2.0 defense
Cartel Chief 🎩     2,000t          Attack Bikes 🏍️      ×1.6 power
Narco General 💂    20,000t         Attack Helicopter 🚁 ×2.0 power
Kingpin Guard 👑    200Mt           Intel Net 📡         ×1.8 power
                                    Missiles 🚀         ×2.2 power
                                    War Machine 🤖      ×3.0 power
```

Power & Defense stack with your level, Rebuild bonuses and shop perks, and feed directly into **Cartel Raids**.

---

## 🪙 Currency

| Currency | What it is |
|---|---|
| **Product** | Your main resource, measured by **weight**: grams → ounces → kilos → tons → kilotons → megatons… |
| **💎 Crystals** | Premium currency — daily rewards, achievements, contracts, cash drops, roulette, crates, bosses |
| **🗝️ Connections** | Prestige currency earned on Rebuild — permanent production boosts |

Weights auto-format: `1.5g → 12.3kg → 1.00t → 1.20kt` and beyond.

---

## 🧪 Merge chain

Cook product from street leaf to total domination:

```
🍃 Leaf → 🌿 Bud → 🔥 Joint → 💊 Pills → 🧪 Vial → 🧊 Ice
→ 🧱 Brick → 💵 Cash Stack → 💎 Diamond → 🏆 Empire → 👑 Narco King
```

Merge two identical pieces to make the next tier. Reaching the **Narco King** triggers legendary drops.

---

## 🗝️ Rebuild (prestige)

When your run plateaus, Rebuild to convert lifetime product into **Connections** — each one grants **+1% permanent production** (upgradeable). Keep your crystals, levels, cartel and collection. Aim for the top ranks:

```
Street Pusher 🐀 → Corner Boy 🥾 → Runner 🏃 → Distributor 📦
→ Local Kingpin 🎩 → Cartel Boss 👔 → Cartel King 🏝️ → Narco Prince 💎
→ Narco King 👑 → Narco Legend ⭐ → Narco Empire 🏆 → Biggest Narco on Earth 🌎
```

---

## 📦 Files

```
NARCOS/
├── index.html          # UI structure, views, modals
├── style.css           # Narcos gold/red theme
├── game.js             # Idle engine + cartel army + all core systems
├── suika.js            # Merge mini-game
├── fishing.js          # Smuggling mini-game
├── pvp.js              # Cartel raids (cloud stash)
├── leaderboard.js      # Global cartel board
├── chat.js             # Global chat
├── manifest.webmanifest# PWA manifest
├── icon-*.png          # App icons
└── fonts/              # Bundled fonts
```

Pure HTML/CSS/JS — **zero dependencies**, **zero build step**, fully client-side. Player data is saved to `localStorage` (`narcos_save`); the leaderboard, chat and raid stash sync through the free MantleDB cloud store.

---

## 🚀 Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Repo → **Settings** → **Pages** → under *Build and deployment*, select **Deploy from a branch** → branch `main`, folder `/ (root)` → **Save**.
3. Your game goes live at `https://<username>.github.io/NARCOS/`.

---

## 🛠️ Development

No toolchain required. Edit the files and refresh the browser. Save format is a versioned JSON blob (`G.save`) with forward-compatible defaults, so old saves keep working as features are added.

---

## ❤️ Credits

- Inspired by (and rebranded from) the open **SUIKAVERSE** idle engine by **Dave-VR**.
- Cloud sync powered by **MantleDB**.
- All game systems — merging physics, fishing zones, raid logic, events, bosses — ported and rethemed for NARCOS EMPIRE.

## License

Free to play, modify and share. Use at your own risk.
