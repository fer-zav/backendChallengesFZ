CREATE DATABASE prueba_ej16;
USE prueba_ej16;

-- DROP TABLE items; -- para resetear por si algo falla
CREATE TABLE `items`(
    `id` INT NOT null PRIMARY KEY AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT null,
    `categoria` VARCHAR(20) NOT null,
    `stock` INT UNSIGNED
);

INSERT INTO items (nombre, categoria, stock)
VALUES
    (`Fideos`, `Harina`, 20),
    (`Leche`, `Lacteos`, 30),
    (`Crema`, `Lacteos`, 15);

SELECT *
FROM items;

DELETE FROM items
WHERE id = 1;

UPDATE items
SET stock = 45
WHERE id = 2;

SELECT *
FROM items;
-- DROP database prueba_ej16; -- mismo que el anterior comment
