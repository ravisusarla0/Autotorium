-- ============================================================
-- Reference data. MERGE keeps this idempotent across restarts.
-- ============================================================

MERGE INTO part_category (category_id, name) KEY (category_id) VALUES
(101, 'Performance'),
(102, 'Exterior'),
(103, 'Interior'),
(104, 'Wheels');

MERGE INTO vehicle (vehicle_id, name, type, base_price, image_url) KEY (vehicle_id) VALUES
(1, 'Nissan Skyline GT-R R34', 'Coupe', 85000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/1999_Nissan_Skyline_GT-R.jpg/1280px-1999_Nissan_Skyline_GT-R.jpg'),
(2, 'Toyota Supra MK4', 'Coupe', 78000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Toyota_Supra_Turbo_-_45324969791.jpg/1280px-Toyota_Supra_Turbo_-_45324969791.jpg'),
(3, 'Honda Civic Type R EK9', 'Hatchback', 38000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Honda_Civic_Type_R_EK9_white_%282%29.jpg/1280px-Honda_Civic_Type_R_EK9_white_%282%29.jpg'),
(4, 'Subaru WRX STI', 'Sedan', 42000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Subaru_GH-GDB_Impreza_WRX_STI_%2822091718070%29.jpg/1280px-Subaru_GH-GDB_Impreza_WRX_STI_%2822091718070%29.jpg'),
(5, 'Mazda RX-7 FD3S', 'Coupe', 55000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/1994_Mazda_RX-7_R2_in_Vintage_Red%2C_front_left_%28Lime_Rock%29.jpg/1280px-1994_Mazda_RX-7_R2_in_Vintage_Red%2C_front_left_%28Lime_Rock%29.jpg'),
(6, 'Mitsubishi Lancer Evo IX', 'Sedan', 48500.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/2005_Mitsubishi_Lancer_Evolution_IX_FQ-340.jpg/1280px-2005_Mitsubishi_Lancer_Evolution_IX_FQ-340.jpg'),
(7, 'Nissan Silvia S15 Spec-R', 'Coupe', 42000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/1999_Nissan_Silvia_S15_Spec_R.jpg/1280px-1999_Nissan_Silvia_S15_Spec_R.jpg'),
(8, 'Honda NSX NA1', 'Coupe', 95000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/1991_Honda_NSX_%28NA1%29_Coupe.jpg/1280px-1991_Honda_NSX_%28NA1%29_Coupe.jpg'),
(9, 'Toyota AE86 Sprinter Trueno', 'Hatchback', 32000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Toyota_E-AE86_Sprinter_Trueno_GTV_%2823102213001%29.jpg/1280px-Toyota_E-AE86_Sprinter_Trueno_GTV_%2823102213001%29.jpg'),
(10, 'Honda S2000 AP2', 'Roadster', 46000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Honda_S2000_AP2_Suzuka_Blue_Metallic_%281%29.jpg/1280px-Honda_S2000_AP2_Suzuka_Blue_Metallic_%281%29.jpg'),
(11, 'Nissan 350Z Z33', 'Coupe', 34000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Nissan_350Z_Z33_3.5_V6_2004_%281%29.jpg/1280px-Nissan_350Z_Z33_3.5_V6_2004_%281%29.jpg'),
(12, 'Lexus LFA', 'Supercar', 850000.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/2011_Lexus_LFA_White.jpg/1280px-2011_Lexus_LFA_White.jpg');

MERGE INTO part (part_id, category_id, name, price_modifier) KEY (part_id) VALUES
-- Performance
(1, 101, 'RB26 N1 Twin Turbo Upgrade', 12000.00),
(2, 101, '2JZ Big Single Turbo Kit', 8500.00),
(3, 101, 'K20A Engine Swap Kit', 6500.00),
(4, 101, 'EJ20 Forged Internals Kit', 5500.00),
(5, 101, 'Tomei Titanium Exhaust', 1200.00),
(13, 101, '13B-REW Rotary Big Turbo', 7000.00),
(14, 101, '4G63T Stroker Kit', 6000.00),
(15, 101, 'SR20DET Forged Internals', 4500.00),
(16, 101, 'C30A Twin Supercharger Kit', 14000.00),
(17, 101, '4A-GE 20V ITB Setup', 3500.00),
(20, 101, 'HKS GTIII-RS Turbo Kit', 6800.00),
(21, 101, 'Spoon Sports Twin-Block Calipers', 2400.00),
(22, 101, 'Ohlins Road & Track Coilovers', 3100.00),
(27, 101, 'F22C1 Spoon ITB Setup', 5200.00),
(28, 101, 'VQ35DE Twin-Turbo Kit', 7200.00),
(29, 101, '1LR-GUE Titanium Header', 9500.00),
-- Exterior
(6, 102, 'Bayside Blue Paint', 2500.00),
(7, 102, 'Midnight Purple III Paint', 4500.00),
(18, 102, 'Championship White Paint', 2000.00),
(19, 102, 'Sonic Silver Metallic Paint', 1800.00),
(23, 102, 'World Rally Blue Paint', 2200.00),
(30, 102, 'Voltex Type 2 Carbon GT Wing', 2650.00),
(31, 102, 'Varis Carbon Fiber Hood', 1950.00),
(32, 102, 'Nismo Aero Lip Kit', 1450.00),
-- Interior
(8, 103, 'Carbon Black Leather Interior', 1500.00),
(9, 103, 'Type-R Crimson Red Alcantara', 2200.00),
(33, 103, 'Bride Gradient Gray Fabric', 1800.00),
(34, 103, 'Saddle Tan Leather Interior', 2000.00),
(35, 103, 'Bride Zeta IV Carbon Bucket Seats', 2800.00),
(36, 103, 'Mugen Quick Shifter & Alcantara Boot', 450.00),
(37, 103, 'Defi Advance ZD Digital Gauge Cluster', 1100.00),
-- Wheels
(10, 104, '17-inch Enkei RPF1', 1200.00),
(11, 104, '18-inch Volk Racing TE37', 3200.00),
(12, 104, '19-inch Work Meister S1', 3800.00),
(24, 104, '15-inch RS Watanabe 8-Spoke', 1100.00),
(25, 104, '18-inch BBS LM Wheels', 3600.00),
(26, 104, '19-inch Advan Racing GT', 3900.00),
(38, 104, '18-inch BBS FI-R Forged Wheels', 4100.00),
(100, 104, 'Factory OEM Wheels - Included', 0.00);

-- Parts that fit every chassis: exhaust, paints, aero, interiors, brakes, coilovers, OEM wheels
INSERT INTO vehicle_compatibility (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id
FROM vehicle v
CROSS JOIN part p
WHERE p.part_id IN (5, 6, 7, 18, 19, 23, 30, 31, 32, 8, 9, 33, 34, 35, 21, 22, 100)
  AND NOT EXISTS (
      SELECT 1 FROM vehicle_compatibility vc
      WHERE vc.vehicle_id = v.vehicle_id AND vc.part_id = p.part_id
  );

-- Chassis specific engine packages and wheel fitments
MERGE INTO vehicle_compatibility (vehicle_id, part_id) KEY (vehicle_id, part_id) VALUES
(1, 1), (1, 11), (1, 25),
(2, 2), (2, 11), (2, 12), (2, 26),
(3, 3), (3, 10), (3, 24),
(4, 4), (4, 11), (4, 25),
(5, 13), (5, 11), (5, 25),
(6, 14), (6, 11), (6, 25),
(7, 15), (7, 11), (7, 12),
(8, 16), (8, 11), (8, 26),
(9, 17), (9, 10), (9, 24),
(10, 27), (10, 10), (10, 11),
(11, 28), (11, 11), (11, 12), (11, 26),
(12, 29), (12, 26), (12, 38);
