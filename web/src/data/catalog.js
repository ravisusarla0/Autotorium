// Canonical data for the web configurator.
//
// Mirrors database_schema.sql and the DAO seeds in src/dao:
//   • part_category 101–104
//   • the nine original vehicles with their exact base_price
//   • parts with their exact price_modifier
//   • vehicle_compatibility: universal parts on every platform plus each
//     chassis' engine / wheel rows.
//
// The schema's trailing block is unterminated SQL and reuses part ids 20–29 and
// vehicle ids 10–14, so it cannot be applied as written. The extended chassis
// referenced by src/dao/VehicleCompatibilityDAO.java are included here as
// S2000 AP2 (#10), 350Z (#11) and Lexus LFA (#12). Values that exist nowhere in
// the repository (S2000/350Z base prices, parts 27/28/29/34) are noted in
// web/README.md.

export const CATEGORIES = [
  { id: 101, name: 'Performance' },
  { id: 102, name: 'Exterior' },
  { id: 103, name: 'Interior' },
  { id: 104, name: 'Wheels' },
]

export const VEHICLES = [
  { id: 1, name: 'Nissan Skyline GT-R R34', type: 'Coupe', basePrice: 85000, imageUrl: 'r34.png', code: 'R34' },
  { id: 2, name: 'Toyota Supra MK4', type: 'Coupe', basePrice: 75000, imageUrl: 'supra.png', code: 'A80' },
  { id: 3, name: 'Honda Civic Type R EK9', type: 'Hatchback', basePrice: 25000, imageUrl: 'ek9.png', code: 'EK9' },
  { id: 4, name: 'Subaru Impreza WRX STI', type: 'Sedan', basePrice: 35000, imageUrl: 'sti.png', code: 'GC8' },
  { id: 5, name: 'Mazda RX-7 FD3S', type: 'Coupe', basePrice: 55000, imageUrl: 'rx7.png', code: 'FD3S' },
  { id: 6, name: 'Mitsubishi Lancer Evo IX', type: 'Sedan', basePrice: 40000, imageUrl: 'evo9.png', code: 'CT9A' },
  { id: 7, name: 'Nissan Silvia S15 Spec-R', type: 'Coupe', basePrice: 35000, imageUrl: 's15.png', code: 'S15' },
  { id: 8, name: 'Honda NSX NA1', type: 'Coupe', basePrice: 90000, imageUrl: 'nsx.png', code: 'NA1' },
  { id: 9, name: 'Toyota Sprinter Trueno AE86', type: 'Hatchback', basePrice: 20000, imageUrl: 'ae86.png', code: 'AE86' },
  { id: 10, name: 'Honda S2000 AP2', type: 'Roadster', basePrice: 46000, imageUrl: '', code: 'AP2' },
  { id: 11, name: 'Nissan 350Z', type: 'Coupe', basePrice: 32000, imageUrl: '', code: 'Z33' },
  { id: 12, name: 'Lexus LFA', type: 'Supercar', basePrice: 850000, imageUrl: '', code: 'LFA' },
]

export const PARTS = [
  // Performance — 101
  { id: 1, categoryId: 101, name: 'RB26 N1 Twin Turbo Upgrade', priceModifier: 12000, imageUrl: 'rb26_turbo.png' },
  { id: 2, categoryId: 101, name: '2JZ Big Single Turbo Kit', priceModifier: 8500, imageUrl: '2jz_turbo.png' },
  { id: 3, categoryId: 101, name: 'K20A Engine Swap Kit', priceModifier: 6500, imageUrl: 'k20a_swap.png' },
  { id: 4, categoryId: 101, name: 'EJ20 Forged Internals Kit', priceModifier: 5500, imageUrl: 'ej20_forged.png' },
  { id: 5, categoryId: 101, name: 'Tomei Titanium Exhaust', priceModifier: 1200, imageUrl: 'tomei_exhaust.png' },
  { id: 13, categoryId: 101, name: '13B-REW Rotary Big Turbo', priceModifier: 7000, imageUrl: '13b_turbo.png' },
  { id: 14, categoryId: 101, name: '4G63T Stroker Kit', priceModifier: 6000, imageUrl: '4g63_stroker.png' },
  { id: 15, categoryId: 101, name: 'SR20DET Forged Internals', priceModifier: 4500, imageUrl: 'sr20_forged.png' },
  { id: 16, categoryId: 101, name: 'C30A Twin Supercharger Kit', priceModifier: 14000, imageUrl: 'c30a_super.png' },
  { id: 17, categoryId: 101, name: '4A-GE 20V ITB Setup', priceModifier: 3500, imageUrl: '4age_itb.png' },
  { id: 27, categoryId: 101, name: 'F22C1 Spoon ITB Setup', priceModifier: 5400, imageUrl: '' },
  { id: 28, categoryId: 101, name: 'VQ35DE Twin-Turbo Kit', priceModifier: 7900, imageUrl: '' },
  { id: 29, categoryId: 101, name: '1LR-GUE Titanium Header', priceModifier: 9600, imageUrl: '' },

  // Exterior — 102
  { id: 6, categoryId: 102, name: 'Bayside Blue Paint', priceModifier: 2500, imageUrl: 'paint_bayside_blue.png' },
  { id: 7, categoryId: 102, name: 'Midnight Purple III Paint', priceModifier: 4500, imageUrl: 'paint_midnight_purple.png' },
  { id: 18, categoryId: 102, name: 'Championship White Paint', priceModifier: 2000, imageUrl: 'paint_championship_white.png' },
  { id: 19, categoryId: 102, name: 'Sonic Silver Metallic Paint', priceModifier: 1800, imageUrl: 'paint_sonic_silver.png' },
  { id: 20, categoryId: 102, name: 'World Rally Blue Paint', priceModifier: 2200, imageUrl: 'paint_wrc_blue.png' },

  // Interior — 103
  { id: 8, categoryId: 103, name: 'Carbon Black Leather Interior', priceModifier: 1500, imageUrl: 'interior_black.png' },
  { id: 9, categoryId: 103, name: 'Type-R Crimson Red Alcantara', priceModifier: 2200, imageUrl: 'interior_red.png' },
  { id: 21, categoryId: 103, name: 'Bride Gradient Gray Fabric', priceModifier: 1800, imageUrl: 'interior_bride_gray.png' },
  { id: 22, categoryId: 103, name: 'Saddle Tan Leather Interior', priceModifier: 2000, imageUrl: 'interior_tan.png' },

  // Wheels — 104
  { id: 10, categoryId: 104, name: '17-inch Enkei RPF1', priceModifier: 1200, imageUrl: 'enkei_rpf1.png' },
  { id: 11, categoryId: 104, name: '18-inch Volk Racing TE37', priceModifier: 3200, imageUrl: 'volk_te37.png' },
  { id: 12, categoryId: 104, name: '19-inch Work Meister S1', priceModifier: 3800, imageUrl: 'work_meister.png' },
  { id: 24, categoryId: 104, name: '15-inch RS Watanabe 8-Spoke', priceModifier: 1100, imageUrl: 'watanabe.png' },
  { id: 25, categoryId: 104, name: '18-inch BBS LM Wheels', priceModifier: 3600, imageUrl: 'bbs_lm.png' },
  { id: 26, categoryId: 104, name: '19-inch Advan Racing GT', priceModifier: 3900, imageUrl: 'advan_gt.png' },
  { id: 34, categoryId: 104, name: '19-inch BBS FI-R Wheels', priceModifier: 5400, imageUrl: '' },
]

// vehicle_compatibility: the universal set from the schema's CROSS JOIN plus the
// per-model engine / wheel rows from section 5.
const UNIVERSAL_PART_IDS = [5, 6, 7, 18, 19, 20, 8, 9, 21, 22]

const MODEL_PART_IDS = {
  1: [1, 11, 25], // Skyline R34 — RB26, TE37, BBS LM
  2: [2, 11, 12, 26], // Supra MK4 — 2JZ, TE37, Meister, Advan
  3: [3, 10, 24], // Civic EK9 — K20A, Enkei RPF1, Watanabe
  4: [4, 11, 25], // WRX STI — EJ20, TE37, BBS LM
  5: [13, 11, 25], // RX-7 FD3S — 13B, TE37, BBS LM
  6: [14, 11, 25], // Evo IX — 4G63, TE37, BBS LM
  7: [15, 11, 12], // Silvia S15 — SR20, TE37, Meister
  8: [16, 11, 26], // NSX NA1 — C30A, TE37, Advan
  9: [17, 10, 24], // AE86 — 4A-GE, Enkei RPF1, Watanabe
  10: [27, 10, 11], // S2000 AP2 — F22C1, Enkei RPF1, TE37
  11: [28, 11, 12, 26], // 350Z — VQ35DE, TE37, Meister, Advan
  12: [29, 26, 34], // LFA — 1LR-GUE, Advan, BBS FI-R
}

const COMPATIBILITY_BY_VEHICLE = new Map(
  VEHICLES.map((vehicle) => [
    vehicle.id,
    new Set([...UNIVERSAL_PART_IDS, ...(MODEL_PART_IDS[vehicle.id] ?? [])]),
  ]),
)

export const VEHICLE_COMPATIBILITY = VEHICLES.flatMap((vehicle) =>
  [...COMPATIBILITY_BY_VEHICLE.get(vehicle.id)].map((partId) => ({
    vehicleId: vehicle.id,
    partId,
  })),
)

const CATEGORY_ORDER = new Map(CATEGORIES.map((category, index) => [category.id, index]))

export const getVehicleById = (vehicleId) =>
  VEHICLES.find((vehicle) => vehicle.id === vehicleId) ?? null

export const getPartById = (partId) =>
  PARTS.find((part) => part.id === partId) ?? null

export const getCategoryById = (categoryId) =>
  CATEGORIES.find((category) => category.id === categoryId) ?? null

export const isPartCompatible = (vehicleId, partId) =>
  COMPATIBILITY_BY_VEHICLE.get(vehicleId)?.has(partId) ?? false

export function getCompatibleParts(vehicleId) {
  const compatibleIds = COMPATIBILITY_BY_VEHICLE.get(vehicleId)
  if (!compatibleIds) return []
  return PARTS.filter((part) => compatibleIds.has(part.id)).sort(
    (a, b) =>
      CATEGORY_ORDER.get(a.categoryId) - CATEGORY_ORDER.get(b.categoryId) ||
      a.name.localeCompare(b.name),
  )
}
