<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

try {
    $pdo = get_pdo();

    // Ensure table exists
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS parking_slots (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            type ENUM('street','lot','garage','valet') NOT NULL DEFAULT 'street',
            address VARCHAR(255) NOT NULL,
            latitude DECIMAL(9,6) NOT NULL,
            longitude DECIMAL(9,6) NOT NULL,
            price DECIMAL(10,2) NOT NULL DEFAULT 0,
            duration VARCHAR(50) NOT NULL DEFAULT '2 hours',
            capacity INT NOT NULL DEFAULT 0,
            occupied INT NOT NULL DEFAULT 0,
            features TEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
    );

    // If table already has rows, do not reseed to avoid duplicates
    $count = (int)$pdo->query('SELECT COUNT(*) FROM parking_slots')->fetchColumn();
    if ($count > 0) {
        json_response(['message' => 'Parking slots already exist, skipping seed', 'count' => $count], 200);
    }

    $slots = [
        ['Bankerohan Street Parking','street','Bankerohan Public Market, Davao City',7.067632,125.603453,15.00,'2 hours',25,17,'Metered, Market Area, Public Transport'],
        ['Pitchon Street Parking','street','Pitchon Street, Davao City',7.064610,125.606807,12.00,'1 hour',15,10,'Metered, Residential Area'],
        ['Pelayo Street Parking','street','Pelayo Street, Davao City',7.066761,125.605295,18.00,'3 hours',30,18,'Metered, Commercial Area, Near City Center'],
        ['Anda Street Parking','street','Anda Street, Davao City',7.065656,125.606542,16.00,'2 hours',20,14,'Metered, Downtown Area'],
        ['C. M. Recto Street Parking','street','C. M. Recto Street, Davao City',7.070846,125.611728,20.00,'4 hours',35,20,'Metered, Main Street, Business District'],
        ['Bolton Street Parking','street','Bolton Street, Davao City',7.066880,125.609680,14.00,'2 hours',12,8,'Metered, Residential Area'],
        ['San Pedro Street Parking','street','San Pedro Street, Davao City',7.065595,125.607725,22.00,'3 hours',25,15,'Metered, Historic Area, Tourist Spot'],
        ['Illustre Street Parking','street','Illustre Street, Davao City',7.068760,125.605007,17.00,'2 hours',18,11,'Metered, Commercial Area'],
        ['Duterte Street Parking','street','Duterte Street, Davao City',7.068793,125.605838,19.00,'3 hours',22,13,'Metered, Government Area, Near City Hall'],
        ['Villa Abrille Street Parking','street','Villa Abrille Street, Davao City',7.074843,125.613956,21.00,'4 hours',28,17,'Metered, Upscale Area, Near Hotels'],
        ['Monteverde Street Parking','street','Monteverde Street, Davao City',7.075311,125.616710,13.00,'1 hour',10,7,'Metered, Residential Area'],
        ['Calinan Public Market Parking','lot','Calinan Public Market, Davao City',7.026900,125.409200,10.00,'2 hours',40,20,'Open Lot, Market Area, Public Transport'],
        ['Calinan Town Center Parking','street','Calinan Town Center, Davao City',7.030000,125.410000,12.00,'3 hours',30,15,'Metered, Town Center, Government Services'],
        ['Calinan Terminal Parking','lot','Calinan Terminal, Davao City',7.025000,125.408000,8.00,'1 hour',50,25,'Open Lot, Terminal Area, Public Transport'],
        ['Underground Garage','garage','Financial District, Davao City',7.070000,125.620000,12.00,'8 hours',60,38,'Underground, Security, Monthly rates'],
    ];

    $ins = $pdo->prepare('INSERT INTO parking_slots (name, type, address, latitude, longitude, price, duration, capacity, occupied, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($slots as $s) {
        $ins->execute($s);
    }

    json_response(['message' => 'Seeded parking slots', 'inserted' => count($slots)], 201);
} catch (Throwable $e) {
    json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}