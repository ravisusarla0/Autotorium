DROP TABLE IF EXISTS vehicle_compatibility;
DROP TABLE IF EXISTS part;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS part_category;

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



-- adding information into each category
    
INSERT INTO part_category (category_id, name) VALUES
(101, 'Performance'),
(102, 'Exterior'),
(103, 'Interior'),
(104, 'Wheels');

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

-- PARTS (Performance, Exterior, Interior, Wheels)
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

-- Exterior (102)
(6, 102, 'Voltex Carbon Fiber GT Wing', 1800.00, 'voltex_wing.png'),
(7, 102, 'Midnight Purple III Paint', 4500.00, 'midnight_purple.png'),
(18, 102, 'Rocket Bunny Widebody Kit', 7500.00, 'widebody.png'),
(19, 102, 'Seibon Vented Carbon Hood', 1600.00, 'carbon_hood.png'),
(20, 102, 'Championship White Paint', 2800.00, 'championship_white.png'),

-- Interior (103)
(8, 103, 'Bride Zeta III Racing Seats', 2200.00, 'bride_seats.png'),
(9, 103, 'Nardi Classic Steering Wheel', 400.00, 'nardi_wheel.png'),
(21, 103, 'Defi BF Gauges Set', 950.00, 'defi_gauges.png'),
(22, 103, 'Cusco 6-Point Roll Cage', 1100.00, 'cusco_cage.png'),
(23, 103, 'Recaro SR3 Confetti Seats', 1800.00, 'recaro_seats.png'),

-- Wheels (104)
(10, 104, '17-inch Enkei RPF1', 1200.00, 'enkei_rpf1.png'),
(11, 104, '18-inch Volk Racing TE37', 3200.00, 'volk_te37.png'),
(12, 104, '19-inch Work Meister S1', 3800.00, 'work_meister.png'),
(24, 104, '15-inch RS Watanabe 8-Spoke', 1100.00, 'watanabe.png'),
(25, 104, '18-inch BBS LM Wheels', 3600.00, 'bbs_lm.png'),
(26, 104, '19-inch Advan Racing GT', 3900.00, 'advan_gt.png');

-- VEHICLE COMPATIBILITY (Junction Table)

-- Universal Parts: (5: Exhaust, 19: Hood, 21: Gauges, 22: Cage, 23: Recaro)
INSERT INTO vehicle_compatibility (vehicle_id, part_id) VALUES
-- Vehicle 1 (Skyline R34) Universal
(1, 5), (1, 19), (1, 21), (1, 22), (1, 23),
-- Vehicle 2 (Supra MK4) Universal
(2, 5), (2, 19), (2, 21), (2, 22), (2, 23),
-- Vehicle 3 (Civic EK9) Universal
(3, 5), (3, 19), (3, 21), (3, 22), (3, 23),
-- Vehicle 4 (WRX STI) Universal
(4, 5), (4, 19), (4, 21), (4, 22), (4, 23),
-- Vehicle 5 (RX-7 FD3S) Universal
(5, 5), (5, 19), (5, 21), (5, 22), (5, 23),
-- Vehicle 6 (Evo IX) Universal
(6, 5), (6, 19), (6, 21), (6, 22), (6, 23),
-- Vehicle 7 (Silvia S15) Universal
(7, 5), (7, 19), (7, 21), (7, 22), (7, 23),
-- Vehicle 8 (NSX NA1) Universal
(8, 5), (8, 19), (8, 21), (8, 22), (8, 23),
-- Vehicle 9 (AE86) Universal
(9, 5), (9, 19), (9, 21), (9, 22), (9, 23);

-- Specific Parts Mapping (Engines, Aero, Paint, Seats/Wheels)
INSERT INTO vehicle_compatibility (vehicle_id, part_id) VALUES
-- 1. Skyline R34: RB26 (1), Wing (6), Midnight Purple (7), Bride (8), Nardi (9), TE37 (11), BBS LM (25)
(1, 1), (1, 6), (1, 7), (1, 8), (1, 9), (1, 11), (1, 25),

-- 2. Supra MK4: 2JZ (2), Wing (6), Widebody (18), Bride (8), Nardi (9), TE37 (11), Work Meister (12), Advan GT (26)
(2, 2), (2, 6), (2, 18), (2, 8), (2, 9), (2, 11), (2, 12), (2, 26),

-- 3. Civic EK9: K20A (3), White Paint (20), Nardi (9), Enkei RPF1 (10), Watanabe (24)
(3, 3), (3, 20), (3, 9), (3, 10), (3, 24),

-- 4. WRX STI: EJ20 (4), Wing (6), Bride (8), Nardi (9), TE37 (11), BBS LM (25)
(4, 4), (4, 6), (4, 8), (4, 9), (4, 11), (4, 25),

-- 5. RX-7 FD3S: 13B (13), Wing (6), Widebody (18), Midnight Purple (7), Bride (8), Nardi (9), TE37 (11)
(5, 13), (5, 6), (5, 18), (5, 7), (5, 8), (5, 9), (5, 11),

-- 6. Evo IX: 4G63 (14), Wing (6), Midnight Purple (7), Bride (8), Nardi (9), TE37 (11), BBS LM (25)
(6, 14), (6, 6), (6, 7), (6, 8), (6, 9), (6, 11), (6, 25),

-- 7. Silvia S15: SR20 (15), Wing (6), Widebody (18), White Paint (20), Bride (8), Nardi (9), TE37 (11), Work Meister (12)
(7, 15), (7, 6), (7, 18), (7, 20), (7, 8), (7, 9), (7, 11), (7, 12),

-- 8. NSX NA1: C30A (16), Wing (6), White Paint (20), Bride (8), Nardi (9), TE37 (11), Advan GT (26)
(8, 16), (8, 6), (8, 20), (8, 8), (8, 9), (8, 11), (8, 26),

-- 9. AE86: 4A-GE (17), Widebody (18), White Paint (20), Bride (8), Nardi (9), Enkei RPF1 (10), Watanabe (24)
(9, 17), (9, 18), (9, 20), (9, 8), (9, 9), (9, 10), (9, 24);
