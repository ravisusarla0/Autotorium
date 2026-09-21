CREATE TABLE part_category (
    category_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
-- Example data could be: (101, 'Performance')

CREATE TABLE vehicle (
    vehicle_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    base_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255)
);
-- Example data: (1, 'Apex Sedan', 'Sedan', 25000.00, 'sedan.png')

CREATE TABLE part (
    part_id INT PRIMARY KEY,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    price_modifier DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES part_category(category_id)
);
-- Example data: (1, 101, 'V6 Turbo Engine Upgrade', 3500.00, 'v6_turbo.png')

-- junction table 
CREATE TABLE vehicle_compatibility (
    vehicle_id INT,
    part_id INT,
    PRIMARY KEY (vehicle_id, part_id), -- A car can't be mapped to the same part twice
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id),
    FOREIGN KEY (part_id) REFERENCES part(part_id)
);
-- Example data: (1, 1) -> Apex Sedan is compatible with V6 Turbo

-- =======================================================
-- SEED DATA
-- =======================================================

-- 1. Part Categories
INSERT INTO part_category (category_id, name) VALUES
(101, 'Performance'),
(102, 'Exterior'),
(103, 'Interior'),
(104, 'Wheels');

-- 2. Base Vehicles (9 JDM Legends)
INSERT INTO vehicle (vehicle_id, name, type, base_price, image_url) VALUES
(1, 'Nissan Skyline GT-R R34', 'Coupe', 85000.00, 'r34.png'),
(2, 'Toyota Supra MK4', 'Coupe', 75000.00, 'supra.png'),
(3, 'Honda Civic Type R EK9', 'Hatchback', 25000.00, 'ek9.png'),
(4, 'Subaru Impreza WRX STI', 'Sedan', 35000.00, 'sti.png'),
(5, 'Mazda RX-7 FD3S', 'Coupe', 55000.00, 'rx7.png'),
(6, 'Mitsubishi Lancer Evo IX', 'Sedan', 40000.00, 'evo9.png'),
(7, 'Nissan Silvia S15 Spec-R', 'Coupe', 35000.00, 's15.png'),
(8, 'Honda NSX NA1', 'Coupe', 90000.00, 'nsx.png'),
(9, 'Toyota Sprinter Trueno AE86', 'Hatchback', 20000.00, 'ae86.png');

-- 3. Parts (Engine Upgrades, Exterior Paints, Interior Trims, Wheels)
INSERT INTO part (part_id, category_id, name, price_modifier, image_url) VALUES
-- Performance (101)
(1, 101, 'RB26 N1 Twin Turbo Upgrade', 12000.00, 'rb26_turbo.png'),
(2, 101, '2JZ Big Single Turbo Kit', 8500.00, '2jz_turbo.png'),
(3, 101, 'K20A Engine Swap Kit', 6500.00, 'k20a_swap.png'),
(4, 101, 'EJ20 Forged Internals Kit', 5500.00, 'ej20_forged.png'),
(5, 101, 'Tomei Titanium Exhaust', 1200.00, 'tomei_exhaust.png'),
(13, 101, '13B-REW Rotary Big Turbo', 7000.00, '13b_turbo.png'),
(14, 101, '4G63T Stroker Kit', 6000.00, '4g63_stroker.png'),
(15, 101, 'SR20DET Forged Internals', 4500.00, 'sr20_forged.png'),
(16, 101, 'C30A Twin Supercharger Kit', 14000.00, 'c30a_super.png'),
(17, 101, '4A-GE 20V ITB Setup', 3500.00, '4age_itb.png'),

-- Exterior Paint (102)
(6, 102, 'Bayside Blue Paint', 2500.00, 'paint_bayside_blue.png'),
(7, 102, 'Midnight Purple III Paint', 4500.00, 'paint_midnight_purple.png'),
(18, 102, 'Championship White Paint', 2000.00, 'paint_championship_white.png'),
(19, 102, 'Sonic Silver Metallic Paint', 1800.00, 'paint_sonic_silver.png'),
(20, 102, 'World Rally Blue Paint', 2200.00, 'paint_wrc_blue.png'),

-- Interior Trim (103)
(8, 103, 'Carbon Black Leather Interior', 1500.00, 'interior_black.png'),
(9, 103, 'Type-R Crimson Red Alcantara', 2200.00, 'interior_red.png'),
(21, 103, 'Bride Gradient Gray Fabric', 1800.00, 'interior_bride_gray.png'),
(22, 103, 'Saddle Tan Leather Interior', 2000.00, 'interior_tan.png'),

-- Wheels (104)
(10, 104, '17-inch Enkei RPF1', 1200.00, 'enkei_rpf1.png'),
(11, 104, '18-inch Volk Racing TE37', 3200.00, 'volk_te37.png'),
(12, 104, '19-inch Work Meister S1', 3800.00, 'work_meister.png'),
(24, 104, '15-inch RS Watanabe 8-Spoke', 1100.00, 'watanabe.png'),
(25, 104, '18-inch BBS LM Wheels', 3600.00, 'bbs_lm.png'),
(26, 104, '19-inch Advan Racing GT', 3900.00, 'advan_gt.png');

-- 4. Vehicle Compatibility (Universal Parts)
-- Maps universal exhaust, all paint colors, and all interior trims across all 9 cars
INSERT INTO vehicle_compatibility (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id
FROM vehicle v
CROSS JOIN part p
WHERE p.part_id IN (5, 6, 7, 18, 19, 20, 8, 9, 21, 22);

-- 5. Vehicle Compatibility (Model-Specific Engines & Wheels)
INSERT INTO vehicle_compatibility (vehicle_id, part_id) VALUES
-- Skyline R34: RB26 (1), TE37 (11), BBS LM (25)
(1, 1), (1, 11), (1, 25),
-- Supra MK4: 2JZ (2), TE37 (11), Work Meister (12), Advan GT (26)
(2, 2), (2, 11), (2, 12), (2, 26),
-- Civic EK9: K20A (3), Enkei RPF1 (10), Watanabe (24)
(3, 3), (3, 10), (3, 24),
-- WRX STI: EJ20 (4), TE37 (11), BBS LM (25)
(4, 4), (4, 11), (4, 25),
-- RX-7 FD3S: 13B (13), TE37 (11), BBS LM (25)
(5, 13), (5, 11), (5, 25),
-- Evo IX: 4G63 (14), TE37 (11), BBS LM (25)
(6, 14), (6, 11), (6, 25),
-- Silvia S15: SR20 (15), TE37 (11), Work Meister (12)
(7, 15), (7, 11), (7, 12),
-- NSX NA1: C30A (16), TE37 (11), Advan GT (26)
(8, 16), (8, 11), (8, 26),
-- AE86: 4A-GE (17), Enkei RPF1 (10), Watanabe (24)
(9, 17), (9, 10), (9, 24);
