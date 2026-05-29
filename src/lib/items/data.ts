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
  { id: 1038, name: 'Red partyhat', price: 2_400_000_000, iconUrl: '/items/1038.png' },
  { id: 1040, name: 'Yellow partyhat', price: 1_800_000_000, iconUrl: '/items/1040.png' },
  { id: 1042, name: 'Blue partyhat', price: 2_100_000_000, iconUrl: '/items/1042.png' },
  { id: 1044, name: 'Green partyhat', price: 1_700_000_000, iconUrl: '/items/1044.png' },
  { id: 1046, name: 'Purple partyhat', price: 1_900_000_000, iconUrl: '/items/1046.png' },
  { id: 1048, name: 'White partyhat', price: 1_600_000_000, iconUrl: '/items/1048.png' },
  { id: 10330, name: '3rd age robe top', price: 1_950_000_000, iconUrl: '/items/10330.png' },
  { id: 10334, name: '3rd age pickaxe', price: 950_000_000, iconUrl: '/items/10334.png' },
  { id: 23185, name: 'Twisted bow', price: 1_750_000_000, iconUrl: '/items/23185.png' },
  { id: 22325, name: 'Scythe of vitur', price: 950_000_000, iconUrl: '/items/22325.png' },

  // === High-value gear ===
  { id: 11802, name: 'Armadyl godsword', price: 19_000_000, iconUrl: '/items/11802.png' },
  { id: 11804, name: 'Bandos godsword', price: 600_000, iconUrl: '/items/11804.png' },
  { id: 11806, name: 'Saradomin godsword', price: 8_000_000, iconUrl: '/items/11806.png' },
  { id: 11808, name: 'Zamorak godsword', price: 350_000, iconUrl: '/items/11808.png' },
  { id: 4151, name: 'Abyssal whip', price: 1_500_000, iconUrl: '/items/4151.png' },
  { id: 12006, name: 'Abyssal tentacle', price: 9_500_000, iconUrl: '/items/12006.png' },
  { id: 21015, name: 'Dragon hunter lance', price: 60_000_000, iconUrl: '/items/21015.png' },
  { id: 22324, name: 'Ghrazi rapier', price: 90_000_000, iconUrl: '/items/22324.png' },
  { id: 13652, name: 'Dragon claws', price: 100_000_000, iconUrl: '/items/13652.png' },

  // === Mid-tier gear ===
  { id: 1149, name: 'Dragon med helm', price: 60_000, iconUrl: '/items/1149.png' },
  { id: 1187, name: 'Dragon sq shield', price: 250_000, iconUrl: '/items/1187.png' },
  { id: 1377, name: 'Dragon battleaxe', price: 120_000, iconUrl: '/items/1377.png' },
  { id: 4587, name: 'Dragon scimitar', price: 60_000, iconUrl: '/items/4587.png' },
  { id: 1305, name: 'Dragon longsword', price: 60_000, iconUrl: '/items/1305.png' },
  { id: 1215, name: 'Dragon dagger', price: 17_500, iconUrl: '/items/1215.png' },
  { id: 7158, name: 'Dragon 2h sword', price: 150_000, iconUrl: '/items/7158.png' },
  { id: 11335, name: 'Dragon full helm', price: 12_000_000, iconUrl: '/items/11335.png' },
  { id: 1127, name: 'Rune platebody', price: 38_000, iconUrl: '/items/1127.png' },
  { id: 1163, name: 'Rune full helm', price: 19_000, iconUrl: '/items/1163.png' },
  { id: 1333, name: 'Rune scimitar', price: 15_000, iconUrl: '/items/1333.png' },
  { id: 1303, name: 'Mithril longsword', price: 800, iconUrl: '/items/1303.png' },
  { id: 1117, name: 'Steel platebody', price: 1_200, iconUrl: '/items/1117.png' },

  // === Magic gear ===
  { id: 4675, name: 'Ancient staff', price: 35_000, iconUrl: '/items/4675.png' },
  { id: 6914, name: 'Master wand', price: 200_000, iconUrl: '/items/6914.png' },
  { id: 11791, name: 'Staff of the dead', price: 8_500_000, iconUrl: '/items/11791.png' },
  { id: 12904, name: 'Toxic staff of the dead', price: 4_500_000, iconUrl: '/items/12904.png' },
  { id: 11907, name: 'Trident of the seas', price: 200_000, iconUrl: '/items/11907.png' },
  { id: 12899, name: 'Trident of the swamp', price: 600_000, iconUrl: '/items/12899.png' },
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
    iconUrl: '/items/20997.png',
  },
  { id: 11785, name: 'Armadyl crossbow', price: 30_000_000, iconUrl: '/items/11785.png' },
  { id: 9185, name: 'Rune crossbow', price: 35_000, iconUrl: '/items/9185.png' },
  { id: 11235, name: 'Dark bow', price: 80_000, iconUrl: '/items/11235.png' },
  { id: 20997, name: "Karil's crossbow", price: 200_000, iconUrl: '/items/20997.png' },

  // === Boots, gloves, capes ===
  { id: 11840, name: 'Dragon boots', price: 200_000, iconUrl: '/items/11840.png' },
  { id: 13239, name: 'Primordial boots', price: 30_000_000, iconUrl: '/items/13239.png' },
  { id: 11732, name: 'Pegasian boots', price: 35_000_000, iconUrl: '/items/11732.png' },
  { id: 12612, name: 'Eternal boots', price: 5_000_000, iconUrl: '/items/12612.png' },
  { id: 6570, name: 'Fire cape', price: 8_000, iconUrl: '/items/6570.png' },
  { id: 21295, name: 'Infernal cape', price: 8_000, iconUrl: '/items/21295.png' },
  { id: 21043, name: 'Ferocious gloves', price: 5_000_000, iconUrl: '/items/21043.png' },

  // === Amulets & rings ===
  { id: 6585, name: 'Amulet of fury', price: 2_500_000, iconUrl: '/items/6585.png' },
  { id: 19553, name: 'Amulet of torture', price: 12_000_000, iconUrl: '/items/19553.png' },
  { id: 19547, name: 'Necklace of anguish', price: 9_000_000, iconUrl: '/items/19547.png' },
  { id: 19544, name: 'Tormented bracelet', price: 13_000_000, iconUrl: '/items/19544.png' },
  { id: 11128, name: 'Berserker ring', price: 2_500_000, iconUrl: '/items/11128.png' },
  { id: 6737, name: 'Berserker ring (i)', price: 5_000_000, iconUrl: '/items/6737.png' },

  // === Food ===
  { id: 379, name: 'Lobster', price: 250, iconUrl: '/items/379.png' },
  { id: 385, name: 'Shark', price: 800, iconUrl: '/items/385.png' },
  { id: 361, name: 'Tuna', price: 100, iconUrl: '/items/361.png' },
  { id: 373, name: 'Swordfish', price: 250, iconUrl: '/items/373.png' },
  { id: 7946, name: 'Monkfish', price: 400, iconUrl: '/items/7946.png' },
  { id: 391, name: 'Manta ray', price: 1_400, iconUrl: '/items/391.png' },
  { id: 3144, name: 'Karambwan', price: 500, iconUrl: '/items/3144.png' },
  { id: 333, name: 'Trout', price: 30, iconUrl: '/items/333.png' },
  { id: 329, name: 'Salmon', price: 50, iconUrl: '/items/329.png' },
  { id: 339, name: 'Cod', price: 40, iconUrl: '/items/339.png' },
  { id: 319, name: 'Anchovies', price: 35, iconUrl: '/items/319.png' },
  { id: 315, name: 'Shrimps', price: 25, iconUrl: '/items/315.png' },
  { id: 1965, name: 'Cabbage', price: 50, iconUrl: '/items/1965.png' },

  // === Potions ===
  { id: 12695, name: 'Super combat potion(4)', price: 14_000, iconUrl: '/items/12695.png' },
  { id: 6685, name: 'Saradomin brew(4)', price: 6_500, iconUrl: '/items/6685.png' },
  { id: 3024, name: 'Super restore(4)', price: 11_000, iconUrl: '/items/3024.png' },
  { id: 2436, name: 'Strength potion(4)', price: 350, iconUrl: '/items/2436.png' },
  { id: 12626, name: 'Ranging potion(4)', price: 9_000, iconUrl: '/items/12626.png' },
  { id: 2434, name: 'Prayer potion(4)', price: 9_500, iconUrl: '/items/2434.png' },
  { id: 12881, name: 'Antifire(4)', price: 5_000, iconUrl: '/items/12881.png' },

  // === Resources & raw materials ===
  { id: 440, name: 'Iron ore', price: 100, iconUrl: '/items/440.png' },
  { id: 444, name: 'Gold ore', price: 250, iconUrl: '/items/444.png' },
  { id: 447, name: 'Mithril ore', price: 150, iconUrl: '/items/447.png' },
  { id: 449, name: 'Adamantite ore', price: 950, iconUrl: '/items/449.png' },
  { id: 451, name: 'Runite ore', price: 11_000, iconUrl: '/items/451.png' },
  { id: 1515, name: 'Yew logs', price: 100, iconUrl: '/items/1515.png' },
  { id: 1513, name: 'Magic logs', price: 1_000, iconUrl: '/items/1513.png' },
  { id: 19669, name: 'Redwood logs', price: 350, iconUrl: '/items/19669.png' },
  { id: 1779, name: 'Flax', price: 30, iconUrl: '/items/1779.png' },
  { id: 1777, name: 'Bow string', price: 200, iconUrl: '/items/1777.png' },

  // === Runes ===
  { id: 554, name: 'Fire rune', price: 5, iconUrl: '/items/554.png' },
  { id: 556, name: 'Air rune', price: 4, iconUrl: '/items/556.png' },
  { id: 558, name: 'Mind rune', price: 5, iconUrl: '/items/558.png' },
  { id: 560, name: 'Death rune', price: 200, iconUrl: '/items/560.png' },
  { id: 565, name: 'Blood rune', price: 280, iconUrl: '/items/565.png' },
  { id: 21880, name: 'Wrath rune', price: 500, iconUrl: '/items/21880.png' },
  { id: 4694, name: 'Lava rune', price: 7, iconUrl: '/items/4694.png' },

  // === Herbs (clean) ===
  { id: 207, name: 'Clean ranarr', price: 7_000, iconUrl: '/items/207.png' },
  { id: 3000, name: 'Clean snapdragon', price: 11_000, iconUrl: '/items/3000.png' },
  { id: 219, name: 'Clean torstol', price: 8_000, iconUrl: '/items/219.png' },
  { id: 215, name: 'Clean lantadyme', price: 1_500, iconUrl: '/items/215.png' },
  { id: 209, name: 'Clean irit', price: 750, iconUrl: '/items/209.png' },
  { id: 199, name: 'Clean guam', price: 25, iconUrl: '/items/199.png' },

  // === Treasure Trail / quest rewards ===
  { id: 19724, name: 'Ranger boots', price: 30_000_000, iconUrl: '/items/19724.png' },
  { id: 10394, name: 'Spinning plate', price: 250_000, iconUrl: '/items/10394.png' },
  { id: 24201, name: 'Gilded scimitar', price: 2_500_000, iconUrl: '/items/24201.png' },

  // === Skilling cosmetics & misc ===
  { id: 1391, name: 'Magic staff', price: 200, iconUrl: '/items/1391.png' },
  { id: 1925, name: 'Bucket', price: 25, iconUrl: '/items/1925.png' },
  { id: 1265, name: 'Bronze pickaxe', price: 30, iconUrl: '/items/1265.png' },
  { id: 1267, name: 'Iron pickaxe', price: 120, iconUrl: '/items/1267.png' },
  { id: 1349, name: 'Iron axe', price: 90, iconUrl: '/items/1349.png' },
  { id: 314, name: 'Feather', price: 4, iconUrl: '/items/314.png' },
  { id: 1511, name: 'Logs', price: 30, iconUrl: '/items/1511.png' },

  // === Bones (for prayer) ===
  { id: 526, name: 'Bones', price: 100, iconUrl: '/items/526.png' },
  { id: 532, name: 'Big bones', price: 250, iconUrl: '/items/532.png' },
  { id: 536, name: 'Dragon bones', price: 3_000, iconUrl: '/items/536.png' },
  { id: 22124, name: 'Superior dragon bones', price: 9_000, iconUrl: '/items/22124.png' },
  { id: 4812, name: 'Ourg bones', price: 1_200, iconUrl: '/items/4812.png' },
];
