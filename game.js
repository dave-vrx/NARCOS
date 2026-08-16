'use strict';
/* ============================================================
   NARCOS EMPIRE — game engine (idle core + levels, contracts,
   events, collection, crates, skins, cartel army, mini-game bridges)
   Fictional idle game
   ============================================================ */

const G = window.G = {
  save:null, buyMult:1,
  combo:0, comboUntil:0, comboMax:10, maxShown:0,
  frenzyUntil:0, tapUntil:0,
  goldenBusy:false, goldTimer:null,
  tick:0, last:Date.now(), lastSave:0,
  soundOn:true, AC:null, bldRefs:{}, achCount:-1, myRank:0,
  evt:null, evtPolled:0, clickCryCounter:0,
  bossTimer:null, bossTicker:null
};

const BUILD_VERSION='4.1.1';
const MAX_ECONOMY_VALUE=999999999999;
const MAX_PRODUCT_GRAMS=1000000000;
const STANDARD_GRAM_PRICE=80;

function $(id){ return document.getElementById(id); }

/* ---------------- data ---------------- */

const BUILDINGS=[
  {id:'vine',    name:'Street Corner',   emoji:'🌿', cost:15,    rate:0.1,  cb:0.1},
  {id:'basket',  name:'Corner Dealer',   emoji:'🧑‍💼', cost:100,   rate:1,    cb:0.5},
  {id:'truck',   name:'Grow House',      emoji:'🏡', cost:1100,  rate:8,    cb:4},
  {id:'juice',   name:'Coke Kitchen',    emoji:'🧪', cost:12000, rate:25,   cb:12},
  {id:'farm',    name:'Stash House',     emoji:'🏚️', cost:130000, rate:80,  cb:35},
  {id:'factory', name:'Refinery Lab',    emoji:'🏭', cost:1.4e6,  rate:250, cb:100},
  {id:'rocket',  name:'Smuggler Boat',   emoji:'🚤', cost:20e6,   rate:1000, cb:350},
  {id:'moon',    name:'Drug Tunnel',     emoji:'🕳️', cost:330e6,  rate:3000, cb:900},
  {id:'ship',    name:'Private Jet',     emoji:'✈️', cost:5.1e9,  rate:8000, cb:2200},
  {id:'planet',  name:'Money Laundry',   emoji:'🏦', cost:75e9,   rate:15000, cb:4000},
  {id:'galaxy',  name:'Cartel Army',     emoji:'💂', cost:1e12,   rate:30000, cb:8000},
  {id:'universe',name:'Island Empire',   emoji:'🏝️', cost:14e12,  rate:60000, cb:15000},
  {id:'time',    name:'Global Network',  emoji:'🌎', cost:2e14,   rate:120000, cb:30000},
  {id:'void',    name:'Satellite Cartel',emoji:'🛰️', cost:3e15,   rate:250000, cb:60000},
  {id:'angels',  name:'Cartel Nation',   emoji:'🏴', cost:5e16,   rate:500000, cb:120000},
  {id:'infinity',name:'Narco Empire',    emoji:'👑', cost:8e17,  rate:1000000, cb:250000}
];

const RANKS=[
  [0,'Street Pusher','🐀'],[25000,'Corner Boy','🥾'],[250000,'Runner','🏃'],
  [2500000,'Distributor','📦'],[25000000,'Local Kingpin','🎩'],[100000000,'Cartel Boss','👔'],
  [500000000,'Cartel King','🏝️'],[2500000000,'Narco Prince','💎'],[10000000000,'Narco King','👑'],
  [50000000000,'Narco Legend','⭐'],[250000000000,'Narco Empire','🏆'],[990000000000,'Biggest Narco on Earth','🌎']
];


/* ---------------- cartel army ---------------- */
const PERSONNEL=[
  {id:'p1', name:'Lookout',        emoji:'🐀', cost:200,     power:5,     def:3,   prod:0.005},
  {id:'p2', name:'Sicario',        emoji:'🥷', cost:2000,    power:25,    def:12,  prod:0.01},
  {id:'p3', name:'Cartel Soldier', emoji:'🪖', cost:20000,   power:120,   def:55,  prod:0.02},
  {id:'p4', name:'Hitman',         emoji:'🔫', cost:2e5,     power:600,   def:250, prod:0.03},
  {id:'p5', name:'Lieutenant',     emoji:'🎓', cost:2e6,     power:3000,  def:1200,prod:0.04},
  {id:'p6', name:'Capo',           emoji:'🎖️', cost:2e7,     power:15000, def:6000,prod:0.05},
  {id:'p7', name:'Underboss',      emoji:'👔', cost:2e8,     power:75000, def:3e4, prod:0.06},
  {id:'p8', name:'Cartel Chief',   emoji:'🎩', cost:2e9,     power:375000,def:1.5e5,prod:0.08},
  {id:'p9', name:'Narco General',  emoji:'💂', cost:2e10,    power:1.9e6, def:7e5, prod:0.10},
  {id:'p10',name:'Kingpin Guard',  emoji:'👑', cost:2e11,    power:9.5e6, def:3.5e6,prod:0.12}
];
const WEAPONS=[
  {id:'w1',  name:'Street Knives',     emoji:'🔪', cost:5e3,   pMult:1.5, dMult:1.1},
  {id:'w2',  name:'Pistols',           emoji:'🔫', cost:5e4,   pMult:1.5, dMult:1.1},
  {id:'w3',  name:'Bulletproof Vests', emoji:'🦺', cost:2.5e5, pMult:1.2, dMult:1.8},
  {id:'w4',  name:'Machetes',          emoji:'🪓', cost:1e6,   pMult:1.5, dMult:1.15},
  {id:'w5',  name:'Grenades',          emoji:'🧨', cost:8e6,   pMult:1.6, dMult:1.2},
  {id:'w6',  name:'Assault Rifles',    emoji:'🔫', cost:5e7,   pMult:1.8, dMult:1.3},
  {id:'w7',  name:'Armored Cars',      emoji:'🚗', cost:4e8,   pMult:1.5, dMult:2.0},
  {id:'w8',  name:'Attack Bikes',      emoji:'🏍️', cost:2e9,   pMult:1.6, dMult:1.4},
  {id:'w9',  name:'Attack Helicopter', emoji:'🚁', cost:2e10,  pMult:2.0, dMult:1.5},
  {id:'w10', name:'Cartel Intel Net',  emoji:'📡', cost:1.5e11,pMult:1.8, dMult:1.6},
  {id:'w11', name:'Missile Systems',   emoji:'🚀', cost:1e12,  pMult:2.2, dMult:1.8},
  {id:'w12', name:'Narco War Machine', emoji:'🤖', cost:1e13,  pMult:3.0, dMult:2.5}
];
const ASC_UP=[
  {id:'as1', emoji:'🌱', name:'Deep Roots',      desc:'Each connection gives +1% MORE production (stacks)', max:5,  base:5,  mult:2.1},
  {id:'as2', emoji:'⚡', name:'Syndicate Surge', desc:'+25% connections gained per rebuild',             max:5,  base:8,  mult:2.2},
  {id:'as3', emoji:'💪', name:'Cartel Growth',   desc:'+50% ALL production (per level)',          max:10, base:25, mult:1.7},
  {id:'as4', emoji:'👆', name:'Heavy Hands',     desc:'+50% tap power (per level)',                  max:10, base:15, mult:1.6},
  {id:'as5', emoji:'💤', name:'Sleep Money',     desc:'+2× offline earnings (per level)',            max:5,  base:10, mult:2},
  {id:'as6', emoji:'🍀', name:'Cash Drops',      desc:'Cash drops appear 2× more often',          max:5,  base:12, mult:2},
  {id:'as7', emoji:'🧬', name:'Starter Crew',    desc:'Start every run with 25 street corners',               max:1,  base:50, mult:1},
  {id:'as8', emoji:'🤖', name:'Auto Dealers',    desc:'+1 auto tap per second (per level)',          max:5,  base:15, mult:2},
  {id:'as9', emoji:'👑', name:'Fed Buster',      desc:'+50% boss rewards (per level)',               max:5,  base:12, mult:2},
  {id:'as10',emoji:'🎁', name:'Crate Magnet',   desc:'Crates drop 2× more often (per level)',       max:5,  base:10, mult:2},
  {id:'as11',emoji:'🌙', name:'Moonlight Runs',  desc:'+25% offline earnings (per level)',           max:5,  base:15, mult:2},
  {id:'as12',emoji:'💠', name:'Crystal Vault',   desc:'+2 💎 per rebuild (per level)',             max:10, base:25, mult:1.8},
  {id:'as13',emoji:'🐠', name:'Tide Whisperer',  desc:'+12% smuggling luck (per level)',               max:5,  base:30, mult:1.9},
  {id:'as14',emoji:'🏴‍☠️', name:'Cartel Warlord',  desc:'+20% raid power (per level)',                max:5,  base:30, mult:1.9}
];

const SHOP=[
  {id:'sh1', emoji:'🤖', name:'Street Crew',      desc:'+1 auto tap per second',             max:25, base:5,  mult:2.1},
  {id:'sh2', emoji:'💎', name:'Empire Multiplier', desc:'+50% ALL production (per level)',   max:25, base:15, mult:2.4},
  {id:'sh3', emoji:'⏳', name:'Time Machine',     desc:'+4h offline earning cap (per level)', max:6,  base:10, mult:2},
  {id:'sh4', emoji:'🍀', name:'Lucky Charm',      desc:'Cash drops 2× more often',        max:6,  base:8,  mult:2},
  {id:'sh5', emoji:'✨', name:'Golden Stash',     desc:'+50% cash drop rewards',          max:10, base:12, mult:1.8},
  {id:'sh6', emoji:'🔥', name:'Combo Boss',       desc:'Combo lasts +1s, max combo +5',      max:10, base:7,  mult:1.7},
  {id:'sh7', emoji:'📦', name:'Crate Magnet',    desc:'Crates 2× more likely to drop',      max:6,  base:10, mult:2},
  {id:'sh8', emoji:'🎯', name:'Lucky Strike',    desc:'+25% boss rewards',                  max:6,  base:12, mult:2},
  {id:'sh9', emoji:'🎡', name:'Rigged Wheel',     desc:'Roulette -1 💎 cost per level',      max:5,  base:8,  mult:2},
  {id:'sh10',emoji:'💫', name:'Product Boost',    desc:'+50% mini game product per level',    max:10, base:12, mult:1.9},
  {id:'sh11',emoji:'🎣', name:'Smuggle Master',   desc:'+8% smuggling luck per level',         max:10, base:15, mult:1.9},
  {id:'sh12',emoji:'🏴‍☠️', name:'Raider',           desc:'+25% raid power per level',          max:6,  base:18, mult:2},
  {id:'sh13',emoji:'🛡️', name:'Bodyguards',       desc:'+15% raid defense per level',        max:6,  base:15, mult:2}
];

const SKINS=[
  {id:'classic', name:'Classic Brick',  emoji:'💵', price:0,    lvl:0,  asc:0},
  {id:'golden',  name:'Golden Brick',   emoji:'🥇', price:250,  lvl:0,  asc:0},
  {id:'mint',    name:'Mint Brick',     emoji:'🍃', price:300,  lvl:5,  asc:0},
  {id:'crystal', name:'Crystal Brick',  emoji:'💎', price:500,  lvl:0,  asc:0},
  {id:'lava',    name:'Lava Brick',     emoji:'🌋', price:800,  lvl:10, asc:0},
  {id:'galaxy',  name:'Galaxy Brick',   emoji:'🌌', price:1200, lvl:20, asc:0},
  {id:'void',    name:'Void Brick',     emoji:'⚫', price:2000, lvl:30, asc:0},
  {id:'royal',   name:'Royal Brick',    emoji:'👑', price:3000, lvl:40, asc:0},
  {id:'asc',     name:'Rebuilded Brick', emoji:'⭐', price:0,    lvl:0,  asc:3},
  {id:'starbound',name:'Starbound Brick',emoji:'✨', price:0,    lvl:0,  asc:10},
  {id:'cosmic',  name:'Cosmic Brick',   emoji:'🕳️', price:0,    lvl:0,  asc:25},
  {id:'berry',   name:'Berry Brick',    emoji:'🍓', price:1500, lvl:15, asc:0},
  {id:'peach',   name:'Peach Brick',    emoji:'🍑', price:1800, lvl:22, asc:0},
  {id:'candy',   name:'Candy Brick',    emoji:'🍬', price:2500, lvl:35, asc:0},
  {id:'toxic',   name:'Toxic Brick',    emoji:'☢️', price:3500, lvl:45, asc:0},
  {id:'frost',   name:'Frost Brick',    emoji:'❄️', price:4500, lvl:55, asc:0},
  {id:'inferno', name:'Inferno Brick',  emoji:'🔥', price:6000, lvl:70, asc:0}
];

const QUESTS=[
  {id:'q_first_tap',e:'👆',n:'First Tap',d:'Tap the brick once',cry:2,xp:20,need:()=>G.save.totalClicks>=1},
  {id:'q_first_buy',e:'🧺',n:'Green Thumb',d:'Buy your first operation',cry:3,xp:30,need:()=>totalBuildings()>=1},
  {id:'q_1k',e:'📦',n:'Product Boost',d:'Package 1K lifetime product',cry:3,xp:40,need:()=>G.save.lifetimeEarned>=1e3},
  {id:'q_10k',e:'📦',n:'Big Harvest',d:'Package 10K lifetime product',cry:4,xp:50,need:()=>G.save.lifetimeEarned>=1e4},
  {id:'q_1m',e:'💎',n:'Millionaire',d:'Package 1M lifetime product',cry:8,xp:90,need:()=>G.save.lifetimeEarned>=1e6},
  {id:'q_1b',e:'🚀',n:'Billionaire',d:'Package 1B lifetime product',cry:15,xp:160,need:()=>G.save.lifetimeEarned>=1e9},
  {id:'q_10_buildings',e:'🏗️',n:'Builder',d:'Own 10 buildings',cry:5,xp:60,need:()=>totalBuildings()>=10},
  {id:'q_combo5',e:'🔥',n:'On Fire',d:'Reach a ×5 combo',cry:4,xp:40,need:()=>G.save.maxCombo>=5},
  {id:'q_golden',e:'🍀',n:'Lucky Break',d:'Click a cash drop',cry:5,xp:50,need:()=>G.save.goldenClicks>=1},
  {id:'q_suika1',e:'🧪',n:'Stack Master',d:'Play Merge once',cry:5,xp:50,need:()=>G.save.suika.games>=1},
  {id:'q_suika500',e:'🎯',n:'Merge Pro',d:'Score 500 in a Merge run',cry:8,xp:80,need:()=>G.save.suika.best>=500},
  {id:'q_suika2000',e:'🏅',n:'Merge Legend',d:'Score 2,000 in a Merge run',cry:20,xp:200,need:()=>G.save.suika.best>=2000},
  {id:'q_suika_merges',e:'🔗',n:'Merge Machine',d:'Make 500 Merge merges',cry:15,xp:150,need:()=>G.save.suika.merges>=500},
  {id:'q_suika_wm',e:'🏆',n:'Narco King',d:'Merge a Narco King in Merge',cry:15,xp:150,need:()=>G.save.suika.watermelons>=1},
  {id:'q_asc1',e:'⭐',n:'Stardust',d:'Rebuild once',cry:10,xp:100,need:()=>G.save.ascensions>=1},
  {id:'q_asc5',e:'✨',n:'Cosmic Soul',d:'Rebuild 5 times',cry:20,xp:200,need:()=>G.save.ascensions>=5},
  {id:'q_asc10',e:'🌟',n:'Ascension Pro',d:'Rebuild 10 times',cry:30,xp:300,need:()=>G.save.ascensions>=10},
  {id:'q_asc25',e:'👑',n:'Ascension Master',d:'Rebuild 25 times',cry:60,xp:600,need:()=>G.save.ascensions>=25},
  {id:'q_crate',e:'📦',n:"What's Inside?",d:'Open a crate',cry:5,xp:50,need:()=>G.save.cratesOpened>=1},
  {id:'q_whack',e:'🔨',n:'Whack It',d:'Play Whack-a-Cartel once',cry:5,xp:50,need:()=>G.save.whack.games>=1},
  {id:'q_whack500',e:'🔨',n:'Whack Master',d:'Score 500 in Whack-a-Cartel',cry:10,xp:100,need:()=>G.save.whack.best>=500},
  {id:'q_coll5',e:'🗃️',n:'Collector',d:'Find 5 collection items',cry:6,xp:60,need:()=>Object.keys(G.save.coll).length>=5},
  {id:'q_coll15',e:'🗃️',n:'Collection Pro',d:'Find 15 collection items',cry:15,xp:150,need:()=>Object.keys(G.save.coll).length>=15},
  {id:'q_coll27',e:'🏛️',n:'Completionist',d:'Find ALL collection items',cry:40,xp:400,need:()=>Object.keys(G.save.coll).length>=ITEMS.length},
  {id:'q_boss',e:'👹',n:'Boss Slayer',d:'Defeat your first boss',cry:8,xp:80,need:()=>(G.save.bossKills||0)>=1},
  {id:'q_boss5',e:'⚔️',n:'Boss Hunter',d:'Defeat 5 bosses',cry:20,xp:200,need:()=>(G.save.bossKills||0)>=5},
  {id:'q_lvl5',e:'🎓',n:'Rising Star',d:'Reach Level 5',cry:6,xp:60,need:()=>G.save.level>=5},
  {id:'q_lvl10',e:'🎓',n:'Scholar',d:'Reach Level 10',cry:10,xp:100,need:()=>G.save.level>=10},
  {id:'q_lvl25',e:'🧠',n:'Professor',d:'Reach Level 25',cry:20,xp:200,need:()=>G.save.level>=25},
  {id:'q_seed100',e:'🌱',n:'Connection Collector',d:'Hold 100 total connections',cry:15,xp:150,need:()=>G.save.totalSeeds>=100},
  {id:'q_fish1',e:'🐟',n:'First Catch',d:'Land your first haul',cry:5,xp:50,need:()=>(G.save.fish.caught||0)>=1},
  {id:'q_fish10',e:'🎣',n:'Angler',d:'Land 10 hauls',cry:8,xp:80,need:()=>(G.save.fish.caught||0)>=10},
  {id:'q_fish50',e:'🎣',n:'Fisherfolk',d:'Land 50 hauls',cry:15,xp:150,need:()=>(G.save.fish.caught||0)>=50},
  {id:'q_fish150',e:'🌊',n:'Sea Master',d:'Land 150 hauls',cry:25,xp:250,need:()=>(G.save.fish.caught||0)>=150},
  {id:'q_fish300',e:'🐋',n:'Ocean Legend',d:'Land 300 hauls',cry:40,xp:400,need:()=>(G.save.fish.caught||0)>=300},
  {id:'q_fish_coll10',e:'🗃️',n:'Explorer',d:'Discover 10 haul types',cry:6,xp:60,need:()=>Object.keys(G.save.fish.index).length>=10},
  {id:'q_fish_coll40',e:'🗃️',n:'Deep Explorer',d:'Discover 40 haul types',cry:15,xp:150,need:()=>Object.keys(G.save.fish.index).length>=40},
  {id:'q_fish_coll100',e:'🗺️',n:'Atlas of the Sea',d:'Discover 100 haul types',cry:30,xp:300,need:()=>Object.keys(G.save.fish.index).length>=100},
  {id:'q_fish_coll175',e:'📖',n:'Fish Professor',d:'Discover 175 haul types',cry:50,xp:500,need:()=>Object.keys(G.save.fish.index).length>=175},
  {id:'q_fish_collall',e:'🏆',n:'Fish Completionist',d:'Discover EVERY haul in the index',cry:80,xp:800,need:()=>Object.keys(G.save.fish.index).length>=Fishing.catalog().length},
  {id:'q_fish_royal5',e:'👑',n:'Royalty of the Deep',d:'Land 5 Royal hauls',cry:15,xp:150,need:()=>(G.save.fish.royal||0)>=5},
  {id:'q_fish_legendary',e:'✨',n:'Legendary Catch',d:'Land a legendary or mythic haul',cry:20,xp:200,need:()=>Fishing&&fishCaughtRarity(['legendary','mythic'])},
  {id:'q_fish_zone4',e:'🌌',n:'Abyssal Fisher',d:'Land a Deep zone haul',cry:25,xp:250,need:()=>fishCaughtZone(4)},
  {id:'q_fish_zone5',e:'🪐',n:'Cosmic Angler',d:'Land a Galaxy zone haul',cry:40,xp:400,need:()=>fishCaughtZone(5)},
  {id:'q_rod3',e:'🪙',n:'Copper Fisher',d:'Own the Speedboat',cry:10,xp:100,need:()=>(G.save.fish.rod||0)>=2},
  {id:'q_rod5',e:'🥇',n:'Gold Angler',d:'Own the Smuggler Trawler',cry:20,xp:200,need:()=>(G.save.fish.rod||0)>=4},
  {id:'q_rod7',e:'♾️',n:'Infinity Fisher',d:'Own the Ghost Ship',cry:60,xp:600,need:()=>(G.save.fish.rod||0)>=7},
  {id:'q_raid1',e:'🏴‍☠️',n:'Pirate',d:'Win your first raid',cry:10,xp:100,need:()=>(G.save.pvp.won||0)>=1},
  {id:'q_raid10',e:'🏴‍☠️',n:'Raider',d:'Win 10 raids',cry:20,xp:200,need:()=>(G.save.pvp.won||0)>=10},
  {id:'q_raid50',e:'⚔️',n:'Scourge of the Sea',d:'Win 50 raids',cry:50,xp:500,need:()=>(G.save.pvp.won||0)>=50},
  {id:'q_steal1k',e:'🪙',n:'Petty Thief',d:'Steal 1K product in raids',cry:10,xp:100,need:()=>(G.save.pvp.stolen||0)>=1e3},
  {id:'q_steal100k',e:'💰',n:'Buccaneer',d:'Steal 100K product in raids',cry:30,xp:300,need:()=>(G.save.pvp.stolen||0)>=1e5},
  {id:'q_steal10m',e:'👑',n:'Dread Pirate',d:'Steal 10M product in raids',cry:80,xp:800,need:()=>(G.save.pvp.stolen||0)>=1e7},
  {id:'q_balloon1',e:'🎈',n:'Pop Star',d:'Play Balloon Pop',cry:5,xp:50,need:()=>(G.save.balloon.games||0)>=1},
  {id:'q_balloon30',e:'🎈',n:'Balloon Ace',d:'Score 30 in Balloon Pop',cry:10,xp:100,need:()=>(G.save.balloon.best||0)>=30},
  {id:'q_balloon150',e:'🪙',n:'Balloon Legend',d:'Score 150 in Balloon Pop',cry:25,xp:250,need:()=>(G.save.balloon.best||0)>=150},
  {id:'q_lvl50',e:'🧠',n:'Grandmaster',d:'Reach Level 50',cry:40,xp:400,need:()=>G.save.level>=50},
  {id:'q_lvl100',e:'🌟',n:'Narco Genius',d:'Reach Level 100',cry:80,xp:800,need:()=>G.save.level>=100},
  {id:'q_evt',e:'🎉',n:'Event Star',d:'Collect a global event reward',cry:10,xp:100,need:()=>!!G.save.eventClaimed},
  {id:'q_roulette5',e:'🎡',n:'Wheel of Fate',d:'Spin the roulette 5 times',cry:10,xp:100,need:()=>(G.save.roulette.spins||0)>=5},
  {id:'q_crates50',e:'📦',n:'Crate Addict',d:'Open 50 crates',cry:20,xp:200,need:()=>G.save.cratesOpened>=50},
  {id:'q_cry100',e:'💎',n:'Crystal Star',d:'Earn 100 crystals',cry:15,xp:150,need:()=>(G.save.crystalsEarned||0)>=100},
  {id:'q_cry1k',e:'💎',n:'Crystal Empire',d:'Earn 1,000 crystals',cry:40,xp:400,need:()=>(G.save.crystalsEarned||0)>=1000},
  {id:'q_golden25',e:'🍀',n:'Gold Digger',d:'Click 25 cash drops',cry:15,xp:150,need:()=>G.save.goldenClicks>=25},
  {id:'q_golden100',e:'🥇',n:'Golden Legend',d:'Click 100 cash drops',cry:40,xp:400,need:()=>G.save.goldenClicks>=100},
  {id:'q_combo10',e:'🔥',n:'Combo Master',d:'Reach a ×10 combo',cry:10,xp:100,need:()=>G.save.maxCombo>=10},
  {id:'q_combo20',e:'🌪️',n:'Combo God',d:'Reach a ×20 combo',cry:25,xp:250,need:()=>G.save.maxCombo>=20},
  {id:'q_offline3',e:'💤',n:'Sleepy Farmer',d:'Earn product while offline 3 times',cry:10,xp:100,need:()=>(G.save.offlineEarns||0)>=3},
  {id:'q_whack2k',e:'🔨',n:'Whack Legend',d:'Score 2,000 in Whack-a-Cartel',cry:20,xp:200,need:()=>(G.save.whack.best||0)>=2000},
  {id:'q_suika4k',e:'🧪',n:'Merge Grandmaster',d:'Score 4,000 in a Merge run',cry:35,xp:350,need:()=>(G.save.suika.best||0)>=4000},
  {id:'q_merges5k',e:'🔗',n:'Merge God',d:'Make 5,000 Merge merges',cry:30,xp:300,need:()=>(G.save.suika.merges||0)>=5000},
  {id:'q_daily7',e:'📅',n:'Daily Devotee',d:'Reach a 7-day daily streak',cry:25,xp:250,need:()=>G.save.dailyStreak>=7},
  {id:'q_asc50',e:'👑',n:'Multiversal',d:'Rebuild 50 times',cry:90,xp:900,need:()=>G.save.ascensions>=50}
];

/* generated milestone quests — building ownership + lifetime ranks */
function buildGeneratedQuests(){
  BUILDINGS.forEach(b=>{
    QUESTS.push({id:'q_own_'+b.id,e:b.emoji,n:'Own a '+b.name,d:'Own 1 '+b.name,cry:2,xp:20,need:()=>(G.save.buildings[b.id]||0)>=1});
    QUESTS.push({id:'q_own10_'+b.id,e:b.emoji,n:b.name+' Row',d:'Own 10 '+b.name+'s',cry:4,xp:40,need:()=>(G.save.buildings[b.id]||0)>=10});
    QUESTS.push({id:'q_own50_'+b.id,e:b.emoji,n:b.name+' Fleet',d:'Own 50 '+b.name+'s',cry:8,xp:80,need:()=>(G.save.buildings[b.id]||0)>=50});
  });
  RANKS.forEach((r,i)=>{
    if(i===0) return;
    QUESTS.push({id:'q_rank'+i,e:r[2],n:'Reach '+r[1],d:'Reach '+fmtCash(r[0])+' net worth',cry:3+i*2,xp:30+i*20,need:()=>netWorth()>=r[0]});
  });
}

function fishCaughtZone(z){ return Object.keys(G.save.fish.index).some(id=>{ const f=Fishing.byId(id); return f&&f.zone===z; }); }
function fishCaughtRarity(rrs){ return Object.keys(G.save.fish.index).some(id=>{ const f=Fishing.byId(id); return f&&rrs.includes(f.rarity); }); }

const DQ=[
  {id:'d_tap',e:'👆',n:'Tap Happy',t:'Tap the brick',goal:100,unit:' taps'},
  {id:'d_buy',e:'🧺',n:'Buyer',t:'Buy operations',goal:5,unit:' ops'},
  {id:'d_grow',e:'📦',n:'Harvest',t:'Package product (lifetime)',goal:1e5,unit:' product'},
  {id:'d_combo',e:'🔥',n:'Combo Run',t:'Reach a combo of',goal:8,unit:''},
  {id:'d_suika',e:'🧪',n:'Product Stacker',t:'Play Merge',goal:1,unit:' time'},
  {id:'d_merge',e:'🔗',n:'Merge Master',t:'Merge product in Merge',goal:50,unit:' merges'},
  {id:'d_score',e:'🎯',n:'High Score',t:'Score in Merge',goal:1200,unit:''},
  {id:'d_crate',e:'📦',n:'Crate Hunter',t:'Open crates',goal:1,unit:' crate'},
  {id:'d_whack',e:'🔨',n:'Whacker',t:'Play Whack-a-Cartel',goal:1,unit:' time'},
  {id:'d_whackscore',e:'🔨',n:'Whack Pro',t:'Score in Whack-a-Cartel',goal:100,unit:''},
  {id:'d_golden',e:'🍀',n:'Golden Hunter',t:'Click cash drops',goal:2,unit:' drops'},
  {id:'d_boss',e:'👹',n:'Boss Buster',t:'Defeat bosses',goal:1,unit:' boss'},
  {id:'d_ascend',e:'⭐',n:'Rebuilder',t:'Rebuild',goal:1,unit:' time'},
  {id:'d_cry',e:'💎',n:'Crystal Collector',t:'Earn crystals',goal:10,unit:' 💎'},
  {id:'d_fish',e:'🐟',n:'Fisher',t:'Land hauls',goal:5,unit:' hauls'},
  {id:'d_fishking',e:'👑',n:'Royal Fisher',t:'Land Royal hauls',goal:1,unit:' hauls'},
  {id:'d_raid',e:'🏴‍☠️',n:'Pirate',t:'Win a raid',goal:1,unit:' raid'},
  {id:'d_balloon',e:'🎈',n:'Popper',t:'Play Balloon Pop',goal:1,unit:' time'}
];

const ITEMS=[
  {id:'seed',e:'🌰',n:'Street Seed',r:'common'},
  {id:'apple',e:'🍎',n:'Red Capsule',r:'common'},
  {id:'juice',e:'🥤',n:'Cut Bag',r:'common'},
  {id:'sign',e:'🪧',n:'Corner Sign',r:'common'},
  {id:'grape',e:'🍇',n:'Loose Grams',r:'common'},
  {id:'hoe',e:'⛏️',n:'Rusty Scale',r:'common'},
  {id:'helm',e:'🪖',n:'Lookout Cap',r:'common'},
  {id:'water',e:'💧',n:'Lab Solvent',r:'common'},
  {id:'shard',e:'💠',n:'Crystal Shard',r:'uncommon'},
  {id:'clover',e:'🍀',n:'Lucky Bill',r:'uncommon'},
  {id:'rind',e:'🎯',n:'Golden Wrap',r:'uncommon'},
  {id:'combo',e:'🎟️',n:'Deal Token',r:'uncommon'},
  {id:'fuel',e:'⛽',n:'Boat Fuel',r:'uncommon'},
  {id:'moonrock',e:'🪨',n:'Tunnel Rock',r:'uncommon'},
  {id:'bee',e:'🐝',n:'Cartel Bee',r:'uncommon'},
  {id:'axe',e:'🪓',n:'Raid Axe',r:'uncommon'},
  {id:'vine',e:'🍃',n:'Ancient Plant',r:'rare'},
  {id:'stardust',e:'✨',n:'Star Seed',r:'rare'},
  {id:'phoenix',e:'🔥',n:'Phoenix Brick',r:'rare'},
  {id:'pebble',e:'⏳',n:'Time Chip',r:'rare'},
  {id:'dragon',e:'🐉',n:'Dragon Brick',r:'rare'},
  {id:'jelly',e:'🫙',n:'Royal Paste',r:'rare'},
  {id:'prism',e:'🔮',n:'Crystal Prism',r:'rare'},
  {id:'dino',e:'🦖',n:'Cartel Dino',r:'rare'},
  {id:'goldwm',e:'🥇',n:'Golden Brick',r:'epic'},
  {id:'pearl',e:'🦪',n:'Galaxy Pearl',r:'epic'},
  {id:'nova',e:'🌌',n:'Frozen Brick',r:'epic'},
  {id:'ember',e:'🌋',n:'Void Ember',r:'epic'},
  {id:'rainbow',e:'🌈',n:'Rainbow Brick',r:'epic'},
  {id:'ufo',e:'👽',n:'Alien Brick',r:'epic'},
  {id:'comet',e:'☄️',n:'Comet Shard',r:'epic'},
  {id:'voidorb',e:'🫧',n:'Void Orb',r:'epic'},
  {id:'boss',e:'👑',n:'Boss Badge',r:'legendary'},
  {id:'knife',e:'🔪',n:'Cartel Blade',r:'legendary'},
  {id:'infseed',e:'♾️',n:'Infinity Seed',r:'legendary'},
  {id:'crown',e:'💎',n:'Narco God Crown',r:'legendary'},
  {id:'goddess',e:'🧚',n:'Narco Goddess',r:'legendary'},
  {id:'heart',e:'💖',n:'Crystal Heart',r:'legendary'},
  {id:'multiv',e:'🌌',n:'Empire Key',r:'mythic'},
  {id:'melonking',e:'👑',n:'Narco King Crown',r:'mythic'},
  {id:'worm',e:'🪱',n:'Bait Worm',r:'common'},
  {id:'boot',e:'🥾',n:'Old Boot',r:'common'},
  {id:'seaweed',e:'🌿',n:'Seaweed Wrap',r:'common'},
  {id:'driftwood',e:'🪵',n:'Driftwood',r:'common'},
  {id:'bucket',e:'🪣',n:'Drop Bucket',r:'common'},
  {id:'line',e:'🧵',n:'Smuggle Line',r:'uncommon'},
  {id:'hook',e:'🪝',n:'Lucky Hook',r:'uncommon'},
  {id:'bobber',e:'🔴',n:'Glowing Beacon',r:'uncommon'},
  {id:'lure',e:'🪰',n:'Fancy Lure',r:'uncommon'},
  {id:'reel',e:'🎛️',n:'Golden Reel',r:'rare'},
  {id:'tackle',e:'🧰',n:'Master Kit',r:'rare'},
  {id:'shell',e:'🐚',n:'Singing Conch',r:'rare'},
  {id:'compass',e:'🧭',n:'Tide Compass',r:'epic'},
  {id:'treasure',e:'🪙',n:'Sunken Stash',r:'epic'},
  {id:'map',e:'🗺️',n:'Cartel Map',r:'epic'},
  {id:'anchor',e:'⚓',n:'Mythic Anchor',r:'legendary'},
  {id:'flag',e:'🏴',n:'Raider Flag',r:'legendary'},
  {id:'oar',e:'🛶',n:'King Tide Oar',r:'legendary'},
  {id:'net',e:'🥅',n:'Cosmic Net',r:'mythic'},
  {id:'leviathan',e:'🐋',n:'Leviathan Tooth',r:'mythic'}
];
const RARITY={common:{w:54,v:1,c:'#a8c0ae'},uncommon:{w:25,v:3,c:'#7fe7ff'},rare:{w:12,v:8,c:'#c39bd3'},epic:{w:6,v:20,c:'#ff9de8'},legendary:{w:2,v:50,c:'#ffd24a'},mythic:{w:1,v:150,c:'#ff6b9d'}};

const EVENTS=[
  {id:'meteor',e:'⚔️',n:'Cartel War',d:'All product production ×2!'},
  {id:'crystal',e:'💎',n:'Cash Rain',d:'Extra crystals from everything!'},
  {id:'fruit',e:'🧊',n:'Product Rush',d:'Mini game rewards ×3!'},
  {id:'turbo',e:'⚡',n:'Coke Rush',d:'×5 tap power and ×2 production!'},
  {id:'gold',e:'🥇',n:'Gold Rush',d:'Cash drops every 12 seconds!'}
];

function makeUpgrades(){
  const list=[];
  BUILDINGS.forEach(b=>{
    list.push({id:'b_'+b.id+'_10',emoji:b.emoji,name:b.name+' ×2',desc:'Double '+b.name+' output',cost:Math.ceil(b.cost*25),
      need:()=>(G.save.buildings[b.id]||0)>=10, kind:'build', bld:b.id, mult:2});
    list.push({id:'b_'+b.id+'_50',emoji:b.emoji,name:b.name+' ×2 II',desc:'Double '+b.name+' output again',cost:Math.ceil(b.cost*1000),
      need:()=>(G.save.buildings[b.id]||0)>=50, kind:'build', bld:b.id, mult:2});
  });
  const clicks=[
    ['c1','🔪','Sharpened Knife','Double tap power',500,50,2],
    ['c2','⚔️','Brick Mulcher','Double tap power',5000,400,2],
    ['c3','☀️','Solar Fingers','Double tap power',50000,3000,2],
    ['c4','🌩️','Thunder Thumbs','Double tap power',500000,15000,2],
    ['c5','🌀','Vortex Touch','TRIPLE tap power',5e6,60000,3],
    ['c6','💥','Galactic Slap','TRIPLE tap power',5e8,250000,3]
  ];
  clicks.forEach(c=>list.push({id:c[0],emoji:c[1],name:c[2],desc:c[3],cost:c[4],need:()=>G.save.totalClicks>=c[5],kind:'click',mult:c[6]}));
  const globs=[
    ['g1','🧲','Product Magnet','Double ALL production',2e4,25000,2],
    ['g2','⚗️','Growth Formula','Double ALL production',2e6,250000,2],
    ['g3','🛰️','Orbital Sunshine','Double ALL production',2e8,2.5e6,2],
    ['g4','🔭','Deep Space Rays','Double ALL production',2e10,25e6,2],
    ['g5','🪐','Planetary Bounty','Double ALL production',2e12,100e6,2],
    ['g6','🌠','Supernova Harvest','Double ALL production',2e14,500e6,2],
    ['g7','🕳️','Black Hole Lab','TRIPLE ALL production',2e16,2.5e9,3],
    ['g8','👽','Alien Cartel Tech','TRIPLE ALL production',2e18,10e9,3]
  ];
  globs.forEach(g=>list.push({id:g[0],emoji:g[1],name:g[2],desc:g[3],cost:g[4],need:()=>netWorth()>=g[5],kind:'global',mult:g[6]}));
  return list;
}
const UPGRADES=makeUpgrades();

const ACH=[
  {id:'cl1',e:'👆',n:'Warm Up',d:'Tap the brick 100 times',g:1,need:()=>G.save.totalClicks>=100},
  {id:'cl2',e:'✊',n:'Getting Strong',d:'Tap 1,000 times',g:2,need:()=>G.save.totalClicks>=1e3},
  {id:'cl3',e:'🥊',n:'Brick Punching Bag',d:'Tap 10,000 times',g:3,need:()=>G.save.totalClicks>=1e4},
  {id:'cl4',e:'💥',n:'Finger Fury',d:'Tap 100,000 times',g:5,need:()=>G.save.totalClicks>=1e5},
  {id:'cl5',e:'🌋',n:'Tap Titan',d:'Tap 1,000,000 times',g:8,need:()=>G.save.totalClicks>=1e6},
  {id:'ml1',e:'📦',n:'First Package',d:'Package 10K product (lifetime)',g:1,need:()=>G.save.lifetimeEarned>=1e4},
  {id:'ml2',e:'🧪',n:'Product Millionaire',d:'Package 1M product',g:2,need:()=>G.save.lifetimeEarned>=1e6},
  {id:'ml3',e:'🚀',n:'Orbital Haul',d:'Package 1B product',g:4,need:()=>G.save.lifetimeEarned>=1e9},
  {id:'ml4',e:'🌌',n:'Global Kingpin',d:'Reach $100M net worth',g:6,need:()=>netWorth()>=1e8},
  {id:'ml5',e:'⭐',n:'Syndicate Boss',d:'Reach $250M net worth',g:10,need:()=>netWorth()>=2.5e8},
  {id:'ml6',e:'👑',n:'Narco Monarch',d:'Reach $500M net worth',g:16,need:()=>netWorth()>=5e8},
  {id:'ml7',e:'🕶️',n:'Narco Overlord',d:'Reach $900M net worth',g:25,need:()=>netWorth()>=9e8},
  {id:'bd1',e:'🧺',n:'Builder',d:'Own 10 buildings',g:1,need:()=>totalBuildings()>=10},
  {id:'bd2',e:'🏗️',n:'Construction Crew',d:'Own 50 buildings',g:2,need:()=>totalBuildings()>=50},
  {id:'bd3',e:'🏙️',n:'Cartel Metropolis',d:'Own 200 buildings',g:4,need:()=>totalBuildings()>=200},
  {id:'bd4',e:'🌐',n:'Cartel Megalopolis',d:'Own 500 buildings',g:8,need:()=>totalBuildings()>=500},
  {id:'bd5',e:'🌱',n:'Full Empire',d:'Own at least 1 of EVERY building',g:3,need:()=>BUILDINGS.every(b=>(G.save.buildings[b.id]||0)>=1)},
  {id:'bd6',e:'🏭',n:'Mega Grower',d:'Own 50 of a single building',g:3,need:()=>BUILDINGS.some(b=>(G.save.buildings[b.id]||0)>=50)},
  {id:'bd7',e:'💎',n:'Narco Tycoon',d:'Own 100 of a single building',g:5,need:()=>BUILDINGS.some(b=>(G.save.buildings[b.id]||0)>=100)},
  {id:'as1',e:'⭐',n:'Rebuilded',d:'Rebuild once',g:5,need:()=>G.save.ascensions>=1},
  {id:'as2',e:'✨',n:'Starbound',d:'Rebuild 5 times',g:8,need:()=>G.save.ascensions>=5},
  {id:'as3',e:'🌠',n:'Cosmic Soul',d:'Rebuild 20 times',g:15,need:()=>G.save.ascensions>=20},
  {id:'as4',e:'🕳️',n:'Beyond Infinity',d:'Rebuild 100 times',g:30,need:()=>G.save.ascensions>=100},
  {id:'sd1',e:'🌱',n:'Connection',d:'Hold 10 total connections',g:2,need:()=>G.save.totalSeeds>=10},
  {id:'sd2',e:'🌳',n:'Connection Bank',d:'Hold 100 total connections',g:5,need:()=>G.save.totalSeeds>=100},
  {id:'sd3',e:'🌲',n:'Connection Empire',d:'Hold 1K total connections',g:10,need:()=>G.save.totalSeeds>=1000},
  {id:'sd4',e:'🌴',n:'Connection God',d:'Hold 10K total connections',g:20,need:()=>G.save.totalSeeds>=1e4},
  {id:'gm1',e:'🍀',n:'Lucky',d:'Click a cash drop',g:1,need:()=>G.save.goldenClicks>=1},
  {id:'gm2',e:'🍀',n:'Lucky Charm',d:'Click 10 cash drops',g:3,need:()=>G.save.goldenClicks>=10},
  {id:'gm3',e:'🍀',n:'Fortune Favors',d:'Click 50 cash drops',g:8,need:()=>G.save.goldenClicks>=50},
  {id:'gm4',e:'🍀',n:'Blessed Harvest',d:'Click 100 cash drops',g:15,need:()=>G.save.goldenClicks>=100},
  {id:'co1',e:'🔥',n:'On Fire',d:'Reach a ×5 combo',g:1,need:()=>G.save.maxCombo>=5},
  {id:'co2',e:'🌪️',n:'Storm of Taps',d:'Reach a ×15 combo',g:3,need:()=>G.save.maxCombo>=15},
  {id:'co3',e:'⚡',n:'Combo Legend',d:'Reach a ×25 combo',g:8,need:()=>G.save.maxCombo>=25},
  {id:'cy1',e:'💎',n:'Crystal Seeker',d:'Hold 25 crystals',g:2,need:()=>G.save.crystals>=25},
  {id:'cy2',e:'💎',n:'Crystal Hoarder',d:'Hold 100 crystals',g:5,need:()=>G.save.crystals>=100},
  {id:'cy3',e:'💎',n:'Crystal Lord',d:'Hold 500 crystals',g:12,need:()=>G.save.crystals>=500},
  {id:'su1',e:'🧪',n:'Merge Beginner',d:'Play Merge once',g:1,need:()=>G.save.suika.games>=1},
  {id:'su2',e:'🧪',n:'Product Stacker',d:'Score 500 in Merge',g:3,need:()=>G.save.suika.best>=500},
  {id:'su3',e:'🏆',n:'Narco King',d:'Score 1,000 in Merge',g:5,need:()=>G.save.suika.best>=1000},
  {id:'su4',e:'👑',n:'Merge Grandmaster',d:'Score 2,500 in Merge',g:10,need:()=>G.save.suika.best>=2500},
  {id:'su5',e:'🔗',n:'Merge Machine',d:'Make 500 Merge merges',g:4,need:()=>G.save.suika.merges>=500},
  {id:'cr1',e:'📦',n:'Crate Opener',d:'Open a crate',g:1,need:()=>G.save.cratesOpened>=1},
  {id:'cr2',e:'📦',n:'Crate Fiend',d:'Open 25 crates',g:4,need:()=>G.save.cratesOpened>=25},
  {id:'cr3',e:'📦',n:'Crate Maniac',d:'Open 100 crates',g:10,need:()=>G.save.cratesOpened>=100},
  {id:'ck1',e:'🗃️',n:'Collector',d:'Find 5 collection items',g:2,need:()=>Object.keys(G.save.coll).length>=5},
  {id:'ck2',e:'🗃️',n:'Curator',d:'Find 15 collection items',g:5,need:()=>Object.keys(G.save.coll).length>=15},
  {id:'ck3',e:'🏛️',n:'Museum Owner',d:'Find 30 collection items',g:12,need:()=>Object.keys(G.save.coll).length>=30},
  {id:'wh1',e:'🔨',n:'Whack Starter',d:'Play Whack-a-Cartel once',g:1,need:()=>G.save.whack.games>=1},
  {id:'wh2',e:'🔨',n:'Whack Pro',d:'Score 500 in Whack-a-Cartel',g:5,need:()=>G.save.whack.best>=500},
  {id:'rl1',e:'🎡',n:'Lucky Spin',d:'Spin the roulette once',g:1,need:()=>G.save.roulette.spins>=1},
  {id:'rl2',e:'🎡',n:'Roulette Regular',d:'Spin the roulette 10 times',g:4,need:()=>G.save.roulette.spins>=10},
  {id:'rl3',e:'🎡',n:'Crystal Gambler',d:'Win a JACKPOT on the roulette',g:8,need:()=>G.save.roulette.jackpots>=1},
  {id:'bo1',e:'👹',n:'First Blood',d:'Defeat a boss',g:5,need:()=>(G.save.bossKills||0)>=1},
  {id:'bo2',e:'⚔️',n:'Boss Slayer',d:'Defeat 10 bosses',g:12,need:()=>(G.save.bossKills||0)>=10},
  {id:'bo3',e:'🐉',n:'Boss Legend',d:'Defeat 50 bosses',g:25,need:()=>(G.save.bossKills||0)>=50},
  {id:'of1',e:'💤',n:'Deep Sleeper',d:'Earn product while away',g:1,need:()=>G.save.offlineEarns>=1},
  {id:'of2',e:'💤',n:'Master Sleeper',d:'Earn product while away 10 times',g:5,need:()=>G.save.offlineEarns>=10}
];

/* ---------------- helpers ---------------- */

const SUF=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','UDc','DDc','TDc','QaDc','QiDc','SxDc','SpDc','OcDc','NoDc','Vg','UVg','DVg','TVg','QaVg','QiVg','SxVg','SpVg','OcVg','NoVg'];
function fmt(n){
  if(!isFinite(n)) return '∞';
  if(n<0) return '-'+fmt(-n);
  if(n<1000) return Math.floor(n).toString();
  const e=Math.floor(Math.log10(n));
  const i=Math.floor(e/3);
  if(i>=SUF.length) return n.toExponential(2).replace('e+','e');
  const m=n/Math.pow(10,i*3);
  return (m>=100?m.toFixed(0):m>=10?m.toFixed(1):m.toFixed(2))+SUF[i];
}

const WU=[
  {n:'g',v:1},{n:'oz',v:28.35},{n:'lb',v:453.6},{n:'kg',v:1e3},
  {n:'t',v:1e6},{n:'kt',v:1e9},{n:'Mt',v:1e12},{n:'Gt',v:1e15},
  {n:'Tt',v:1e18},{n:'Pt',v:1e21},{n:'Et',v:1e24},{n:'Zt',v:1e27},{n:'Yt',v:1e30}
];
function fmtW(n){
  if(!isFinite(n)) return '∞';
  if(n<0) return '-'+fmtW(-n);
  if(n<1){ const x=Math.floor(n*100)/100; return (x===0&&n>0?'0.01':String(x))+'g'; }
  let i=0; while(i<WU.length-1 && n>=WU[i+1].v) i++;
  const v=n/WU[i].v;
  return (v>=100?v.toFixed(0):v>=10?v.toFixed(1):v.toFixed(2))+WU[i].n;
}
window.fmtW=fmtW;
function fmtCash(n){
  n=clamp(Number(n)||0,0,MAX_ECONOMY_VALUE);
  if(n<1000) return '$'+Math.floor(n).toLocaleString();
  if(n<1e6) return '$'+(n/1e3).toFixed(n<1e4?1:0)+'K';
  if(n<1e9) return '$'+(n/1e6).toFixed(n<1e7?1:0)+'M';
  return '$'+(n/1e9).toFixed(n<1e10?2:n<1e11?1:0)+'B';
}
window.fmtCash=fmtCash;

function cashCostFromProduct(grams){ return Math.min(50000000000,Math.ceil(1200*Math.pow(Math.max(1,grams)/15,.42))); }
function marketPrice(){
  const bucket=Math.floor(Date.now()/300000);
  return Math.max(68,Math.min(92,Math.round(STANDARD_GRAM_PRICE*(1+Math.sin(bucket*2.17)*.15))));
}
function buildingAssetValue(){
  let total=0;
  for(const b of BUILDINGS){
    const n=G.save.buildings[b.id]||0, base=cashCostFromProduct(b.cost);
    if(n) total+=base*(Math.pow(1.17,n)-1)/.17*.65;
    if(total>=MAX_ECONOMY_VALUE) return MAX_ECONOMY_VALUE;
  }
  return total;
}
function otherAssetValue(){
  let total=(G.save.inv||0)*1500;
  for(const u of PERSONNEL) total+=personnelOwned(u.id)*cashCostFromProduct(u.cost)*.5;
  for(const w of WEAPONS) if(weaponOwned(w.id)) total+=cashCostFromProduct(w.cost)*.65;
  for(const item of ITEMS){ const count=G.save.coll[item.id]||0; total+=count*RARITY[item.r].v*500; }
  return Math.min(MAX_ECONOMY_VALUE,total);
}
function netWorth(){
  if(!G.save) return 0;
  const liquidation=(G.save.melons||0)*marketPrice()*.42;
  const permanent=(G.save.totalSeeds||0)*25000+(G.save.crystals||0)*500;
  return Math.min(MAX_ECONOMY_VALUE,Math.floor((G.save.cash||0)+liquidation+buildingAssetValue()+otherAssetValue()+permanent));
}
window.netWorth=netWorth;

function personnelOwned(id){ return (G.save.cartel&&G.save.cartel.p&&G.save.cartel.p[id])||0; }
function weaponOwned(id){ return !!(G.save.cartel&&G.save.cartel.w&&G.save.cartel.w.includes(id)); }
function personnelCost(u,ownedN,n){ n=n||1; return cashCostFromProduct(u.cost)*Math.pow(1.15,ownedN)*(Math.pow(1.15,n)-1)/0.15; }
function cartelPower(){
  let p=0; for(const u of PERSONNEL) p+=personnelOwned(u.id)*u.power;
  let m=1; for(const w of WEAPONS) if(weaponOwned(w.id)) m*=w.pMult;
  return Math.floor(p*m*(1+0.2*level('as14'))*(1+0.25*shopLvl('sh12')));
}
function cartelDefense(){
  let d=0; for(const u of PERSONNEL) d+=personnelOwned(u.id)*u.def;
  let m=1; for(const w of WEAPONS) if(weaponOwned(w.id)) m*=w.dMult;
  return Math.floor(d*m*(1+0.15*shopLvl('sh13')));
}
function cartelProdBonus(){
  let b=0; for(const u of PERSONNEL) b+=personnelOwned(u.id)*u.prod;
  return Math.min(b, 50);
}
function cartelSoldiers(){ return PERSONNEL.reduce((s,u)=>s+personnelOwned(u.id),0); }
window.cartelPower=cartelPower; window.cartelDefense=cartelDefense;

function fmtDur(sec){
  sec=Math.floor(sec);
  const d=Math.floor(sec/86400),h=Math.floor(sec%86400/3600),m=Math.floor(sec%3600/60),s=sec%60;
  if(d>0) return d+'d '+h+'h'; if(h>0) return h+'h '+m+'m'; if(m>0) return m+'m '+s+'s'; return s+'s';
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

/* ---------------- levels / xp ---------------- */

function xpNeed(l){ return Math.floor(120*Math.pow(l,1.8)); }
function levelMult(){ return 1+0.01*(G.save.level-1); }
function gainXp(n){
  if(!(n>0)) return;
  G.save.xp+=n;
  while(G.save.xp>=xpNeed(G.save.level)){
    G.save.xp-=xpNeed(G.save.level);
    G.save.level++;
    const rew=1+Math.floor(G.save.level/2);
    addCrystals(rew);
    toast('LEVEL UP! Now Level '+G.save.level+'! +'+rew+' 💎','🎉');
    beepAch();
  }
  refreshHud();
}
function xpPct(){
  return clamp(G.save.xp/xpNeed(G.save.level)*100,0,100);
}

/* ---------------- economy ---------------- */

function owned(id){ return G.save.upgrades.includes(id); }
function level(id){ return G.save.asc[id]||0; }
function shopLvl(id){ return G.save.shop[id]||0; }
function totalBuildings(){ return BUILDINGS.reduce((s,b)=>s+(G.save.buildings[b.id]||0),0); }
function buildingCost(b,ownedN,n){ return cashCostFromProduct(b.cost)*Math.pow(1.17,ownedN)*(Math.pow(1.17,n)-1)/0.17; }
function buildingRate(b){ return b.rate*(owned('b_'+b.id+'_10')?2:1)*(owned('b_'+b.id+'_50')?2:1); }

function perSecRaw(){
  let s=0;
  for(const b of BUILDINGS){ const n=G.save.buildings[b.id]||0; if(n) s+=n*buildingRate(b); }
  return s;
}
function clickBase(){
  let c=1;
  for(const b of BUILDINGS) c+=(G.save.buildings[b.id]||0)*b.cb;
  return c;
}
function globalMult(){
  let m=1;
  for(const u of UPGRADES) if(u.kind==='global'&&owned(u.id)) m*=u.mult;
  m*=Math.pow(1.5,level('as3'));
  m*=Math.pow(1.5,shopLvl('sh2'));
  m*=levelMult();
  return m;
}
function seedMult(){ return 1+0.005*(1+level('as1'))*G.save.totalSeeds; }
function clickMult(){
  let m=1;
  for(const u of UPGRADES) if(u.kind==='click'&&owned(u.id)) m*=u.mult;
  m*=1+0.5*level('as4');
  m*=levelMult();
  return m;
}
function clickPower(withCombo){
  const c=(G.combo>=2)?(1+0.1*(G.combo-1)):1;
  const combo=(withCombo!==false)?c:1;
  const tap=(Date.now()<G.tapUntil)?10:1;
  const evt=(G.evt&&G.evt.id==='turbo')?5:1;
  return clickBase()*clickMult()*combo*tap*evt;
}
function autoPerSec(){ return (shopLvl('sh1')+level('as8'))*clickPower(); }
function frenzyMult(){ return (Date.now()<G.frenzyUntil)?7:1; }
function eventProdMult(){ return (G.evt&&(G.evt.id==='meteor'||G.evt.id==='turbo'))?2:1; }
function effectivePerSec(){ return perSecRaw()*globalMult()*seedMult()*frenzyMult()*eventProdMult()+autoPerSec(); }
function calcSeedGain(){
  const runValue=Math.min(MAX_ECONOMY_VALUE,(G.save.runEarned||0)*STANDARD_GRAM_PRICE+(G.save.runCashEarned||0));
  return Math.min(10000,Math.floor(Math.pow(runValue/500000,.38)*(1+0.25*level('as2'))));
}
function rankInfo(){
  let i=0;
  const worth=netWorth();
  for(let r=0;r<RANKS.length;r++) if(worth>=RANKS[r][0]) i=r;
  const cur=RANKS[i],next=RANKS[i+1]||null;
  let pct=100;
  if(next){ pct=(worth-cur[0])/(next[0]-cur[0])*100; pct=Math.max(0,Math.min(100,pct)); }
  return {name:cur[1],emoji:cur[2],next:next?next[0]:null,nextName:next?next[1]:null,pct,hasNext:!!next};
}

function addMelons(n){ if(n<=0)return; const room=MAX_PRODUCT_GRAMS-G.save.melons,added=Math.max(0,Math.min(n,room)); G.save.melons+=added; G.save.runEarned=Math.min(MAX_PRODUCT_GRAMS,G.save.runEarned+added); G.save.lifetimeEarned=Math.min(MAX_PRODUCT_GRAMS,G.save.lifetimeEarned+added); }
function addCash(n,earned){ if(!(n>0)) return; G.save.cash=Math.min(MAX_ECONOMY_VALUE,(G.save.cash||0)+n); if(earned){ G.save.runCashEarned=Math.min(MAX_ECONOMY_VALUE,(G.save.runCashEarned||0)+n); G.save.lifetimeCash=Math.min(MAX_ECONOMY_VALUE,(G.save.lifetimeCash||0)+n); } }
function addCrystals(n){ if(!(n>0)) return; G.save.crystals+=n; G.save.crystalsEarned=(G.save.crystalsEarned||0)+n; }

/* ---------------- save/load ---------------- */

function defaultSave(){
  return {v:3,name:'',playerId:'',melons:0,runEarned:0,lifetimeEarned:0,cash:0,runCashEarned:0,lifetimeCash:0,buildings:{},upgrades:[],
    seeds:0,totalSeeds:0,ascensions:0,crystals:0,crystalsEarned:0,asc:{},shop:{},ach:[],
    totalClicks:0,goldenClicks:0,maxCombo:0,offlineEarns:0,notifications:[],
    lastDaily:null,dailyStreak:0,dailyClaimed:true,lastOnline:Date.now(),sound:true,
    xp:0,level:1,quests:{},dqDay:'',dqIds:[],dqProg:{},dqDone:[],dqBase:{},
    coll:{},inv:0,cratesOpened:0,skins:[],skin:'classic',
    suika:{best:0,games:0,merges:0,watermelons:0,suikaBoost:false},
    whack:{best:0,games:0},    roulette:{spins:0,wins:0,jackpots:0},
    fish:{rod:0,best:0,games:0,caught:0,royal:0,index:{}},
    balloon:{best:0,games:0},
    safe:{best:0,games:0,wins:0},wash:{best:0,games:0,busts:0},
    pvp:{raids:0,won:0,stolen:0,defended:0,lost:0,lastRaid:0},
    cartel:{p:{},w:[]},
    eventClaimed:'',lastEventEnd:0,
    boss:{id:null,name:'',emoji:'👹',hp:0,maxHp:0,nextAt:Date.now()+2400000,tier:1,kills:0,fightUntil:0}};
}
function loadGame(){
  let s=null;
  try{ const raw=localStorage.getItem('narcos_save'); if(raw) s=JSON.parse(raw);
    if(!s){ const old=localStorage.getItem('meloverse_save'); if(old){ s=JSON.parse(old); } } }catch(e){}
  G.save=Object.assign(defaultSave(),s||{});
  migrateEconomySave();
  G.save.buildings=G.save.buildings||{};
  G.save.upgrades=G.save.upgrades||[];
  G.save.asc=G.save.asc||{};
  G.save.shop=G.save.shop||{};
  G.save.ach=G.save.ach||[];
  G.save.quests=G.save.quests||{};
  G.save.dqIds=G.save.dqIds||[];
  G.save.dqProg=G.save.dqProg||{};
  G.save.dqDone=G.save.dqDone||[];
  G.save.dqBase=G.save.dqBase||{};
  G.save.coll=G.save.coll||{};
  G.save.skins=G.save.skins||[];
  G.save.skin=G.save.skin||'classic';
  G.save.suika=Object.assign({best:0,games:0,merges:0,watermelons:0,suikaBoost:false},G.save.suika||{});
  G.save.whack=Object.assign({best:0,games:0},G.save.whack||{});
  G.save.roulette=Object.assign({spins:0,wins:0,jackpots:0},G.save.roulette||{});
  G.save.fish=Object.assign({rod:0,best:0,games:0,caught:0,royal:0,index:{}},G.save.fish||{});
  G.save.balloon=Object.assign({best:0,games:0},G.save.balloon||{});
  G.save.safe=Object.assign({best:0,games:0,wins:0},G.save.safe||{});
  G.save.wash=Object.assign({best:0,games:0,busts:0},G.save.wash||{});
  G.save.pvp=Object.assign({raids:0,won:0,stolen:0,defended:0,lost:0,lastRaid:0},G.save.pvp||{});
  G.save.cartel=Object.assign({p:{},w:[]},G.save.cartel||{});
  G.save.cartel.p=G.save.cartel.p||{};
  G.save.cartel.w=G.save.cartel.w||[];
  G.save.boss=Object.assign({id:null,name:'',emoji:'👹',hp:0,maxHp:0,nextAt:Date.now()+2400000,tier:1,kills:0,fightUntil:0},G.save.boss||{});
  G.save.notifications=Array.isArray(G.save.notifications)?G.save.notifications.slice(0,30):[];
  G.save.level=G.save.level||1;
  G.save.xp=G.save.xp||0;
  G.soundOn=G.save.sound!==false;
  applySkin();
}
function migrateEconomySave(){
  if((G.save.v||2)>=3){ G.save.cash=clamp(G.save.cash||0,0,MAX_ECONOMY_VALUE); return; }
  const oldLifetime=Math.max(0,Number(G.save.lifetimeEarned)||0), peak=Math.log10(oldLifetime+1);
  G.save.cash=Math.min(MAX_ECONOMY_VALUE,Math.max(G.save.cash||0,Math.floor(Math.max(0,peak-5)*25000000)));
  G.save.melons=Math.min(MAX_PRODUCT_GRAMS,Math.max(0,Number(G.save.melons)||0),20000000+peak*1000000);
  G.save.runEarned=Math.min(MAX_PRODUCT_GRAMS,Math.max(0,Number(G.save.runEarned)||0),G.save.melons+50000000);
  G.save.lifetimeEarned=Math.min(MAX_PRODUCT_GRAMS,Math.max(G.save.runEarned,Math.min(oldLifetime,MAX_PRODUCT_GRAMS)));
  G.save.runCashEarned=0; G.save.lifetimeCash=G.save.cash; G.save.v=3;
  G.save.economyMigratedAt=Date.now();
}
function saveGame(){
  G.save.lastOnline=Date.now();
  try{ localStorage.setItem('narcos_save',JSON.stringify(G.save)); }catch(e){}
}

/* ---------------- sound ---------------- */

function ac(){ if(!G.AC){ G.AC=new (window.AudioContext||window.webkitAudioContext)(); } if(G.AC.state==='suspended') G.AC.resume(); return G.AC; }
function tone(freq,dur,type,vol,delay){
  if(!G.soundOn) return;
  try{
    const ctx=ac(),t=ctx.currentTime+(delay||0);
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type||'sine'; o.frequency.value=freq;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(vol||0.05,t+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t+dur+0.03);
  }catch(e){}
}
function beepClick(){ tone(300+Math.random()*90,0.06,'triangle',0.035); }
function beepBuy(){ tone(520,0.08,'square',0.035); tone(700,0.12,'square',0.035,0.06); }
function beepAch(){ tone(880,0.1,'sine',0.05); tone(1174,0.16,'sine',0.05,0.09); }
function beepGolden(){ tone(660,0.09,'sine',0.05); tone(880,0.09,'sine',0.05,0.08); tone(1320,0.16,'sine',0.05,0.16); }
function beepRebuild(){ tone(392,0.14,'sawtooth',0.04); tone(523,0.14,'sawtooth',0.04,0.12); tone(659,0.14,'sawtooth',0.04,0.24); tone(784,0.3,'sawtooth',0.05,0.36); }
function beepNotify(){ tone(740,0.08,'sine',0.035); tone(980,0.13,'sine',0.04,0.07); }
function toggleSound(){ G.soundOn=!G.soundOn; G.save.sound=G.soundOn; $('btnSound').textContent=G.soundOn?'🔊':'🔇'; if(G.soundOn) beepNotify(); saveGame(); }

/* ---------------- ui ---------------- */

function toast(msg,icon){
  const t=document.createElement('div'); t.className='toast';
  t.innerHTML=(icon?'<span>'+escapeHtml(icon)+'</span>':'')+'<div>'+escapeHtml(msg)+'</div><i></i>';
  $('toasts').appendChild(t);
  setTimeout(()=>{ t.classList.add('leaving'); setTimeout(()=>t.remove(),260); },4200);
  while($('toasts').children.length>4) $('toasts').firstChild.remove();
  if(G.save){
    G.save.notifications=G.save.notifications||[];
    G.save.notifications.unshift({m:String(msg),i:icon||'•',t:Date.now()}); G.save.notifications=G.save.notifications.slice(0,30);
    G.notifyUnread=(G.notifyUnread||0)+1; renderNotificationCenter();
  }
}
function notificationTime(ts){ const sec=Math.max(0,Math.floor((Date.now()-ts)/1000)); if(sec<60)return 'now'; if(sec<3600)return Math.floor(sec/60)+'m'; if(sec<86400)return Math.floor(sec/3600)+'h'; return Math.floor(sec/86400)+'d'; }
function renderNotificationCenter(){
  const list=$('notificationList'),count=$('notifyCount'); if(count) count.textContent=G.notifyUnread?Math.min(99,G.notifyUnread):''; if(!list||!G.save) return;
  const items=G.save.notifications||[]; list.innerHTML=items.length?items.map(n=>'<div class="notification-item"><span>'+escapeHtml(n.i)+'</span><div><b>'+escapeHtml(n.m)+'</b><small>'+notificationTime(n.t)+' ago</small></div></div>').join(''):'<div class="notification-empty">Your empire activity will appear here.</div>';
}
function toggleNotificationCenter(){
  const panel=$('notificationCenter'); if(!panel) return;
  panel.classList.toggle('hidden'); if(!panel.classList.contains('hidden')){ G.notifyUnread=0; renderNotificationCenter(); }
}
window.toggleNotificationCenter=toggleNotificationCenter;
function openModal(id){ $(id).classList.remove('hidden'); }
function closeModal(id){ $(id).classList.add('hidden'); }

/* ---------------- PWA install ---------------- */
let deferredInstallPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); deferredInstallPrompt=e; });
function isStandalone(){
  return (navigator.standalone===true)||(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches);
}
function showInstallHelp(){
  if(deferredInstallPrompt){
    const p=deferredInstallPrompt;
    deferredInstallPrompt=null;
    p.prompt();
    return;
  }
  openModal('veilInstall');
}
function initInstallBtn(){
  const b=$('installBtn');
  if(b&&isStandalone()) b.style.display='none';
}
function setView(v){
  document.body.dataset.view=v;
  document.querySelectorAll('#bottomNav button,#sidebar button').forEach(b=>b.classList.toggle('on',b.dataset.view===v));
  if(v==='quests'){ renderQuestTab(); renderCollection(); renderInventory(); }
  if(v==='chat'&&typeof Chat!=='undefined') Chat.onOpen();
  if(v==='grow'){ updateEventBanner(); updateEmpireMap(); }
  if(v==='board'&&typeof PVP!=='undefined') PVP.render();
  if(v!=='mini'&&typeof window.suikaPause==='function') window.suikaPause();
  window.scrollTo(0,0);
  const m=document.querySelector('main'); if(m) m.scrollTop=0;
}
function openMapRoute(view,tab){
  setView(view);
  if(view==='grow'&&tab) switchGrowTab(tab);
  if(view==='mini'&&tab) switchMiniTab(tab);
  if(view==='grow'&&tab) setTimeout(()=>scrollGameIntoView('#growTabs',18),80);
}
function updateEmpireMap(){
  if(!G.save) return;
  const sites=totalBuildings();
  const income=effectivePerSec();
  const power=Math.floor(cartelPower());
  const activeThreat=G.save.boss&&G.save.boss.id&&G.save.boss.fightUntil>Date.now();
  const incomeEl=$('mapIncome'), territoryEl=$('mapTerritory'), powerEl=$('mapPower'), threatEl=$('mapThreat');
  if(incomeEl) incomeEl.textContent=fmtW(income)+'/s';
  if(territoryEl) territoryEl.textContent=fmt(sites)+' site'+(sites===1?'':'s');
  if(powerEl) powerEl.textContent=fmt(power);
  if(threatEl){
    threatEl.textContent=activeThreat?'ACTIVE':'LOW';
    threatEl.className=activeThreat?'threat-active':'threat-low';
  }
}
window.openMapRoute=openMapRoute;
function scrollGameIntoView(sel,pad){
  const m=document.querySelector('main'); if(!m) return;
  const el=document.querySelector(sel); if(!el) return;
  const top=el.getBoundingClientRect().top-m.getBoundingClientRect().top+m.scrollTop;
  m.scrollTo({top:Math.max(0,top-(pad||10)),behavior:'smooth'});
}
window.scrollGameIntoView=scrollGameIntoView;
function switchGrowTab(t){
  document.querySelectorAll('#growTabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));
  ['farm','cartel','upgrades','market','ascend','shop'].forEach(x=>{ const el=$('tab-'+x); if(el) el.classList.toggle('on',x===t); }); if(t==='cartel') renderCartel(); if(t==='market') renderMarketplace();
}
function switchMiniTab(m){
  document.querySelectorAll('#miniTabs button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));
  ['suika','whack','roulette','fishing','balloon','safe','wash'].forEach(x=>{ const el=$('mini-'+x); if(el) el.classList.toggle('on',x===m); });
  if(m==='roulette') setTimeout(layoutRoulette,50);
  if(m==='fishing'&&typeof Fishing!=='undefined') Fishing.render();
}

function refreshHud(){
  $('hudName').textContent=G.save.name||'PLAYER';
  $('hudCrystals').textContent=fmt(G.save.crystals);
  $('hudSeeds').textContent=fmt(G.save.seeds);
  $('hudCash').textContent=fmtCash(G.save.cash||0);
  $('hudLevel').textContent='Lv'+G.save.level;
  $('hudCrateN').textContent=G.save.inv;
  const r=rankInfo();
  $('hudRankEmoji')&&($('hudRankEmoji').textContent=r.emoji);
  $('buildVersion')&&($('buildVersion').textContent='v'+BUILD_VERSION);
  updateRouletteUI();
  updateEmpireMap();
  updateFieldJobs();
}
function updateFieldJobs(){
  if(!G.save) return;
  const total=(G.save.safe&&G.save.safe.games||0)+(G.save.wash&&G.save.wash.games||0)+(G.save.fish&&G.save.fish.games||0)+(G.save.pvp&&G.save.pvp.raids||0);
  const totalEl=$('fieldJobTotal'), crateEl=$('fieldCrateStatus');
  if(totalEl) totalEl.textContent=fmt(total)+' job'+(total===1?'':'s')+' completed';
  if(crateEl) crateEl.textContent=G.save.inv?G.save.inv+' crate'+(G.save.inv===1?'':'s')+' waiting':'No crates waiting';
}

function updateComboUI(){
  const w=$('comboWrap');
  if(G.combo>=2){ w.style.opacity=1; $('comboCount').textContent='×'+G.combo; }
  else w.style.opacity=0;
}
function comboPulse(){ const w=$('comboWrap'); w.classList.add('pop'); setTimeout(()=>w.classList.remove('pop'),130); }

function updateBoostPill(){
  const p=$('boostPill'),now=Date.now();
  if(now<G.frenzyUntil){ p.style.display='block'; p.textContent='⚡ FRENZY ×7 · '+Math.ceil((G.frenzyUntil-now)/1000)+'s'; }
  else if(now<G.tapUntil){ p.style.display='block'; p.textContent='👆 TAP STORM ×10 · '+Math.ceil((G.tapUntil-now)/1000)+'s'; }
  else p.style.display='none';
}


/* ---------------- cartel tab ---------------- */
function renderCartel(){
  const wrap=$('tab-cartel'); if(!wrap) return;
  const pow=cartelPower(), def=cartelDefense(), sol=cartelSoldiers(), prod=cartelProdBonus();
  let html='<div class="ascend-note">🏴 Build your cartel — hire sicarios & arm your army. Power wins raids. Soldiers boost production.</div>';
  html+='<div class="raid-stats" style="margin-bottom:12px">';
  html+='<div class="sstat"><span>⚔️ Power</span><b>'+fmt(pow)+'</b></div>';
  html+='<div class="sstat"><span>🛡️ Defense</span><b>'+fmt(def)+'</b></div>';
  html+='<div class="sstat"><span>👥 Army</span><b>'+fmt(sol)+'</b></div>';
  html+='</div>';
  html+='<div class="ascend-note">Production bonus from army: +'+(prod*100).toFixed(1)+'%</div>';
  html+='<div class="panel-head"><h2>👥 Personnel</h2><div class="seg" id="cartelBuyToggle">';
  html+='<button data-n="1" class="'+(G.buyMult===1?'on':'')+'" onclick="setBuyMult(1);renderCartel()">×1</button>';
  html+='<button data-n="10" class="'+(G.buyMult===10?'on':'')+'" onclick="setBuyMult(10);renderCartel()">×10</button>';
  html+='<button data-n="25" class="'+(G.buyMult===25?'on':'')+'" onclick="setBuyMult(25);renderCartel()">×25</button>';
  html+='</div></div>';
  PERSONNEL.forEach(u=>{
    const ownedN=personnelOwned(u.id), n=G.buyMult;
    const cost=personnelCost(u,ownedN,n);
    const can=G.save.cash>=cost;
    html+='<div class="up-card'+(can?' afford':'')+'" onclick="buyPersonnel(\''+u.id+'\')">';
    html+='<div class="u-emoji">'+u.emoji+'</div>';
    html+='<div class="u-info"><div class="u-name">'+u.name+' <span class="u-lv">×'+fmt(ownedN)+'</span></div>';
    html+='<div class="u-desc">⚔️'+fmt(u.power)+' · 🛡️'+fmt(u.def)+' · +'+(u.prod*100)+'% prod each</div></div>';
    html+='<div class="u-cost '+(can?'':'no')+'">'+fmtCash(cost)+'</div></div>';
  });
  html+='<div class="ascend-note" style="margin-top:14px">🔫 Arsenal — one-time weapons that multiply army power</div>';
  WEAPONS.forEach(w=>{
    const has=weaponOwned(w.id);
    const weaponCost=cashCostFromProduct(w.cost), can=!has&&G.save.cash>=weaponCost;
    html+='<div class="up-card'+(has?' bought':can?' afford':'')+'" onclick="buyWeapon(\''+w.id+'\')">';
    html+='<div class="u-emoji">'+(has?'✅':w.emoji)+'</div>';
    html+='<div class="u-info"><div class="u-name">'+w.name+(has?' <span class="u-lv">OWNED</span>':'')+'</div>';
    html+='<div class="u-desc">Power ×'+w.pMult+' · Defense ×'+w.dMult+'</div></div>';
    html+='<div class="u-cost '+(can||has?'':'no')+'">'+(has?'OWNED':fmtCash(weaponCost))+'</div></div>';
  });
  wrap.innerHTML=html;
}
function buyPersonnel(id){
  const u=PERSONNEL.find(x=>x.id===id); if(!u) return;
  const ownedN=personnelOwned(id), n=G.buyMult;
  const cost=personnelCost(u,ownedN,n);
  if(G.save.cash<cost) return;
  G.save.cash-=cost;
  G.save.cartel.p[id]=ownedN+n;
  beepBuy(); gainXp(3*n);
  if(ownedN===0) toast('Hired your first '+u.name+'! '+u.emoji,'🏴');
  else toast('+'+n+' '+u.name+' · army '+fmt(cartelSoldiers()),u.emoji);
  renderCartel(); updateStats();
  if(typeof PVP!=='undefined') PVP.render();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function buyWeapon(id){
  const w=WEAPONS.find(x=>x.id===id),cost=w?cashCostFromProduct(w.cost):Infinity; if(!w||weaponOwned(id)||G.save.cash<cost) return;
  G.save.cash-=cost;
  G.save.cartel.w.push(id);
  beepBuy(); gainXp(25);
  toast(w.name+' armed! Power ×'+w.pMult+' '+w.emoji,'🔫');
  renderCartel(); updateStats();
  if(typeof PVP!=='undefined') PVP.render();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}

/* ---------------- buildings ---------------- */

function renderBuildings(){
  const wrap=$('buildings'); wrap.innerHTML=''; G.bldRefs={};
  for(const b of BUILDINGS){
    const card=document.createElement('div'); card.className='bld-card'; card.dataset.id=b.id;
    card.innerHTML='<div class="bld-emoji">'+b.emoji+'</div>'+
      '<div class="bld-info"><div class="bld-name">'+b.name+'</div><div class="bld-sub"></div></div>'+
      '<div class="bld-right"><div class="bld-cost"><span></span></div><div class="bld-owned">0</div></div>';
    card.addEventListener('click',()=>buyBuilding(b.id));
    wrap.appendChild(card); G.bldRefs[b.id]=card;
  }
  updateBuildings();
}
function updateBuildings(){
  for(const b of BUILDINGS){
    const card=G.bldRefs[b.id]; if(!card) continue;
    const ownedN=G.save.buildings[b.id]||0, n=G.buyMult;
    const cost=buildingCost(b,ownedN,n);
    card.querySelector('.bld-sub').textContent='+'+fmtW(buildingRate(b))+'/s each · '+fmt(ownedN)+' owned';
    card.querySelector('.bld-cost span').textContent=fmtCash(cost);
    card.querySelector('.bld-owned').textContent=fmt(ownedN);
    card.classList.toggle('afford',G.save.cash>=cost);
  }
}
function buyBuilding(id){
  const b=BUILDINGS.find(x=>x.id===id);
  const ownedN=G.save.buildings[id]||0, n=G.buyMult;
  const cost=buildingCost(b,ownedN,n);
  if(G.save.cash<cost) return;
  G.save.cash-=cost;
  G.save.buildings[id]=ownedN+n;
  if(ownedN===0) toast('Opened your first '+b.name+'! '+b.emoji,'🎉');
  beepBuy(); gainXp(5*n); dropCrateChance(0.03*n);
  updateBuildings(); updateStats();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function setBuyMult(n){ G.buyMult=n; document.querySelectorAll('#buyToggle button').forEach(b=>b.classList.toggle('on',+b.dataset.n===n)); updateBuildings(); }

/* ---------------- upgrades ---------------- */

function renderUpgrades(){
  const wrap=$('tab-upgrades');
  let html='';
  const vis=UPGRADES.filter(u=>u.need());
  if(!vis.length) html='<div class="lb-empty">Buy more operations &amp; tap more to unlock upgrades!</div>';
  vis.forEach(u=>{
    const cashCost=cashCostFromProduct(u.cost), has=owned(u.id), can=!has&&G.save.cash>=cashCost;
    html+='<div class="up-card'+(has?' bought':can?' afford':'')+'" onclick="buyUpgrade(\''+u.id+'\')">'+
      '<div class="u-emoji">'+(has?'✅':u.emoji)+'</div>'+
      '<div class="u-info"><div class="u-name">'+u.name+'</div><div class="u-desc">'+u.desc+'</div></div>'+
      '<div class="u-cost '+(can?'':'no')+'">'+(has?'OWNED':fmtCash(cashCost))+'</div></div>';
  });
  wrap.innerHTML=html;
}
function buyUpgrade(id){
  const u=UPGRADES.find(x=>x.id===id),cost=u?cashCostFromProduct(u.cost):Infinity; if(!u||owned(id)||G.save.cash<cost) return;
  G.save.cash-=cost; G.save.upgrades.push(id);
  beepBuy(); toast(u.name+' bought! '+u.emoji,'🔧'); gainXp(10);
  reRenderPanels(); updateBuildings(); updateStats();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}

/* ---------------- marketplace / cash economy ---------------- */

const MARKET_CHANNELS={
  street:{name:'Street network',emoji:'🚕',cap:100,mult:1.05,desc:'Best price · up to 100g per deal'},
  regional:{name:'Regional brokers',emoji:'🚚',cap:5000,mult:.72,desc:'Bulk price · up to 5kg per deal'},
  export:{name:'Export route',emoji:'🚢',cap:Infinity,mult:.42,desc:'Wholesale price · sell any quantity'}
};
function renderMarketplace(){
  const wrap=$('tab-market'); if(!wrap) return;
  const spot=marketPrice(), worth=netWorth();
  let html='<div class="market-hero"><div><span class="eyebrow">LIVE UNDERWORLD EXCHANGE</span><h2>'+fmtW(G.save.melons)+' product ready</h2><p>Cash '+fmtCash(G.save.cash)+' · Net worth <b>'+fmtCash(worth)+'</b></p></div><div class="market-ticker"><span>REFERENCE / GRAM</span><b>$'+spot+'</b><small>updates every 5 min</small></div></div>';
  html+='<div class="market-grid">';
  Object.keys(MARKET_CHANNELS).forEach(id=>{ const c=MARKET_CHANNELS[id], grams=Math.min(G.save.melons,c.cap), price=Math.round(spot*c.mult), value=Math.floor(grams*price); html+='<button class="market-card" onclick="sellProduct(\''+id+'\')"><span>'+c.emoji+'</span><div><b>'+c.name+'</b><small>'+c.desc+'</small><em>$'+price+'/g · '+(grams>0?fmtCash(value):'NO STOCK')+'</em></div><strong>SELL</strong></button>'; });
  html+='</div><div class="market-assets"><h3>Asset exchange</h3><button class="btn-ghost" onclick="sellCrate()">📦 Sell 1 crate · '+fmtCash(2500)+'</button><button class="btn-ghost" onclick="liquidateDuplicates()">🗃️ Sell duplicate collectibles</button></div>';
  html+='<div class="economy-ledger"><div><span>💵 CASH</span><b>'+fmtCash(G.save.cash)+'</b></div><div><span>📦 INVENTORY</span><b>'+fmtW(G.save.melons)+'</b></div><div><span>🏭 ALL ASSETS</span><b>'+fmtCash(buildingAssetValue()+otherAssetValue())+'</b></div><div><span>🏆 NET WORTH</span><b>'+fmtCash(worth)+'</b></div></div>';
  wrap.innerHTML=html;
}
function sellProduct(channel){
  const c=MARKET_CHANNELS[channel]; if(!c||G.save.melons<=0){ toast('No product available to sell.','📦'); return; }
  const grams=Math.min(G.save.melons,c.cap), price=Math.round(marketPrice()*c.mult), proceeds=Math.floor(grams*price);
  G.save.melons=Math.max(0,G.save.melons-grams); addCash(proceeds,true); gainXp(Math.max(1,Math.floor(Math.log10(proceeds+1)*2)));
  toast('Sold '+fmtW(grams)+' through '+c.name+' · '+fmtCash(proceeds),'💵'); beepBuy(); renderMarketplace(); updateStats(); saveGame();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function sellCrate(){
  if(G.save.inv<=0){ toast('No crates available to sell.','📦'); return; }
  G.save.inv--; addCash(2500,true); toast('Crate sold for $2,500.','📦'); updateCrateButtons(); renderMarketplace(); refreshHud(); saveGame();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function liquidateDuplicates(){
  let copies=0,value=0;
  ITEMS.forEach(item=>{ const count=G.save.coll[item.id]||0; if(count>1){ const sold=count-1; copies+=sold; value+=sold*RARITY[item.r].v*750; G.save.coll[item.id]=1; } });
  if(!copies){ toast('No duplicate collectibles to sell.','🗃️'); return; }
  addCash(value,true); toast('Sold '+copies+' duplicates for '+fmtCash(value)+'.','🗃️'); renderMarketplace(); refreshHud(); saveGame();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
window.sellProduct=sellProduct; window.sellCrate=sellCrate; window.liquidateDuplicates=liquidateDuplicates;

/* ---------------- ascension / prestige ---------------- */

function renderRebuild(){
  const wrap=$('tab-ascend');
  const gain=calcSeedGain();
  let html='<div class="ascend-hero">'+
    '<div class="ah-big">🗝️ '+fmt(G.save.seeds)+' connections</div>'+
    '<div class="ah-gain">Rebuild grants <b>'+fmt(gain)+'</b> connections · each +'+(1+level('as1'))+'% production</div>'+
    '<button onclick="openRebuildConfirm()">⭐ REBUILD</button>'+
    '<div class="ah-hint">Resets cash, product, operations &amp; upgrades — keeps connections, crystals, levels, cartel &amp; collection.</div>'+
    '<div class="ah-hint">Rebuild skins: ⭐ '+(G.save.ascensions>=3?'unlocked':'3 rebuilds')+' · ✨ 10 rebuilds · 🕳️ 25 rebuilds</div></div>'+
    '<div class="ascend-note">Permanent upgrades — bought with 🗝️ connections:</div>';
  ASC_UP.forEach(a=>{
    const lv=level(a.id), maxed=lv>=a.max;
    const cost=Math.ceil(a.base*Math.pow(a.mult,lv));
    const can=!maxed&&G.save.seeds>=cost;
    html+='<div class="up-card'+(maxed?' bought':can?' afford':'')+'" onclick="buyAsc(\''+a.id+'\')">'+
      '<div class="u-emoji">'+(maxed?'✅':a.emoji)+'</div>'+
      '<div class="u-info"><div class="u-name">'+a.name+' <span class="u-lv">Lv '+(lv>=1?lv:'—')+'/'+a.max+'</span></div>'+
      '<div class="u-desc">'+a.desc+'</div></div>'+
      '<div class="u-cost '+(can?'':'no')+'">'+(maxed?'MAX':'🗝️ '+fmt(cost))+'</div></div>';
  });
  wrap.innerHTML=html;
}
function buyAsc(id){
  const a=ASC_UP.find(x=>x.id===id); if(!a) return;
  const lv=level(a.id); if(lv>=a.max) return;
  const cost=Math.ceil(a.base*Math.pow(a.mult,lv));
  if(G.save.seeds<cost) return;
  G.save.seeds-=cost; G.save.asc[id]=lv+1;
  beepBuy(); toast(a.name+' → Lv '+(lv+1)+'! '+a.emoji,'🌱'); gainXp(20);
  reRenderPanels(); updateStats(); Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function openRebuildConfirm(){
  const gain=calcSeedGain();
  if(gain<1){ toast('Build a $500K run economy to unlock rebuild. Sell product in the marketplace.','🗝️'); return; }
  $('ascGainN').textContent=fmt(gain);
  openModal('veilRebuild');
}
function doRebuild(){
  const gain=calcSeedGain(); if(gain<1){ closeModal('veilRebuild'); return; }
  G.save.seeds=Math.min(1000000,G.save.seeds+gain); G.save.totalSeeds=Math.min(1000000,G.save.totalSeeds+gain); G.save.ascensions++;
  G.save.melons=0; G.save.cash=0; G.save.runEarned=0; G.save.runCashEarned=0; G.save.buildings={}; G.save.upgrades=[]; G.save.totalClicks=0;
  G.combo=0;
  if(level('as7')>0) G.save.buildings.vine=25;
  addCrystals(2*level('as12'));
  closeModal('veilRebuild');
  beepRebuild();
  gainXp(100+gain);
  toast('⭐ REBUILDED! +'+fmt(gain)+' connections!','🗝️');
  const newSkin=SKINS.find(s=>s.asc===G.save.ascensions);
  if(newSkin&&!G.save.skins.includes(newSkin.id)){ G.save.skins.push(newSkin.id); toast('PRESTIGE SKIN UNLOCKED: '+newSkin.name+' '+newSkin.emoji,'👑'); }
  saveGame(); renderAll();
  Leaderboard&&Leaderboard.onNameChange&&Leaderboard.onNameChange();
}

/* ---------------- shop (boosters + skins) ---------------- */

function renderShop(){
  const wrap=$('tab-shop');
  let html='<div class="ascend-note">Buy permanent boosts with 💎 crystals (no reset needed!):</div>';
  SHOP.forEach(s=>{
    const lv=shopLvl(s.id), maxed=lv>=s.max;
    const cost=Math.ceil(s.base*Math.pow(s.mult,lv));
    const can=!maxed&&G.save.crystals>=cost;
    let desc=s.desc;
    if(s.id==='sh1') desc='+'+lv+' auto taps/sec';
    if(s.id==='sh2') desc='+'+lv+' ×1.5 production (×'+fmt(Math.pow(1.5,lv))+')';
    if(s.id==='sh3') desc='+'+(lv*4)+'h offline cap';
    if(s.id==='sh4') desc='cash drops ×'+fmt(Math.pow(2,lv))+' more often';
    if(s.id==='sh5') desc='+'+Math.round(lv*50)+'% cash drop rewards';
    if(s.id==='sh6') desc='+'+lv+'s combo window · +'+(lv*5)+' max combo';
    if(s.id==='sh7') desc='crates ×'+fmt(Math.pow(2,lv))+' more likely';
    if(s.id==='sh8') desc='+'+Math.round(lv*25)+'% boss rewards';
    if(s.id==='sh9') desc='roulette spins cost '+Math.max(1,10-lv)+' 💎';
    if(s.id==='sh10') desc='+'+Math.round(lv*50)+'% mini game product';
    html+='<div class="up-card'+(maxed?' bought':can?' afford':'')+'" onclick="buyShop(\''+s.id+'\')">'+
      '<div class="u-emoji">'+(maxed?'✅':s.emoji)+'</div>'+
      '<div class="u-info"><div class="u-name">'+s.name+' <span class="u-lv">Lv '+lv+'/'+s.max+'</span></div>'+
      '<div class="u-desc">'+desc+'</div></div>'+
      '<div class="u-cost '+(can?'':'no')+'">'+(maxed?'MAX':'💎 '+fmt(cost))+'</div></div>';
  });
  html+='<div class="ascend-note">🎨 Skins — your brick &amp; avatar. Buying updates your balance on the live board:</div>';
  SKINS.forEach(s=>{
    const ownedSkin=G.save.skins.includes(s.id), active=G.save.skin===s.id;
    const lvlOK=G.save.level>=s.lvl, ascOK=G.save.ascensions>=s.asc;
    const can=!ownedSkin&&G.save.crystals>=s.price&&lvlOK&&ascOK;
    let tag='';
    if(s.lvl>0&&!lvlOK) tag='<div class="u-desc">Requires Level '+s.lvl+'</div>';
    if(s.asc>0&&!ascOK) tag='<div class="u-desc">Rebuild reward — rebuild '+s.asc+'×</div>';
    if(s.price===0&&s.asc>0&&ascOK) tag='<div class="u-desc">Rebuild reward (free)!</div>';
    html+='<div class="up-card'+(active?' bought':can?' afford':'')+'" onclick="buySkin(\''+s.id+'\')">'+
      '<div class="u-emoji">'+s.emoji+'</div>'+
      '<div class="u-info"><div class="u-name">'+s.name+(active?' <span class="u-lv">EQUIPPED</span>':'')+'</div>'+
      '<div class="u-desc">'+tag+(s.price>0?('Cost '+s.price+' 💎'):'')+'</div></div>'+
      '<div class="u-cost '+(can?'':'no')+'">'+(active?'✓':ownedSkin?'OWNED':(s.price>0?('💎 '+fmt(s.price)):'FREE'))+'</div></div>';
  });
  wrap.innerHTML=html;
}
function buyShop(id){
  const s=SHOP.find(x=>x.id===id); if(!s) return;
  const lv=shopLvl(s.id); if(lv>=s.max) return;
  const cost=Math.ceil(s.base*Math.pow(s.mult,lv));
  if(G.save.crystals<cost) return;
  G.save.crystals-=cost; G.save.shop[id]=lv+1;
  beepBuy(); toast(s.name+' → Lv '+(lv+1)+'! '+s.emoji,'💎'); gainXp(10);
  reRenderPanels(); updateStats(); refreshHud();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function buySkin(id){
  const s=SKINS.find(x=>x.id===id); if(!s) return;
  if(G.save.skins.includes(id)){ G.save.skin=id; applySkin(); renderShop(); refreshHud(); toast(s.name+' equipped! '+s.emoji,'🎨'); return; }
  if(G.save.level<s.lvl){ toast('Need Level '+s.lvl+' to unlock this skin!','🎓'); return; }
  if(G.save.ascensions<s.asc){ toast('Rebuild reward — rebuild '+s.asc+'× to unlock!','⭐'); return; }
  if(G.save.crystals<s.price){ toast('Need '+s.price+' 💎 for this skin!','💎'); return; }
  G.save.crystals-=s.price; G.save.skins.push(id); G.save.skin=id;
  applySkin(); renderShop(); refreshHud();
  beepGolden(); toast(s.name+' bought & equipped! '+s.emoji,'🎨');
  saveGame(); checkAchievements();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function applySkin(){
  document.body.className=document.body.className.replace(/\bskin-\S+/g,'').trim();
  const s=SKINS.find(x=>x.id===G.save.skin)||SKINS[0];
  document.body.classList.add('skin-'+s.id);
  const av=$('hudAvatar'); if(av) av.textContent=s.emoji;
}

/* ---------------- achievements / daily / rank ---------------- */

function renderAchievements(){
  const grid=$('achGrid');
  const unlocked=G.save.ach.length;
  if(unlocked!==G.achCount){
    G.achCount=unlocked;
    let html='';
    ACH.forEach(a=>{
      const has=G.save.ach.includes(a.id);
      html+='<div class="ach-item'+(has?' unlocked':'')+'">'+
        '<div class="a-emoji">'+a.e+'</div>'+
        '<div class="a-info"><div class="a-name">'+a.n+'</div><div class="a-desc">'+a.d+'</div></div>'+
        '<div class="a-give">'+(has?('+'+a.g+' 💎'):'🔒')+'</div></div>';
    });
    grid.innerHTML=html;
  }
}
function checkAchievements(){
  let any=false;
  for(const a of ACH){
    if(G.save.ach.includes(a.id)) continue;
    if(a.need()){
      G.save.ach.push(a.id); addCrystals(a.g);
      toast(a.n+' unlocked! +'+a.g+' 💎','🏆');
      beepAch(); any=true;
    }
  }
  if(any){ refreshHud(); Leaderboard&&Leaderboard.bump&&Leaderboard.bump(); }
}
function renderRankCard(){
  const r=rankInfo();
  $('rankIcon').textContent=r.emoji;
  $('rankTitle').textContent=r.name+' · Lv '+G.save.level;
  $('rankBar').style.width=r.pct+'%';
  $('rankNext').textContent=r.hasNext?r.nextName+' · '+fmtCash(r.next)+' required':'Maximum net-worth rank';
}
function renderDaily(){
  const btn=$('dailyBtn');
  if(btn){
    if(G.save.dailyClaimed){ btn.textContent='DONE'; btn.classList.add('done'); $('dailySub').textContent='Streak: day '+G.save.dailyStreak+' · come back tomorrow!'; }
    else{ btn.classList.remove('done'); btn.textContent='CLAIM'; $('dailySub').textContent='Day '+G.save.dailyStreak+' streak — free crystals!'; }
  }
}
function checkDaily(){
  const today=new Date(), ds=today.toDateString();
  if(G.save.lastDaily!==ds){
    const yest=new Date(today); yest.setDate(yest.getDate()-1);
    G.save.dailyStreak=(G.save.lastDaily===yest.toDateString())?G.save.dailyStreak+1:1;
    G.save.dailyClaimed=false;
    rollDailyQuests();
  }
  renderDaily();
}
function rollDailyQuests(){
  const pool=[...DQ];
  const pick=[];
  while(pick.length<4&&pool.length){ const i=Math.floor(Math.random()*pool.length); pick.push(pool.splice(i,1)[0]); }
  G.save.dqIds=pick.map(q=>q.id);
  G.save.dqProg={}; G.save.dqDone=[];
  G.save.dqBase={ grow:G.save.lifetimeEarned, combo:G.save.maxCombo, golden:G.save.goldenClicks, crates:G.save.cratesOpened, suika:G.save.suika.games, whack:G.save.whack.games, merges:G.save.suika.merges, score:G.save.suika.best, whackscore:G.save.whack.best, boss:(G.save.bossKills||0), asc:G.save.ascensions, cry:(G.save.crystalsEarned||0), buy:0, tap:0, fish:(G.save.fish.caught||0), fishking:(G.save.fish.royal||0), raid:(G.save.pvp.won||0), balloon:(G.save.balloon.games||0) };
  G.save.dqDay=new Date().toDateString();
  renderQuestTab();
}
function claimDaily(){
  if(G.save.dailyClaimed) return;
  G.save.lastDaily=new Date().toDateString(); G.save.dailyClaimed=true;
  const c=Math.min(3+G.save.dailyStreak,15);
  addCrystals(c); gainXp(15);
  $('dailyMsg').innerHTML='<b>Day '+G.save.dailyStreak+'</b> streak!<br>You earned <b>+'+c+' 💎</b> crystals!';
  openModal('veilDaily');
  toast('+'+c+' 💎 daily reward!','🎁');
  beepAch(); refreshHud(); renderDaily(); checkAchievements();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function checkOffline(){
  const dt=(Date.now()-G.save.lastOnline)/1000;
  if(dt>120){
    const cap=(6+3*shopLvl('sh3'))*3600;
    const offSec=Math.min(dt,cap);
    const earned=effectivePerSec()*offSec*Math.pow(2,level('as5'))*(1+0.25*level('as11'));
    addMelons(earned);
    G.save.offlineEarns=(G.save.offlineEarns||0)+1;
    $('offlineMsg').innerHTML='You were away for <b>'+fmtDur(offSec)+'</b>.<br>Your product kept moving and produced <b>'+fmtW(earned)+'</b>!';
    openModal('veilOffline');
    checkAchievements();
  }
}

/* ---------------- quests ---------------- */

function dqProgress(id){
  const q=DQ.find(x=>x.id===id); if(!q) return 0;
  if(id==='d_tap') return G.save.totalClicks-(G.save.dqBase.tap||0);
  if(id==='d_buy') return Math.floor(totalBuildings()-(G.save.dqBase.buy||0));
  if(id==='d_grow') return Math.floor(G.save.lifetimeEarned-(G.save.dqBase.grow||0));
  if(id==='d_combo') return Math.max(0,(G.save.maxCombo||0)-(G.save.dqBase.combo||0));
  if(id==='d_golden') return G.save.goldenClicks-(G.save.dqBase.golden||0);
  if(id==='d_crate') return G.save.cratesOpened-(G.save.dqBase.crates||0);
  if(id==='d_suika') return G.save.suika.games-(G.save.dqBase.suika||0);
  if(id==='d_merge') return G.save.suika.merges-(G.save.dqBase.merges||0);
  if(id==='d_score') return Math.max(0,(G.save.suika.best||0)-(G.save.dqBase.score||0));
  if(id==='d_whack') return G.save.whack.games-(G.save.dqBase.whack||0);
  if(id==='d_whackscore') return Math.max(0,(G.save.whack.best||0)-(G.save.dqBase.whackscore||0));
  if(id==='d_boss') return Math.max(0,(G.save.bossKills||0)-(G.save.dqBase.boss||0));
  if(id==='d_ascend') return Math.max(0,G.save.ascensions-(G.save.dqBase.asc||0));
  if(id==='d_cry') return Math.max(0,(G.save.crystalsEarned||0)-(G.save.dqBase.cry||0));
  if(id==='d_fish') return Math.max(0,(G.save.fish.caught||0)-(G.save.dqBase.fish||0));
  if(id==='d_fishking') return Math.max(0,(G.save.fish.royal||0)-(G.save.dqBase.fishking||0));
  if(id==='d_raid') return Math.max(0,(G.save.pvp.won||0)-(G.save.dqBase.raid||0));
  if(id==='d_balloon') return Math.max(0,(G.save.balloon.games||0)-(G.save.dqBase.balloon||0));
  return 0;
}
function renderQuestTab(){
  if(document.body.dataset.view!=='quests') return;
  const qr=$('questReset');
  if(qr){ const now=new Date(); const mid=new Date(now); mid.setHours(24,0,0,0); qr.textContent='reset in '+fmtDur((mid-now)/1000); }
  const dw=$('dailyQuests');
  if(dw){
    if(G.save.dqIds.length){
      let html='';
      G.save.dqIds.forEach(id=>{
        const q=DQ.find(x=>x.id===id); if(!q) return;
        const p=dqProgress(id), done=G.save.dqDone.includes(id), claim=p>=q.goal&&!done;
        const pct=clamp(p/q.goal*100,0,100);
        html+='<div class="quest-card'+(done?' done':'')+'">'+
          '<div class="q-emoji">'+q.e+'</div>'+
          '<div class="q-info"><div class="q-name">'+q.n+'</div>'+
          '<div class="q-desc">'+q.t+' <b>'+fmt(Math.min(p,q.goal))+'/'+fmt(q.goal)+'</b>'+q.unit+'</div>'+
          '<div class="q-bar"><div style="width:'+pct+'%"></div></div></div>'+
          (claim?'<button class="q-claim-btn" onclick="claimDailyQuest(\''+q.id+'\')">CLAIM</button>':
          '<div class="q-reward">+1 💎<br>+20 xp</div>')+'</div>';
      });
      dw.innerHTML=html;
    }else dw.innerHTML='<div class="lb-empty">Daily quests roll at midnight 🌙</div>';
  }
  const sw=$('storyQuests');
  if(sw){
    let html='';
    QUESTS.forEach(q=>{
      const done=G.save.quests[q.id], can=!done&&q.need();
      html+='<div class="quest-card'+(done?' done':'')+'" '+(can?'onclick="claimQuest(\''+q.id+'\')"':'')+'>'+
        '<div class="q-emoji">'+(done?'✅':q.e)+'</div>'+
        '<div class="q-info"><div class="q-name">'+q.n+'</div><div class="q-desc">'+q.d+'</div></div>'+
        (can?'<button class="q-claim-btn">CLAIM</button>':'<div class="q-reward">+'+q.cry+' 💎<br>+'+q.xp+' xp</div>')+'</div>';
    });
    sw.innerHTML=html;
  }
}
function claimQuest(id){
  const q=QUESTS.find(x=>x.id===id); if(!q||G.save.quests[id]||!q.need()) return;
  G.save.quests[id]=true; addCrystals(q.cry); gainXp(q.xp);
  toast(q.n+' complete! +'+q.cry+' 💎','🌟');
  beepAch(); renderQuestTab(); refreshHud(); checkAchievements();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function claimDailyQuest(id){
  const q=DQ.find(x=>x.id===id); if(!q||G.save.dqDone.includes(id)||dqProgress(id)<q.goal) return;
  G.save.dqDone.push(id); addCrystals(1); gainXp(20);
  toast(q.n+' complete! +1 💎','🗓️');
  beepAch(); renderQuestTab(); refreshHud();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}

/* ---------------- cash drops ---------------- */

function scheduleGolden(delay){
  clearTimeout(G.goldTimer);
  const evtGold=G.evt&&G.evt.id==='gold';
  const freq=Math.pow(2,level('as6')+shopLvl('sh4'));
  const base=evtGold?12000:((150+Math.random()*210)*1000)/freq;
  const t=(delay!==undefined)?delay:base;
  G.goldTimer=setTimeout(spawnGolden,t);
}
function spawnGolden(){
  if(G.goldenBusy){ scheduleGolden(20000); return; }
  G.goldenBusy=true;
  const el=$('goldenMelon');
  const pad=16,w=innerWidth-pad*2-84,h=innerHeight-160;
  el.style.left=(pad+Math.random()*Math.max(10,w))+'px';
  el.style.top=(Math.max(70,innerHeight*0.15)+Math.random()*Math.max(50,h))+'px';
  el.classList.remove('hidden');
  G.goldTimer=setTimeout(()=>{ el.classList.add('hidden'); G.goldenBusy=false; scheduleGolden(); },12000);
}
function clickGolden(){
  const el=$('goldenMelon');
  el.classList.add('hidden'); clearTimeout(G.goldTimer); G.goldenBusy=false;
  G.save.goldenClicks++;
  const val=Math.pow(1.5,shopLvl('sh5')), per=effectivePerSec();
  const cryEvt=(G.evt&&G.evt.id==='crystal');
  const r=Math.random(); let msg='';
  if(r<0.30){
    const amt=150*per*val; addMelons(amt); msg='🍀 LUCKY! +'+fmtW(amt)+' product!';
  }else if(r<0.52){
    G.frenzyUntil=Date.now()+30000; msg='⚡ FRENZY! ×7 production for 30s!';
  }else if(r<0.70){
    const c=Math.max(1,Math.round(val*(1+Math.random()*2)))+(cryEvt?2:0);
    addCrystals(c); msg='🎁 JACKPOT! +'+c+' 💎!';
  }else if(r<0.85){
    G.tapUntil=Date.now()+30000; msg='👆 TAP STORM! ×10 tap power!';
  }else{
    const amt=per*1800*val; addMelons(amt); msg='🕐 TIME WARP! +30min of growth ('+fmtW(amt)+')!';
  }
  if(cryEvt) addCrystals(1);
  if(Math.random()<0.25){ dropCrate(1); }
  const gp=document.createElement('div'); gp.className='golden-pop'; gp.textContent='💰';
  gp.style.left=(el.offsetLeft+24)+'px'; gp.style.top=(el.offsetTop+12)+'px';
  document.body.appendChild(gp); setTimeout(()=>gp.remove(),700);
  toast(msg,'💰'); beepGolden(); refreshHud(); checkAchievements(); scheduleGolden();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}

/* ---------------- crates / collection ---------------- */

function dropCrate(n){
  if(n<=0) return;
  G.save.inv+=n;
  toast('You found '+(n>1?n+' ':'a ')+'crate'+(n>1?'s':'')+'! 📦','🎁');
  $('hudCrateN').textContent=G.save.inv;
  updateCrateButtons();
}
function dropCrateChance(p){
  if(Math.random()<p*Math.pow(2,shopLvl('sh7'))) dropCrate(1);
}
function pickItem(){
  let roll=Math.random()*100, acc=0, chosen=null;
  for(const key of Object.keys(RARITY)){ acc+=RARITY[key].w; if(roll<acc){ chosen=key; break; } }
  if(!chosen) chosen='common';
  const pool=ITEMS.filter(i=>i.r===chosen);
  return pool[Math.floor(Math.random()*pool.length)];
}
function updateCrateButtons(){
  const btn=$('openCrateBtn'), allBtn=$('openAllCratesBtn');
  if(btn) btn.textContent='Open a crate ('+G.save.inv+')';
  if(allBtn){
    allBtn.textContent='Open all ('+G.save.inv+')';
    allBtn.disabled=G.save.inv<=0;
  }
}
function openCrate(){
  if(G.save.inv<=0){ toast('No crates yet! Keep tapping.','📦'); return; }
  G.save.inv--; G.save.cratesOpened++;
  updateCrateButtons();
  const item=pickItem(), rar=RARITY[item.r];
  const had=G.save.coll[item.id];
  if(had){ G.save.coll[item.id]=had+1; addCrystals(rar.v); }
  else G.save.coll[item.id]=1;
  $('crateEmoji').textContent=item.e;
  $('crateName').textContent=(had?'Duplicate: ':'NEW! ')+item.n;
  $('crateMsg').innerHTML=('<span style="color:'+rar.c+'">'+item.r.toUpperCase()+'</span> item!'+(had?'<br>Converted to <b>+'+rar.v+' 💎</b> because you already own it.':'<br>Added to your collection!'+(rar.w<=6?'<br><b>SUPER RARE!</b>':'')+(item.r==='legendary'?'<br><b>LEGENDARY DROP!</b>':'')).replace(/</g,'<'));
  $('crateAgain').style.display=G.save.inv>0?'':'none';
  openModal('veilCrate');
  beepAch(); refreshHud(); gainXp(5);
  renderCollection(); renderInventory(); checkAchievements();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function openAllCrates(){
  const count=G.save.inv;
  if(count<=0){ toast('No crates yet! Keep tapping.','📦'); return; }
  let newItems=0, duplicates=0, crystals=0;
  const rarities={};
  for(let i=0;i<count;i++){
    const item=pickItem(), rar=RARITY[item.r], had=G.save.coll[item.id];
    rarities[item.r]=(rarities[item.r]||0)+1;
    if(had){ G.save.coll[item.id]=had+1; duplicates++; crystals+=rar.v; }
    else { G.save.coll[item.id]=1; newItems++; }
  }
  G.save.inv=0;
  G.save.cratesOpened+=count;
  addCrystals(crystals);
  updateCrateButtons();
  $('crateEmoji').textContent='📦';
  $('crateName').textContent='Opened '+count+' crate'+(count===1?'':'s')+'!';
  const raritySummary=Object.keys(RARITY).filter(r=>rarities[r]).map(r=>'<span style="color:'+RARITY[r].c+'">'+rarities[r]+' '+r+'</span>').join(' · ');
  $('crateMsg').innerHTML='<b>'+newItems+' new</b> · '+duplicates+' duplicate'+(duplicates===1?'':'s')+(crystals?'<br>Duplicates converted to <b>+'+crystals+' 💎</b>':'')+'<br>'+raritySummary;
  $('crateAgain').style.display='none';
  openModal('veilCrate');
  beepAch(); refreshHud(); gainXp(5*count);
  renderCollection(); renderInventory(); checkAchievements();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}
function renderCollection(){
  const grid=$('collectionGrid');
  if(!grid||document.body.dataset.view!=='quests') return;
  const foundN=Object.keys(G.save.coll).length;
  $('collCount').textContent=foundN+'/'+ITEMS.length+' found';
  let html='';
  ITEMS.forEach(i=>{
    const n=G.save.coll[i.id]||0;
    const c=RARITY[i.r].c;
    html+='<div class="coll-item'+(n>0?' found':' locked')+'" style="'+(n>0?('--rarity:'+c+';--rarity-bg:'+c+'22'):'')+'">'+
      '<div class="c-emoji">'+(n>0?i.e:'❓')+'</div>'+
      '<div class="c-name">'+(n>0?i.n:'???')+'</div>'+
      '<div class="c-count" style="color:'+c+'">'+(n>0?('×'+n+' · '+i.r):i.r)+'</div></div>';
  });
  grid.innerHTML=html;
}
function renderInventory(){
  const list=$('invList');
  if(!list||document.body.dataset.view!=='quests') return;
  updateCrateButtons();
  const recent=G.save.recentDrops||[];
  if(!recent.length&&!G.save.inv){ list.innerHTML='<div class="lb-empty">No crates yet — they drop from clicks, buys &amp; mini games!</div>'; return; }
  list.innerHTML='<div class="inv-row"><div class="i-emoji">📦</div><div class="i-name">Crates ready to open</div><div class="i-val">×'+G.save.inv+'</div></div>';
}

/* ---------------- mini game bridges ---------------- */

function miniRewardMult(){ return (G.evt&&G.evt.id==='fruit'?3:1)*(1+0.5*shopLvl('sh10')); }
window.suikaIdleFinish=function(score,stats){
  stats=stats||{merges:0,watermelons:0,bestTier:0};
  G.save.suika.games++;
  if(score>G.save.suika.best) G.save.suika.best=score;
  G.save.suika.merges+=stats.merges;
  if(stats.watermelons>0) G.save.suika.watermelons=(G.save.suika.watermelons||0)+stats.watermelons;
  const boost=G.save.suika.suikaBoost?2:1;
  G.save.suika.suikaBoost=false;
  const mult=miniRewardMult()*boost;
  const m=Math.floor(score*8*mult);
  addMelons(m); gainXp(Math.floor(score/3*mult));
  let cry=0;
  if(score>=2000) cry+=3;
  if(stats.watermelons>0) cry+=12*stats.watermelons;
  let drops=0;
  if(stats.watermelons>0){ dropCrate(stats.watermelons); drops+=stats.watermelons; }
  if(score>=1000){ dropCrate(1); drops++; }
  addCrystals(cry);
  window.suikaIdleRewardText='+'+fmtW(m)+' · +'+cry+' 💎'+(drops?(' · '+drops+' 📦'):'');
  toast('Merge run: +'+fmtW(m)+' product'+(cry?' +'+cry+' 💎':'')+'!','🧊');
  refreshHud(); checkAchievements(); checkQuests(true);
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
};
function whackFinish(score){
  G.save.whack.games++;
  if(score>G.save.whack.best) G.save.whack.best=score;
  const mult=miniRewardMult();
  const m=Math.floor(score*4*mult);
  addMelons(m); gainXp(Math.floor(score/4*mult));
  if(score>=100) dropCrate(1);
  toast('Whack run: +'+fmtW(m)+' product!','🥷');
  refreshHud(); checkAchievements(); checkQuests(true);
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}

/* ---------------- roulette ---------------- */

const ROULETTE_SEGS=[
  {l:'100💎',w:2,pay:100,jackpot:true},{l:'25💎',w:8,pay:25},{l:'10💎',w:20,pay:10},
  {l:'5💎',w:25,pay:5},{l:'🧊×2',w:15,pay:0,boost:true},{l:'0',w:30,pay:0}
];
let rouletteRotation=0,rouletteBusy=false;
function rouletteCost(){ return Math.max(1,10-shopLvl('sh9')); }
function updateRouletteUI(){
  const b=$('rouletteSpin'); if(!b) return;
  const c=rouletteCost();
  b.disabled=G.save.crystals<c;
  b.textContent='SPIN — '+c+' 💎';
}
function initRoulette(){
  const wheel=$('rouletteWheel');
  if(!wheel) return;
  const n=ROULETTE_SEGS.length, step=360/n;
  const colors=['#3fce6a','#1f8f46','#17602a'];
  const con=[];
  for(let i=0;i<n;i++){
    con.push(colors[i%2]+' '+(i*step)+'deg '+((i+1)*step)+'deg');
  }
  wheel.style.background='conic-gradient(from 0deg, '+con.join(',')+')';
  wheel.style.setProperty('--segs',n);
  wheel.querySelectorAll('.roulette-seg').forEach(x=>x.remove());
  ROULETTE_SEGS.forEach(s=>{
    const el=document.createElement('span');
    el.className='roulette-seg';
    el.textContent=s.l;
    wheel.appendChild(el);
  });
  layoutRoulette();
  addEventListener('resize',()=>{ if(document.body.dataset.view==='mini') layoutRoulette(); });
  updateRouletteUI();
}
function layoutRoulette(){
  const wheel=$('rouletteWheel'); if(!wheel) return;
  const n=ROULETTE_SEGS.length, step=360/n;
  const half=wheel.clientWidth/2;
  const r=half-24;
  const segs=wheel.querySelectorAll('.roulette-seg');
  segs.forEach((el,i)=>{
    const rad=((i*step)+step/2-90)*Math.PI/180;
    el.style.left=(half+Math.cos(rad)*r)+'px';
    el.style.top=(half+Math.sin(rad)*r)+'px';
  });
}
function spinRoulette(){
  if(rouletteBusy) return;
  const cost=rouletteCost();
  if(G.save.crystals<cost){ toast('Need '+cost+' 💎 to spin!','💎'); return; }
  G.save.crystals-=cost; G.save.roulette.spins++;
  refreshHud(); rouletteBusy=true;
  const r=Math.random(); let acc=0,idx=0;
  for(let i=0;i<ROULETTE_SEGS.length;i++){ acc+=ROULETTE_SEGS[i].w; if(r<acc/100){ idx=i; break; } }
  const seg=ROULETTE_SEGS[idx];
  const step=360/ROULETTE_SEGS.length;
  rouletteRotation+=360*6+(360-(idx*step+step/2));
  const wheel=$('rouletteWheel');
  wheel.style.transform='rotate('+rouletteRotation+'deg)';
  wheel.classList.add('spinning');
  $('rouletteResult').textContent='Spinning…';
  $('rouletteSpin').disabled=true;
  setTimeout(()=>{
    wheel.classList.remove('spinning');
    if(seg.boost){ G.save.suika.suikaBoost=true; $('rouletteResult').textContent='🧊 Merge Boost! Next run ×2!'; toast('Merge Boost! Next run ×2!','🧊'); }
    else if(seg.pay>0){
      addCrystals(seg.pay); G.save.roulette.wins++;
      if(seg.jackpot) G.save.roulette.jackpots=(G.save.roulette.jackpots||0)+1;
      $('rouletteResult').textContent='+'+seg.pay+' 💎!'; toast('Roulette win: +'+seg.pay+' 💎!','🎡');
    }else{ $('rouletteResult').textContent='RIP — nothing! 🫠'; toast('Roulette: nothing! 🫠','🎡'); }
    refreshHud(); rouletteBusy=false; beepAch(); checkAchievements();
    Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
  },3400);
}

/* ---------------- global events ---------------- */

function Events(){
  const URL='https://mantledb.sh/v2/narcos/event';
  let lastCheck=0;
  async function poll(){
    try{
      const r=await fetch(URL,{cache:'no-store'});
      if(!r.ok) return;
      const data=await r.json();
      const now=Date.now();
      if(data&&data.id&&data.ends>now){
        if(!G.evt||G.evt.id!==data.id){
          const ev=EVENTS.find(e=>e.id===data.id);
          if(ev){ toast(ev.n+' started — '+ev.d,ev.e); beepGolden(); }
        }
        G.evt={id:data.id,ends:data.ends,started:data.starts};
        G.save.lastEventEnd=data.ends;
      }else{
        if(G.evt) toast('The event has ended!','🌙');
        G.evt=null;
        maybeStart(data,now);
      }
      updateEventBanner();
    }catch(e){}
  }
  function maybeStart(data,now){
    if(G.save.name==='') return;
    const lastEnd=data&&data.lastEnd?data.lastEnd:G.save.lastEventEnd||0;
    if(now-lastEnd<6*60000) return;
    if(Math.random()>0.35) return;
    const ev=EVENTS[Math.floor(Math.random()*EVENTS.length)];
    const dur=(3+Math.random()*3)*60000;
    const payload={id:ev.id,starts:now,ends:now+dur,lastEnd:now+dur};
    G.evt={id:ev.id,ends:now+dur,started:now};
    G.save.lastEventEnd=now+dur;
    toast(ev.n+' started — '+ev.d,ev.e);
    updateEventBanner();
    fetch(URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).catch(()=>{});
  }
  function tick(){
    if(Date.now()-lastCheck>30000){ lastCheck=Date.now(); poll(); }
  }
  function init(){ lastCheck=0; poll(); }
  return {init,tick};
}
const EVENTS_API=Events();

function updateEventBanner(){
  const b=$('eventBanner');
  if(!b) return;
  if(G.evt&&G.evt.ends>Date.now()){
    const ev=EVENTS.find(e=>e.id===G.evt.id);
    b.classList.remove('hidden');
    $('eventText').textContent=ev?(ev.e+' '+ev.n+' — '+ev.d):'EVENT!';
    $('eventTimer').textContent=fmtDur((G.evt.ends-Date.now())/1000);
  }else{ b.classList.add('hidden'); G.evt=null; }
}
function collectEventReward(){
  if(!G.evt) return;
  if(G.save.eventClaimed===G.evt.id){ toast('Already claimed — enjoy the buff!','🎉'); return; }
  G.save.eventClaimed=G.evt.id;
  const c=5+Math.floor(Math.random()*11);
  addCrystals(c); gainXp(20);
  toast('Event reward: +'+c+' 💎!','🌟');
  refreshHud(); beepAch();
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}

/* ---------------- name / boot ---------------- */

function openNameModal(){ $('nameInput').value=G.save.name||''; openModal('veilName'); setTimeout(()=>$('nameInput').focus(),60); }
function submitName(){
  const v=($('nameInput').value.trim()||'CartelBoss').slice(0,16);
  G.save.name=v; $('hudName').textContent=v;
  closeModal('veilName');
  toast('Welcome, '+v+'! Tap the brick! 💵');
  refreshHud();
  if(booted){ if(typeof Leaderboard!=='undefined') Leaderboard.onNameChange(); if(typeof Chat!=='undefined') Chat.onOpen(); }
  else postBoot();
}
async function resetGame(){
  if(!confirm('Reset ALL progress and remove your leaderboard entry?')) return;
  G.save.name='';
  try{ if(typeof Leaderboard!=='undefined'&&Leaderboard.removeMe) await Leaderboard.removeMe(); }catch(e){}
  try{ localStorage.removeItem('narcos_save'); localStorage.removeItem('suikaver_save'); }catch(e){}
  location.reload();
}

let booted=false;
async function clearLeaderboard(){
  if(!confirm('Clear the ENTIRE global leaderboard?\nThis removes every cartel\'s score from the cloud — it can\'t be undone.')) return;
  const ok=await Leaderboard.clearAll();
  if(ok){ setView('board'); toast('🌌 Leaderboard cleared'); Leaderboard.refresh(); }
  else toast('⚠️ Could not clear leaderboard — check connection and try again');
}
function postBoot(){
  if(booted) return;
  if(!G.save.name){ openNameModal(); return; }
  booted=true;
  Leaderboard.init();
  EVENTS_API.init();
  Chat.init&&Chat.init();
  checkOffline();
  checkDaily();
  initInstallBtn();
  if(typeof PVP!=='undefined') PVP.init();
}

/* ---------------- particles ---------------- */

function spawnFloatingNum(x,y,text){
  const el=document.createElement('div');
  el.className='floating-num'; el.textContent=text;
  el.style.left=(x+(-34+Math.random()*68))+'px';
  el.style.top=(y-24)+'px';
  document.body.appendChild(el); setTimeout(()=>el.remove(),900);
}
function spawnJuice(x,y){
  for(let i=0;i<8;i++){
    const el=document.createElement('div'); el.className='juice';
    el.style.left=x+'px'; el.style.top=y+'px';
    el.style.setProperty('--jx',(-70+Math.random()*140)+'px');
    el.style.setProperty('--jy',(-95+Math.random()*40)+'px');
    el.style.width=el.style.height=(3+Math.random()*9)+'px';
    document.body.appendChild(el); setTimeout(()=>el.remove(),620);
  }
}

/* ---------------- starfield ---------------- */

function initSpace(){
  const cv=$('space'),ctx=cv.getContext('2d');
  const stars=[],N=140;
  function resize(){ cv.width=innerWidth; cv.height=innerHeight; }
  resize(); addEventListener('resize',resize);
  for(let i=0;i<N;i++) stars.push({x:Math.random(),y:Math.random(),r:Math.random()*1.6+0.3,a:Math.random()*Math.PI*2,sp:0.004+Math.random()*0.02});
  (function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    for(const s of stars){
      s.a+=s.sp;
      ctx.globalAlpha=0.15+((Math.sin(s.a)+1)/2)*0.85;
      ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(s.x*cv.width,s.y*cv.height,s.r,0,7); ctx.fill();
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(draw);
  })();
}

/* ---------------- click handlers ---------------- */

function onMelonClick(x,y){
  const now=Date.now();
  const winMs=3000+shopLvl('sh6')*1000;
  if(now<=G.comboUntil&&G.combo>0){ G.combo=Math.min(G.combo+1,G.comboMax); }
  else G.combo=1;
  G.comboMax=10+shopLvl('sh6')*5;
  G.comboUntil=now+winMs;
  G.save.maxCombo=Math.max(G.save.maxCombo||0,G.combo);
  const pow=clickPower();
  addMelons(pow);
  G.save.totalClicks++;
  gainXp(1);
  $('melonCount').textContent=fmtW(G.save.melons);
  spawnFloatingNum(x,y,'+'+fmtW(pow));
  spawnJuice(x,y);
  comboPulse(); beepClick();
  const el=$('melonBtn'); el.classList.add('press'); setTimeout(()=>el.classList.remove('press'),90);
  G.clickCryCounter++;
  if(G.evt&&G.evt.id==='crystal'&&G.clickCryCounter%30===0){ G.save.crystals++; refreshHud(); spawnFloatingNum(x,y-30,'+1 💎'); }
  dropCrateChance(0.004);
  if(G.tick%10===0) checkQuests(false);
}

function checkQuests(silent){
  const day=new Date().toDateString();
  if(G.save.dqDay!==day){ checkDaily(); }
  renderQuestTab();
  if(!silent){ for(const q of QUESTS){ if(!G.save.quests[q.id]&&q.need()){ renderQuestTab(); } } }
}

function updateStats(){
  $('melonCount').textContent=fmtW(G.save.melons);
  $('perSec').textContent=fmtW(effectivePerSec());
  $('perClick').textContent=fmtW(clickPower(false));
  updateComboUI(); updateBoostPill(); updateBuildings(); refreshHud();
}
function renderAll(){
  renderBuildings(); renderCartel(); renderUpgrades(); renderMarketplace(); renderRebuild(); renderShop();
  renderAchievements(); renderRankCard(); renderDaily(); updateStats();
  renderQuestTab(); renderCollection(); renderInventory();
  renderNotificationCenter();
  checkAchievements();
}
function reRenderPanels(){
  renderUpgrades(); renderMarketplace(); renderRebuild(); renderShop();
  if(document.querySelector('#tab-cartel.on')) renderCartel();
}

/* ---------------- whack-a-cartel ---------------- */

let whackRun=false,whackTimer=null,whackInterval=null,whackScore=0,whackEnd=0;
function initWhack(){
  const grid=$('whackGrid');
  if(!grid) return;
  grid.innerHTML='';
  for(let i=0;i<9;i++){
    const cell=document.createElement('div');
    cell.className='whack-cell';
    cell.dataset.i=i;
    cell.addEventListener('pointerdown',e=>{ e.preventDefault(); whackHit(i,cell); });
    grid.appendChild(cell);
  }
  $('whackStart').addEventListener('click',()=>{
    if(whackRun) return;
    whackRun=true; whackScore=0; whackEnd=Date.now()+15000;
    $('whackScore').textContent='0'; $('whackStart').textContent='GO!';
    if(window.scrollGameIntoView) window.scrollGameIntoView('.whack-grid');
    whackInterval=setInterval(whackSpawn,620);
    whackTimer=setInterval(()=>{
      const left=Math.max(0,Math.ceil((whackEnd-Date.now())/1000));
      $('whackTimer').textContent=left+'s';
      if(left<=0) whackEndGame();
    },200);
  });
}
function whackSpawn(){
  const cells=document.querySelectorAll('.whack-cell');
  const idx=Math.floor(Math.random()*cells.length);
  const cell=cells[idx];
  if(cell.querySelector('.wm-emoji')) return;
  const gold=Math.random()<0.16;
  const el=document.createElement('div');
  el.className='wm-emoji';
  el.textContent=gold?'☠️':'🥷';
  el.dataset.gold=gold?'1':'0';
  cell.appendChild(el);
  const life=gold?900:1200;
  setTimeout(()=>{ if(el.parentNode) el.remove(); },life);
}
function whackHit(i,cell){
  if(!whackRun) return;
  const el=cell.querySelector('.wm-emoji');
  if(!el) return;
  const gold=el.dataset.gold==='1';
  whackScore+=gold?5:1;
  $('whackScore').textContent=whackScore;
  cell.classList.add('smash');
  setTimeout(()=>cell.classList.remove('smash'),140);
  spawnJuice(cell.offsetLeft+cell.offsetWidth/2,cell.offsetTop+cell.offsetHeight/2);
  beepClick();
  el.remove();
}
function whackEndGame(){
  if(!whackRun) return;
  whackRun=false;
  clearInterval(whackInterval); clearInterval(whackTimer);
  document.querySelectorAll('.whack-cell .wm-emoji').forEach(el=>el.remove());
  $('whackStart').textContent='Start!';
  $('whackTimer').textContent='15s';
  whackFinish(whackScore);
}

/* ---------------- balloon pop ---------------- */

let balloonRun=false,balloonScore=0,balloonEnd=0,balloonIv=null,balloonTv=null;
function initBalloon(){
  const area=$('balloonArea');
  if(!area) return;
  $('balloonStart').addEventListener('click',()=>{
    if(balloonRun) return;
    balloonRun=true; balloonScore=0; balloonEnd=Date.now()+20000;
    $('balloonScore').textContent='0'; $('balloonTimer').textContent='20s';
    $('balloonStart').textContent='GO!';
    if(window.scrollGameIntoView) window.scrollGameIntoView('.balloon-area');
    balloonIv=setInterval(()=>spawnBalloon(),620);
    balloonTv=setInterval(()=>{
      const l=Math.max(0,Math.ceil((balloonEnd-Date.now())/1000));
      $('balloonTimer').textContent=l+'s';
      if(l<=0) balloonEndGame();
    },200);
  });
}
function spawnBalloon(){
  if(!balloonRun) return;
  const area=$('balloonArea'); if(!area) return;
  const n=1+Math.floor(Math.random()*2);
  for(let i=0;i<n;i++){
    const gold=Math.random()<0.18;
    const el=document.createElement('button');
    el.className='balloon'+(gold?' gold':'');
    el.textContent=gold?'🧊':'🎈';
    el.style.left=(8+Math.random()*84)+'%';
    el.style.bottom='-58px';
    el.style.animationDuration=(3400+Math.random()*1400)+'ms';
    el.addEventListener('pointerdown',e=>{ e.preventDefault(); popBalloon(el,gold); });
    area.appendChild(el);
    setTimeout(()=>{ if(el.parentNode) el.remove(); },(3400+Math.random()*1400));
  }
}
function popBalloon(el,gold){
  if(!balloonRun) return;
  balloonScore+=gold?5:1;
  $('balloonScore').textContent=balloonScore;
  spawnJuice(el.offsetLeft+el.offsetWidth/2,el.offsetTop+el.offsetHeight/2);
  beepClick();
  el.remove();
}
function balloonEndGame(){
  if(!balloonRun) return;
  balloonRun=false;
  clearInterval(balloonIv); clearInterval(balloonTv);
  document.querySelectorAll('#balloonArea .balloon').forEach(el=>el.remove());
  $('balloonStart').textContent='Start!';
  $('balloonTimer').textContent='20s';
  balloonFinish(balloonScore);
}
function balloonFinish(score){
  G.save.balloon.games=(G.save.balloon.games||0)+1;
  if(score>G.save.balloon.best) G.save.balloon.best=score;
  const mult=miniRewardMult();
  const m=Math.floor(score*4*mult);
  addMelons(m); gainXp(Math.floor(score/4*mult));
  if(score>=50) dropCrate(1);
  toast('Balloon run: +'+fmtW(m)+' product!','🎈');
  refreshHud(); checkAchievements(); checkQuests(true);
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}

/* ---------------- safehouse crack ---------------- */

let safeRun=false,safePos=0,safeDir=1,safeTarget=40,safeTargetSize=18,safeLocks=0,safeMisses=0,safeFrame=0,safeLast=0,safePrecision=0;
function initSafehouse(){
  const action=$('safeAction'); if(!action) return;
  action.addEventListener('click',()=>safeRun?safeAttempt():safeStart()); updateSafeUI();
}
function safeStart(){
  safeRun=true; safePos=0; safeDir=1; safeLocks=0; safeMisses=0; safePrecision=0; safeLast=performance.now();
  $('safeAction').textContent='🔓 Crack tumbler'; $('safeStatus').textContent='Tumbler one is moving… hit the green zone.';
  safeNewTarget(); updateSafeUI(); cancelAnimationFrame(safeFrame); safeFrame=requestAnimationFrame(safeTick);
}
function safeNewTarget(){ safeTarget=10+Math.random()*62; safeTargetSize=Math.max(10,18-safeLocks*3); }
function safeTick(now){
  if(!safeRun) return;
  const dt=Math.min(40,now-safeLast); safeLast=now; safePos+=safeDir*dt*(0.055+safeLocks*0.018);
  if(safePos>=100){ safePos=100; safeDir=-1; } if(safePos<=0){ safePos=0; safeDir=1; }
  updateSafeUI(); safeFrame=requestAnimationFrame(safeTick);
}
function safeAttempt(){
  if(!safeRun) return;
  const center=safeTarget+safeTargetSize/2, dist=Math.abs(safePos-center);
  if(safePos>=safeTarget&&safePos<=safeTarget+safeTargetSize){
    safeLocks++; safePrecision+=Math.max(0,100-Math.round(dist/(safeTargetSize/2)*100)); beepAch();
    $('safeStatus').textContent=safeLocks>=3?'All tumblers open!':'Clean hit. Next tumbler is faster.';
    if(safeLocks>=3){ safeFinish(true); return; } safeNewTarget();
  }else{
    safeMisses++; beepClick(); $('safeStatus').textContent='Missed it. '+(3-safeMisses)+' attempt'+(3-safeMisses===1?'':'s')+' left.';
    if(safeMisses>=3){ safeFinish(false); return; }
  }
  updateSafeUI();
}
function updateSafeUI(){
  if(!$('safeNeedle')) return;
  $('safeNeedle').style.left=safePos+'%'; $('safeTarget').style.left=safeTarget+'%'; $('safeTarget').style.width=safeTargetSize+'%';
  $('safeLocks').textContent=safeLocks+' / 3'; $('safeMisses').textContent=safeMisses+' / 3'; $('safeBest').textContent=G.save&&G.save.safe?G.save.safe.best:0;
  document.querySelectorAll('#safeLights i').forEach((el,i)=>el.classList.toggle('on',i<safeLocks));
}
function safeFinish(won){
  safeRun=false; cancelAnimationFrame(safeFrame); G.save.safe.games++;
  const score=safeLocks*100+Math.floor(safePrecision/3); G.save.safe.best=Math.max(G.save.safe.best,score);
  if(won){
    G.save.safe.wins++; const mult=miniRewardMult(), cash=Math.floor((700+score*12)*mult), cry=Math.max(1,Math.floor(score/120));
    addMelons(cash); addCrystals(cry); gainXp(12); dropCrate(1);
    $('safeStatus').textContent='SAFE OPEN · +'+fmtW(cash)+' product · +'+cry+' 💎 · +1 📦'; toast('Safehouse cracked! Rewards secured.','🔐');
  }else{
    const cash=Math.floor(safeLocks*250*miniRewardMult()); addMelons(cash); gainXp(safeLocks*2); $('safeStatus').textContent='Job blown. The crew escaped with '+fmtW(cash)+' product.';
  }
  $('safeAction').textContent='↻ Run another job'; updateSafeUI(); refreshHud(); checkAchievements(); checkQuests(true); Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}

/* ---------------- money wash ---------------- */

let washRun=false,washCleaned=0,washHeat=0,washEnd=0,washTimerIv=null,washCoolIv=null;
function initMoneyWash(){
  if(!$('washAction')) return;
  $('washAction').addEventListener('click',()=>washRun?washBatch():washStart()); $('washCool').addEventListener('click',washCoolDown); updateWashUI();
}
function washStart(){
  washRun=true; washCleaned=0; washHeat=0; washEnd=Date.now()+20000;
  $('washAction').textContent='💵 Clean batch'; $('washCool').disabled=false; $('washMode').textContent='RUNNING'; $('washStatus').textContent='Operation live. Watch the heat.'; updateWashUI();
  clearInterval(washTimerIv); clearInterval(washCoolIv);
  washTimerIv=setInterval(()=>{ if(Date.now()>=washEnd) washFinish(false); else updateWashUI(); },100);
  washCoolIv=setInterval(()=>{ washHeat=Math.max(0,washHeat-1.8); updateWashUI(); },300);
}
function washBatch(){
  if(!washRun) return;
  const batch=80+Math.floor(Math.random()*121); washCleaned+=batch; washHeat+=9+Math.random()*10;
  $('washCash').classList.remove('pulse'); void $('washCash').offsetWidth; $('washCash').classList.add('pulse'); beepBuy();
  if(washHeat>=100) washFinish(true); else updateWashUI();
}
function washCoolDown(){
  if(!washRun) return;
  washHeat=Math.max(0,washHeat-28); washEnd-=1200; $('washStatus').textContent='Crew laid low. Heat dropped, but time moved on.'; beepClick(); updateWashUI();
}
function updateWashUI(){
  if(!$('washHeatBar')) return;
  const left=washRun?Math.max(0,Math.ceil((washEnd-Date.now())/1000)):20;
  $('washTimer').textContent=left+'s'; $('washCleaned').textContent='$'+fmt(washCleaned); $('washBest').textContent='$'+fmt(G.save&&G.save.wash?G.save.wash.best:0);
  $('washHeatText').textContent=Math.min(100,Math.round(washHeat))+'%'; $('washHeatBar').style.width=Math.min(100,washHeat)+'%'; $('washHeatBar').classList.toggle('hot',washHeat>=70);
}
function washFinish(busted){
  if(!washRun) return;
  washRun=false; clearInterval(washTimerIv); clearInterval(washCoolIv); G.save.wash.games++;
  if(busted){ G.save.wash.busts++; washCleaned=Math.floor(washCleaned*.45); $('washStatus').textContent='BUSTED · 55% seized. The rest reached the empire.'; }
  else $('washStatus').textContent='CLEAN EXIT · The full shipment reached the empire.';
  G.save.wash.best=Math.max(G.save.wash.best,washCleaned);
  const reward=Math.floor(washCleaned*8*miniRewardMult()); addMelons(reward); gainXp(Math.floor(washCleaned/100));
  if(!busted&&washCleaned>=700) addCrystals(2); if(!busted&&washCleaned>=1000) dropCrate(1);
  toast((busted?'Heat got you: ':'Money washed: ')+'+'+fmtW(reward)+' product','💵');
  $('washAction').textContent='↻ Run another wash'; $('washCool').disabled=true; $('washMode').textContent=busted?'BUSTED':'CLEAN';
  updateWashUI(); refreshHud(); checkAchievements(); checkQuests(true); Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
}

/* ---------------- boss fights ---------------- */

const BOSSES=[
  {e:'🚔',name:'DEA Agent'},
  {e:'🚨',name:'Federal Raid'},
  {e:'🚓',name:'SWAT Team'},
  {e:'🛩️',name:'DEA Chopper'},
  {e:'☠️',name:'Rival Kingpin'}
];
let bossActive=false;
function bossNextDelay(){ return (45+Math.random()*35)*60000; }
function bossTierMult(){
  const k=G.save.bossKills||0;
  return 1+Math.max(0,k-3)*0.15+Math.min(3,k)*0.5;
}
function spawnBoss(){
  const b=G.save.boss, k=G.save.bossKills||0;
  const pick=BOSSES[Math.floor(Math.random()*BOSSES.length)];
  b.id='b'+(k+1)+'_'+Date.now();
  b.name=pick.name; b.emoji=pick.e;
  b.tier=k+1;
  const taps=45+25*Math.min(k,10);
  b.maxHp=Math.ceil(Math.max(50,clickPower()*taps)*(1+level('as9')*0.05)*(1+shopLvl('sh8')*0.25))*bossTierMult();
  b.hp=b.maxHp;
  b.fightUntil=Date.now()+90000;
  bossActive=true;
  updateBossUI();
  toast('BOSS '+pick.name+' attacks! '+pick.e+' Tap the boss to fight!','⚔️');
  beepGolden();
}
function bossHit(){
  if(!bossActive||!G.save.boss.hp) return;
  G.save.boss.hp=Math.max(0,G.save.boss.hp-clickPower());
  updateBossUI();
  spawnJuice(innerWidth/2,innerHeight-190);
  beepClick();
  if(G.save.boss.hp<=0) bossDead();
}
function bossDead(){
  const b=G.save.boss;
  G.save.bossKills=(G.save.bossKills||0)+1;
  bossActive=false;
  const cry=Math.max(1,Math.floor(b.tier*(2+level('as9')*0.4)*(1+shopLvl('sh8')*0.2)));
  addCrystals(cry); gainXp(15+b.tier*3);
  const drops=Math.floor(1+b.tier*0.5);
  dropCrate(drops);
  toast('Boss defeated! +'+cry+' 💎 +'+drops+' 📦!','👑');
  beepRebuild();
  refreshHud(); checkAchievements(); checkQuests(true);
  Leaderboard&&Leaderboard.bump&&Leaderboard.bump();
  $('bossWrap').classList.add('hidden');
  G.save.boss.nextAt=Date.now()+bossNextDelay();
  updateBossTimer();
}
function updateBossUI(){
  const w=$('bossWrap'); if(!w) return;
  const b=G.save.boss;
  if(!bossActive){ w.classList.add('hidden'); return; }
  w.classList.remove('hidden');
  $('bossEmoji').textContent=b.emoji;
  $('bossName').textContent=b.name+' · T'+b.tier;
  const pct=clamp(b.hp/b.maxHp*100,0,100);
  $('bossHP').style.width=pct+'%';
}
function updateBossTimer(){
  const t=$('bossTimer');
  if(!t) return;
  if(bossActive&&G.save.boss.hp>0){
    t.textContent='⏱ '+fmtDur(Math.max(0,(G.save.boss.fightUntil-Date.now())/1000));
  }else{
    t.textContent='in '+fmtDur(Math.max(0,(G.save.boss.nextAt-Date.now())/1000));
  }
}
function initBoss(){
  const w=$('bossWrap'); if(!w) return;
  w.addEventListener('pointerdown',e=>{ e.preventDefault(); bossHit(); });
}
function bossTick(){
  const now=Date.now(), b=G.save.boss;
  if(bossActive){
    if(G.tick%2===0) updateBossTimer();
    if(b.hp>0&&now>G.save.boss.fightUntil){
      const w=$('bossWrap');
      if(w&&!w.classList.contains('hidden')){
        w.classList.add('hidden'); bossActive=false;
        toast('The boss got away! '+b.emoji,'💨');
        G.save.boss.nextAt=now+bossNextDelay();
      }
    }
    return;
  }
  if(b.hp>0){
    if(now>b.fightUntil){
      b.hp=0; b.maxHp=0; b.id=null; b.fightUntil=0;
      b.nextAt=now+bossNextDelay();
      saveGame();
    }else{
      bossActive=true;
      updateBossUI();
    }
    return;
  }
  if(now>=b.nextAt&&G.save.name) spawnBoss();
  if(G.tick%5===0) updateBossTimer();
}
function openTutorial(){ openModal('veilTutorial'); }
function closeTutorial(){ closeModal('veilTutorial'); }

/* ---------------- live build updates ---------------- */

let updateReloading=false;
async function checkForBuildUpdate(){
  if(updateReloading) return;
  try{
    const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'}); if(!r.ok) return;
    const data=await r.json(); if(!data.version||data.version===BUILD_VERSION) return;
    updateReloading=true; toast('New build v'+data.version+' ready — updating automatically…','🔄'); saveGame();
    setTimeout(()=>{ const url=new URL(location.href); url.searchParams.set('build',data.build||data.version); location.replace(url.toString()); },2500);
  }catch(e){}
}
function initLiveUpdates(){ $('buildVersion')&&($('buildVersion').textContent='v'+BUILD_VERSION); setTimeout(checkForBuildUpdate,8000); setInterval(checkForBuildUpdate,60000); }

/* ---------------- main loop ---------------- */

function tick(){
  const now=Date.now(), dt=(now-G.last)/1000; G.last=now;
  const per=effectivePerSec();
  if(per>0) addMelons(per*dt);
  gainXp(Math.max(0,Math.log10(1+per)*2*dt));
  if(G.combo>0&&now>G.comboUntil){ G.combo=0; updateComboUI(); }
  G.tick++;
  if(G.tick%5===0) updateStats();
  if(G.tick%20===0){ checkAchievements(); renderAchievements(); renderRankCard(); checkQuests(true); }
  if(G.tick%100===0) reRenderPanels();
  if(G.tick%100===0){ if(typeof Leaderboard!=='undefined') Leaderboard.throttledSubmit(); }
  if(G.tick%200===0) saveGame();
  if(G.tick%10===0) updateEventBanner();
  bossTick();
  EVENTS_API.tick();
  if(typeof PVP!=='undefined') PVP.tick();
}

function bindEvents(){
  const mb=$('melonBtn');
  mb.addEventListener('pointerdown',e=>{
    e.preventDefault();
    onMelonClick(e.clientX,e.clientY);
  });
  mb.addEventListener('contextmenu',e=>e.preventDefault());

  $('goldenMelon').addEventListener('pointerdown',e=>{ e.preventDefault(); e.stopPropagation(); clickGolden(); });

  $('buyToggle').addEventListener('click',e=>{
    const t=e.target.closest('button'); if(t) setBuyMult(+t.dataset.n);
  });
  $('growTabs').addEventListener('click',e=>{
    const t=e.target.closest('button'); if(t) switchGrowTab(t.dataset.tab);
  });
  $('miniTabs').addEventListener('click',e=>{
    const t=e.target.closest('button'); if(t) switchMiniTab(t.dataset.m);
  });
  document.addEventListener('keydown',e=>{
    if(e.code==='Space'&&!(e.target.matches&&e.target.matches('input,button,textarea'))){ e.preventDefault(); onMelonClick(innerWidth/2,innerHeight/3); }
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){ saveGame(); if(typeof Leaderboard!=='undefined') Leaderboard.submit(); }
  });
  window.addEventListener('beforeunload',()=>{ saveGame(); if(typeof Leaderboard!=='undefined') Leaderboard.submit(); });
}

function startGame(){
  loadGame();
  initSpace();
  bindEvents();
  initRoulette();
  initWhack();
  initBoss();
  initBalloon();
  initSafehouse();
  initMoneyWash();
  initLiveUpdates();
  renderAll();
  scheduleGolden(25000);
  postBoot();
  if(typeof Fishing!=='undefined') Fishing.init();
  setInterval(tick,100);
}
window.openTutorial=openTutorial;
window.closeTutorial=closeTutorial;
buildGeneratedQuests();
document.addEventListener('DOMContentLoaded',startGame);
