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

// Direct Wikimedia Commons files (upload.wikimedia.org). `photo` is the
// primary shot, `photoFallback` a second Commons file used if the first fails.
const WM = (path) => `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}`

export const VEHICLES = [
  {
    id: 1,
    name: 'Nissan Skyline GT-R R34',
    type: 'Coupe',
    basePrice: 85000,
    imageUrl: 'r34.png',
    photo: WM('1/13/Nissan_Skyline_GT-R_%28R34%2C_2001%29_%2852573871385%29.jpg/1920px-Nissan_Skyline_GT-R_%28R34%2C_2001%29_%2852573871385%29.jpg'),
    photoFallback: WM('b/be/2001_Nissan_Skyline_GT-R_V-Spec_II_R34_%2856664%29.jpg/1920px-2001_Nissan_Skyline_GT-R_V-Spec_II_R34_%2856664%29.jpg'),
    code: 'R34',
  },
  {
    id: 2,
    name: 'Toyota Supra MK4',
    type: 'Coupe',
    basePrice: 75000,
    imageUrl: 'supra.png',
    photo: WM('b/bc/1996_Toyota_Supra_A80_%28front%29.jpg/1920px-1996_Toyota_Supra_A80_%28front%29.jpg'),
    photoFallback: WM('1/14/TOYOTA_SUPRA_%28A80%29_HONG_KONG_%282%29.jpg/1920px-TOYOTA_SUPRA_%28A80%29_HONG_KONG_%282%29.jpg'),
    code: 'A80',
  },
  {
    id: 3,
    name: 'Honda Civic Type R EK9',
    type: 'Hatchback',
    basePrice: 25000,
    imageUrl: 'ek9.png',
    photo: WM('8/82/1997_Honda_Civic_Type_R_EK9.jpg/1920px-1997_Honda_Civic_Type_R_EK9.jpg'),
    photoFallback: WM('2/22/Honda_Civic_Type_R_EK9_white_%282%29.jpg/1920px-Honda_Civic_Type_R_EK9_white_%282%29.jpg'),
    code: 'EK9',
  },
  {
    id: 4,
    name: 'Subaru Impreza WRX STI',
    type: 'Sedan',
    basePrice: 35000,
    imageUrl: 'sti.png',
    photo: WM('a/ac/Subaru_IMPREZA_WRX_Type_R_STi_Version_%28GC8%29_front.JPG/1920px-Subaru_IMPREZA_WRX_Type_R_STi_Version_%28GC8%29_front.JPG'),
    photoFallback: WM('1/13/Tuned_Subaru_Impreza_WRX_STi_%28GC8%29_at_night_front.JPG/1920px-Tuned_Subaru_Impreza_WRX_STi_%28GC8%29_at_night_front.JPG'),
    code: 'GC8',
  },
  {
    id: 5,
    name: 'Mazda RX-7 FD3S',
    type: 'Coupe',
    basePrice: 55000,
    imageUrl: 'rx7.png',
    photo: WM('2/2a/Mazda_RX-7_Spirit_R_%28FD3S%29_%28front_three-quarter_view%29_at_Mazda_Museum.jpg/1920px-Mazda_RX-7_Spirit_R_%28FD3S%29_%28front_three-quarter_view%29_at_Mazda_Museum.jpg'),
    photoFallback: WM('c/cc/Mazda_RX-7_FD3S%2C_front_right%2C_05-05-2024.jpg/1920px-Mazda_RX-7_FD3S%2C_front_right%2C_05-05-2024.jpg'),
    code: 'FD3S',
  },
  {
    id: 6,
    name: 'Mitsubishi Lancer Evo IX',
    type: 'Sedan',
    basePrice: 40000,
    imageUrl: 'evo9.png',
    photo: WM('b/bc/2005_Mitsubishi_Lancer_Evolution_IX_BS_O24.jpg/1920px-2005_Mitsubishi_Lancer_Evolution_IX_BS_O24.jpg'),
    photoFallback: WM('8/89/2005_Mitsubishi_Lancer_Evolution_IX_FQ-340.jpg/1920px-2005_Mitsubishi_Lancer_Evolution_IX_FQ-340.jpg'),
    code: 'CT9A',
  },
  {
    id: 7,
    name: 'Nissan Silvia S15 Spec-R',
    type: 'Coupe',
    basePrice: 35000,
    imageUrl: 's15.png',
    photo: WM('b/b3/2001_Nissan_Silvia_S15.jpg/1920px-2001_Nissan_Silvia_S15.jpg'),
    photoFallback: WM('f/fc/Moscow%2C_Nissan_Silvia_%28S15%29_spec-R%2C_May_2026_01.jpg/1920px-Moscow%2C_Nissan_Silvia_%28S15%29_spec-R%2C_May_2026_01.jpg'),
    code: 'S15',
  },
  {
    id: 8,
    name: 'Honda NSX NA1',
    type: 'Coupe',
    basePrice: 90000,
    imageUrl: 'nsx.png',
    photo: WM('e/eb/1991_Honda_NSX_%28NA1%29_Coupe.jpg/1920px-1991_Honda_NSX_%28NA1%29_Coupe.jpg'),
    photoFallback: WM('1/14/Honda_E-NA1_NSX_%2822022010324%29.jpg/1920px-Honda_E-NA1_NSX_%2822022010324%29.jpg'),
    code: 'NA1',
  },
  {
    id: 9,
    name: 'Toyota Sprinter Trueno AE86',
    type: 'Hatchback',
    basePrice: 20000,
    imageUrl: 'ae86.png',
    photo: WM('6/69/Toyota_Sprinter_Trueno_AE86_2_door.jpg/1920px-Toyota_Sprinter_Trueno_AE86_2_door.jpg'),
    photoFallback: WM('2/28/Toyota_E-AE86_Sprinter_Trueno_GT_APEX_%2822010314081%29.jpg/1920px-Toyota_E-AE86_Sprinter_Trueno_GT_APEX_%2822010314081%29.jpg'),
    code: 'AE86',
  },
  {
    id: 10,
    name: 'Honda S2000 AP2',
    type: 'Roadster',
    basePrice: 46000,
    imageUrl: '',
    photo: WM('9/90/Honda_S2000_AP2_Grand_Prix_White_front_left.jpg/1920px-Honda_S2000_AP2_Grand_Prix_White_front_left.jpg'),
    photoFallback: WM('8/82/Honda_S2000_AP2_%28Bahrain%29.jpg/1920px-Honda_S2000_AP2_%28Bahrain%29.jpg'),
    code: 'AP2',
  },
  {
    id: 11,
    name: 'Nissan 350Z',
    type: 'Coupe',
    basePrice: 32000,
    imageUrl: '',
    photo: WM('f/f1/Nissan_350Z_Premium_Pack_sunset_orange%2C_2003%2C_view_front_right.jpg/1920px-Nissan_350Z_Premium_Pack_sunset_orange%2C_2003%2C_view_front_right.jpg'),
    photoFallback: WM('0/06/2003_Nissan_350Z_%28Z33%29_Track_coupe_%2819471835428%29.jpg/1920px-2003_Nissan_350Z_%28Z33%29_Track_coupe_%2819471835428%29.jpg'),
    code: 'Z33',
  },
  {
    id: 12,
    name: 'Lexus LFA',
    type: 'Supercar',
    basePrice: 850000,
    imageUrl: '',
    photo: WM('3/33/2011_Lexus_LFA_Front.jpg/1920px-2011_Lexus_LFA_Front.jpg'),
    photoFallback: WM('6/62/2011_Lexus_LFA_Low.jpg/1920px-2011_Lexus_LFA_Low.jpg'),
    code: 'LFA',
  },
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
  { id: 6, categoryId: 102, name: 'Bayside Blue Paint', priceModifier: 2500, imageUrl: 'paint_bayside_blue.png', swatch: '#2f5fa6' },
  { id: 7, categoryId: 102, name: 'Midnight Purple III Paint', priceModifier: 4500, imageUrl: 'paint_midnight_purple.png', swatch: '#4b2e63' },
  { id: 18, categoryId: 102, name: 'Championship White Paint', priceModifier: 2000, imageUrl: 'paint_championship_white.png', swatch: '#ededE8' },
  { id: 19, categoryId: 102, name: 'Sonic Silver Metallic Paint', priceModifier: 1800, imageUrl: 'paint_sonic_silver.png', swatch: '#b9bdc2' },
  { id: 20, categoryId: 102, name: 'World Rally Blue Paint', priceModifier: 2200, imageUrl: 'paint_wrc_blue.png', swatch: '#1e4fa3' },

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
