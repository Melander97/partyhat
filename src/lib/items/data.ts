import type { Item } from '@/types/item';

/**
 * Curated list of OSRS items for Phase 1.
 * A mix of iconic high-value items, mid-tier gear, common consumables, and basic resources.
 * Prices are approximate as of late 2024 \u2014 these are static placeholders until Phase 2
 * swaps in live data from the OSRS Wiki Real-time Prices API.
 *
 * Item icons are hotlinked from the OSRS Wiki, which permits this usage.
 * Icon URL pattern: https://oldschool.runescape.wiki/images/{Item_name}.png?{cache_id}
 * In Phase 2 we'll resolve icon URLs from the API mapping.
 */
export const ITEMS: Item[] = [
  // === Iconic high-value items ===
  {
    id: 1038,
    name: 'Red partyhat',
    price: 2_400_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Red_partyhat.png',
  },
  {
    id: 1040,
    name: 'Yellow partyhat',
    price: 1_800_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Yellow_partyhat.png',
  },
  {
    id: 1042,
    name: 'Blue partyhat',
    price: 2_100_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Blue_partyhat.png',
  },
  {
    id: 1044,
    name: 'Green partyhat',
    price: 1_700_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Green_partyhat.png',
  },
  {
    id: 1046,
    name: 'Purple partyhat',
    price: 1_900_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Purple_partyhat.png',
  },
  {
    id: 1048,
    name: 'White partyhat',
    price: 1_600_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/White_partyhat.png',
  },
  {
    id: 10330,
    name: '3rd age robe top',
    price: 1_950_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/3rd_age_robe_top.png',
  },
  {
    id: 10334,
    name: '3rd age pickaxe',
    price: 950_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/3rd_age_pickaxe.png',
  },
  {
    id: 23185,
    name: 'Twisted bow',
    price: 1_750_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Twisted_bow.png',
  },
  {
    id: 22325,
    name: 'Scythe of vitur',
    price: 950_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Scythe_of_vitur.png',
  },

  // === High-value gear ===
  {
    id: 11802,
    name: 'Armadyl godsword',
    price: 19_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Armadyl_godsword.png',
  },
  {
    id: 11804,
    name: 'Bandos godsword',
    price: 600_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Bandos_godsword.png',
  },
  {
    id: 11806,
    name: 'Saradomin godsword',
    price: 8_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Saradomin_godsword.png',
  },
  {
    id: 11808,
    name: 'Zamorak godsword',
    price: 350_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Zamorak_godsword.png',
  },
  {
    id: 4151,
    name: 'Abyssal whip',
    price: 1_500_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Abyssal_whip.png',
  },
  {
    id: 12006,
    name: 'Abyssal tentacle',
    price: 9_500_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Abyssal_tentacle.png',
  },
  {
    id: 21015,
    name: 'Dragon hunter lance',
    price: 60_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_hunter_lance.png',
  },
  {
    id: 22324,
    name: 'Ghrazi rapier',
    price: 90_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Ghrazi_rapier.png',
  },
  {
    id: 13652,
    name: 'Dragon claws',
    price: 100_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_claws.png',
  },

  // === Mid-tier gear ===
  {
    id: 1149,
    name: 'Dragon med helm',
    price: 60_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_med_helm.png',
  },
  {
    id: 1187,
    name: 'Dragon sq shield',
    price: 250_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_sq_shield.png',
  },
  {
    id: 1377,
    name: 'Dragon battleaxe',
    price: 120_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_battleaxe.png',
  },
  {
    id: 4587,
    name: 'Dragon scimitar',
    price: 60_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_scimitar.png',
  },
  {
    id: 1305,
    name: 'Dragon longsword',
    price: 60_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_longsword.png',
  },
  {
    id: 1215,
    name: 'Dragon dagger',
    price: 17_500,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_dagger.png',
  },
  {
    id: 7158,
    name: 'Dragon 2h sword',
    price: 150_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_2h_sword.png',
  },
  {
    id: 11335,
    name: 'Dragon full helm',
    price: 12_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_full_helm.png',
  },
  {
    id: 1127,
    name: 'Rune platebody',
    price: 38_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Rune_platebody.png',
  },
  {
    id: 1163,
    name: 'Rune full helm',
    price: 19_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Rune_full_helm.png',
  },
  {
    id: 1333,
    name: 'Rune scimitar',
    price: 15_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Rune_scimitar.png',
  },
  {
    id: 1303,
    name: 'Mithril longsword',
    price: 800,
    iconUrl: 'https://oldschool.runescape.wiki/images/Mithril_longsword.png',
  },
  {
    id: 1117,
    name: 'Steel platebody',
    price: 1_200,
    iconUrl: 'https://oldschool.runescape.wiki/images/Steel_platebody.png',
  },

  // === Magic gear ===
  {
    id: 4675,
    name: 'Ancient staff',
    price: 35_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Ancient_staff.png',
  },
  {
    id: 6914,
    name: 'Master wand',
    price: 200_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Master_wand.png',
  },
  {
    id: 11791,
    name: 'Staff of the dead',
    price: 8_500_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Staff_of_the_dead.png',
  },
  {
    id: 12904,
    name: 'Toxic staff of the dead',
    price: 4_500_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Toxic_staff_of_the_dead.png',
  },
  {
    id: 11907,
    name: 'Trident of the seas',
    price: 200_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Trident_of_the_seas.png',
  },
  {
    id: 12899,
    name: 'Trident of the swamp',
    price: 600_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Trident_of_the_swamp.png',
  },
  {
    id: 20997,
    name: "Ahrim's robetop",
    price: 2_500_000,
    iconUrl: "https://oldschool.runescape.wiki/images/Ahrim's_robetop.png",
  },

  // === Ranged gear ===
  {
    id: 861,
    name: 'Magic shortbow',
    price: 1_500,
    iconUrl: 'https://oldschool.runescape.wiki/images/Magic_shortbow.png',
  },
  {
    id: 11785,
    name: 'Armadyl crossbow',
    price: 30_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Armadyl_crossbow.png',
  },
  {
    id: 9185,
    name: 'Rune crossbow',
    price: 35_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Rune_crossbow.png',
  },
  {
    id: 11235,
    name: 'Dark bow',
    price: 80_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dark_bow.png',
  },
  {
    id: 20997,
    name: "Karil's crossbow",
    price: 200_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Karil%27s_crossbow.png',
  },

  // === Boots, gloves, capes ===
  {
    id: 11840,
    name: 'Dragon boots',
    price: 200_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_boots.png',
  },
  {
    id: 13239,
    name: 'Primordial boots',
    price: 30_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Primordial_boots.png',
  },
  {
    id: 11732,
    name: 'Pegasian boots',
    price: 35_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Pegasian_boots.png',
  },
  {
    id: 12612,
    name: 'Eternal boots',
    price: 5_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Eternal_boots.png',
  },
  {
    id: 6570,
    name: 'Fire cape',
    price: 8_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Fire_cape.png',
  },
  {
    id: 21295,
    name: 'Infernal cape',
    price: 8_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Infernal_cape.png',
  },
  {
    id: 21043,
    name: 'Ferocious gloves',
    price: 5_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Ferocious_gloves.png',
  },

  // === Amulets & rings ===
  {
    id: 6585,
    name: 'Amulet of fury',
    price: 2_500_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Amulet_of_fury.png',
  },
  {
    id: 19553,
    name: 'Amulet of torture',
    price: 12_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Amulet_of_torture.png',
  },
  {
    id: 19547,
    name: 'Necklace of anguish',
    price: 9_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Necklace_of_anguish.png',
  },
  {
    id: 19544,
    name: 'Tormented bracelet',
    price: 13_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Tormented_bracelet.png',
  },
  {
    id: 11128,
    name: 'Berserker ring',
    price: 2_500_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Berserker_ring.png',
  },
  {
    id: 6737,
    name: 'Berserker ring (i)',
    price: 5_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Berserker_ring_%28i%29.png',
  },

  // === Food ===
  {
    id: 379,
    name: 'Lobster',
    price: 250,
    iconUrl: 'https://oldschool.runescape.wiki/images/Lobster.png',
  },
  {
    id: 385,
    name: 'Shark',
    price: 800,
    iconUrl: 'https://oldschool.runescape.wiki/images/Shark.png',
  },
  {
    id: 361,
    name: 'Tuna',
    price: 100,
    iconUrl: 'https://oldschool.runescape.wiki/images/Tuna.png',
  },
  {
    id: 373,
    name: 'Swordfish',
    price: 250,
    iconUrl: 'https://oldschool.runescape.wiki/images/Swordfish.png',
  },
  {
    id: 7946,
    name: 'Monkfish',
    price: 400,
    iconUrl: 'https://oldschool.runescape.wiki/images/Monkfish.png',
  },
  {
    id: 391,
    name: 'Manta ray',
    price: 1_400,
    iconUrl: 'https://oldschool.runescape.wiki/images/Manta_ray.png',
  },
  {
    id: 3144,
    name: 'Karambwan',
    price: 500,
    iconUrl: 'https://oldschool.runescape.wiki/images/Karambwan.png',
  },
  {
    id: 333,
    name: 'Trout',
    price: 30,
    iconUrl: 'https://oldschool.runescape.wiki/images/Trout.png',
  },
  {
    id: 329,
    name: 'Salmon',
    price: 50,
    iconUrl: 'https://oldschool.runescape.wiki/images/Salmon.png',
  },
  { id: 339, name: 'Cod', price: 40, iconUrl: 'https://oldschool.runescape.wiki/images/Cod.png' },
  {
    id: 319,
    name: 'Anchovies',
    price: 35,
    iconUrl: 'https://oldschool.runescape.wiki/images/Anchovies.png',
  },
  {
    id: 315,
    name: 'Shrimps',
    price: 25,
    iconUrl: 'https://oldschool.runescape.wiki/images/Shrimps.png',
  },
  {
    id: 1965,
    name: 'Cabbage',
    price: 50,
    iconUrl: 'https://oldschool.runescape.wiki/images/Cabbage.png',
  },

  // === Potions ===
  {
    id: 12695,
    name: 'Super combat potion(4)',
    price: 14_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Super_combat_potion%284%29.png',
  },
  {
    id: 6685,
    name: 'Saradomin brew(4)',
    price: 6_500,
    iconUrl: 'https://oldschool.runescape.wiki/images/Saradomin_brew%284%29.png',
  },
  {
    id: 3024,
    name: 'Super restore(4)',
    price: 11_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Super_restore%284%29.png',
  },
  {
    id: 2436,
    name: 'Strength potion(4)',
    price: 350,
    iconUrl: 'https://oldschool.runescape.wiki/images/Strength_potion%284%29.png',
  },
  {
    id: 12626,
    name: 'Ranging potion(4)',
    price: 9_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Ranging_potion%284%29.png',
  },
  {
    id: 2434,
    name: 'Prayer potion(4)',
    price: 9_500,
    iconUrl: 'https://oldschool.runescape.wiki/images/Prayer_potion%284%29.png',
  },
  {
    id: 12881,
    name: 'Antifire(4)',
    price: 5_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Antifire%284%29.png',
  },

  // === Resources & raw materials ===
  {
    id: 440,
    name: 'Iron ore',
    price: 100,
    iconUrl: 'https://oldschool.runescape.wiki/images/Iron_ore.png',
  },
  {
    id: 444,
    name: 'Gold ore',
    price: 250,
    iconUrl: 'https://oldschool.runescape.wiki/images/Gold_ore.png',
  },
  {
    id: 447,
    name: 'Mithril ore',
    price: 150,
    iconUrl: 'https://oldschool.runescape.wiki/images/Mithril_ore.png',
  },
  {
    id: 449,
    name: 'Adamantite ore',
    price: 950,
    iconUrl: 'https://oldschool.runescape.wiki/images/Adamantite_ore.png',
  },
  {
    id: 451,
    name: 'Runite ore',
    price: 11_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Runite_ore.png',
  },
  {
    id: 1515,
    name: 'Yew logs',
    price: 100,
    iconUrl: 'https://oldschool.runescape.wiki/images/Yew_logs.png',
  },
  {
    id: 1513,
    name: 'Magic logs',
    price: 1_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Magic_logs.png',
  },
  {
    id: 19669,
    name: 'Redwood logs',
    price: 350,
    iconUrl: 'https://oldschool.runescape.wiki/images/Redwood_logs.png',
  },
  {
    id: 1779,
    name: 'Flax',
    price: 30,
    iconUrl: 'https://oldschool.runescape.wiki/images/Flax.png',
  },
  {
    id: 1777,
    name: 'Bow string',
    price: 200,
    iconUrl: 'https://oldschool.runescape.wiki/images/Bow_string.png',
  },

  // === Runes ===
  {
    id: 554,
    name: 'Fire rune',
    price: 5,
    iconUrl: 'https://oldschool.runescape.wiki/images/Fire_rune.png',
  },
  {
    id: 556,
    name: 'Air rune',
    price: 4,
    iconUrl: 'https://oldschool.runescape.wiki/images/Air_rune.png',
  },
  {
    id: 558,
    name: 'Mind rune',
    price: 5,
    iconUrl: 'https://oldschool.runescape.wiki/images/Mind_rune.png',
  },
  {
    id: 560,
    name: 'Death rune',
    price: 200,
    iconUrl: 'https://oldschool.runescape.wiki/images/Death_rune.png',
  },
  {
    id: 565,
    name: 'Blood rune',
    price: 280,
    iconUrl: 'https://oldschool.runescape.wiki/images/Blood_rune.png',
  },
  {
    id: 21880,
    name: 'Wrath rune',
    price: 500,
    iconUrl: 'https://oldschool.runescape.wiki/images/Wrath_rune.png',
  },
  {
    id: 4694,
    name: 'Lava rune',
    price: 7,
    iconUrl: 'https://oldschool.runescape.wiki/images/Lava_rune.png',
  },

  // === Herbs (clean) ===
  {
    id: 207,
    name: 'Clean ranarr',
    price: 7_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Clean_ranarr.png',
  },
  {
    id: 3000,
    name: 'Clean snapdragon',
    price: 11_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Clean_snapdragon.png',
  },
  {
    id: 219,
    name: 'Clean torstol',
    price: 8_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Clean_torstol.png',
  },
  {
    id: 215,
    name: 'Clean lantadyme',
    price: 1_500,
    iconUrl: 'https://oldschool.runescape.wiki/images/Clean_lantadyme.png',
  },
  {
    id: 209,
    name: 'Clean irit',
    price: 750,
    iconUrl: 'https://oldschool.runescape.wiki/images/Clean_irit.png',
  },
  {
    id: 199,
    name: 'Clean guam',
    price: 25,
    iconUrl: 'https://oldschool.runescape.wiki/images/Clean_guam.png',
  },

  // === Treasure Trail / quest rewards ===
  {
    id: 19724,
    name: 'Ranger boots',
    price: 30_000_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Ranger_boots.png',
  },
  {
    id: 10394,
    name: 'Spinning plate',
    price: 250_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Spinning_plate.png',
  },
  {
    id: 24201,
    name: 'Gilded scimitar',
    price: 2_500_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Gilded_scimitar.png',
  },

  // === Skilling cosmetics & misc ===
  {
    id: 1391,
    name: 'Magic staff',
    price: 200,
    iconUrl: 'https://oldschool.runescape.wiki/images/Magic_staff.png',
  },
  {
    id: 1925,
    name: 'Bucket',
    price: 25,
    iconUrl: 'https://oldschool.runescape.wiki/images/Bucket.png',
  },
  {
    id: 1265,
    name: 'Bronze pickaxe',
    price: 30,
    iconUrl: 'https://oldschool.runescape.wiki/images/Bronze_pickaxe.png',
  },
  {
    id: 1267,
    name: 'Iron pickaxe',
    price: 120,
    iconUrl: 'https://oldschool.runescape.wiki/images/Iron_pickaxe.png',
  },
  {
    id: 1349,
    name: 'Iron axe',
    price: 90,
    iconUrl: 'https://oldschool.runescape.wiki/images/Iron_axe.png',
  },
  {
    id: 314,
    name: 'Feather',
    price: 4,
    iconUrl: 'https://oldschool.runescape.wiki/images/Feather.png',
  },
  {
    id: 1511,
    name: 'Logs',
    price: 30,
    iconUrl: 'https://oldschool.runescape.wiki/images/Logs.png',
  },

  // === Bones (for prayer) ===
  {
    id: 526,
    name: 'Bones',
    price: 100,
    iconUrl: 'https://oldschool.runescape.wiki/images/Bones.png',
  },
  {
    id: 532,
    name: 'Big bones',
    price: 250,
    iconUrl: 'https://oldschool.runescape.wiki/images/Big_bones.png',
  },
  {
    id: 536,
    name: 'Dragon bones',
    price: 3_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Dragon_bones.png',
  },
  {
    id: 22124,
    name: 'Superior dragon bones',
    price: 9_000,
    iconUrl: 'https://oldschool.runescape.wiki/images/Superior_dragon_bones.png',
  },
  {
    id: 4812,
    name: 'Ourg bones',
    price: 1_200,
    iconUrl: 'https://oldschool.runescape.wiki/images/Ourg_bones.png',
  },
];
