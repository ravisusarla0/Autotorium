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
