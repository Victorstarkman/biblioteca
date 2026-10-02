CREATE DATABASE IF NOT EXISTS `biblioteca`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `biblioteca`;

CREATE TABLE IF NOT EXISTS `tematicas` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre`      VARCHAR(80)  NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tematicas_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `libros` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre`      VARCHAR(180) NOT NULL,
  `autor`       VARCHAR(150) NOT NULL,
  `contenido`   TEXT         NULL,
  `id_tematica` INT UNSIGNED NULL,
  `estado`      ENUM('pendiente','leyendo','terminado') NOT NULL DEFAULT 'pendiente',
  `progreso`    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_libros_nombre` (`nombre`),
  KEY `idx_libros_autor` (`autor`),
  KEY `idx_libros_tematica` (`id_tematica`),
  KEY `idx_libros_estado` (`estado`),
  CONSTRAINT `fk_libros_tematica`
    FOREIGN KEY (`id_tematica`) REFERENCES `tematicas` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_libros_progreso` CHECK (`progreso` BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `horarios_lectura` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dia`        ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
  `hora_inicio` TIME        NOT NULL,
  `hora_fin`   TIME         NULL,
  `libro_id`   INT UNSIGNED NULL,
  `notas`      VARCHAR(255) NULL,
  `activo`     TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_horarios_dia` (`dia`),
  KEY `idx_horarios_libro` (`libro_id`),
  CONSTRAINT `fk_horarios_libro`
    FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
