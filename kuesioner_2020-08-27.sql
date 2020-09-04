# ************************************************************
# Sequel Pro SQL dump
# Version 5446
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.5.4-MariaDB-1:10.5.4+maria~focal)
# Database: kuesioner
# Generation Time: 2020-08-26 23:42:32 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table mst_auth
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mst_auth`;

CREATE TABLE `mst_auth` (
  `id_mst_auth` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_mst_tipe_user` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `active` tinyint(2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_mst_auth`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `mst_auth` WRITE;
/*!40000 ALTER TABLE `mst_auth` DISABLE KEYS */;

INSERT INTO `mst_auth` (`id_mst_auth`, `id_mst_tipe_user`, `username`, `password`, `active`)
VALUES
	(1,1,'admin','$2b$10$DjEGVPVHmZHamirMfAuQpuijS3hP7ABGRylmdf/j0h1Ebkr4UgRDm',1),
	(2,3,'123','$2b$10$xEOC.QH9byi8rcImL5BJCOwqRZJegk8MKECnpanO/Q164UEH4yzFC',0),
	(3,2,'1234','$2b$10$v8K8PmLuWz3Rc3xtT.ijzOAtgQbQSC4no5r6zbV9lPLu9BntaZ74a',1),
	(4,3,'123','$2b$10$LZlOFftxun8TsYMA6wRhXOPr6gbLqficWlMxn1mUSVwAPF31gP/uC',1),
	(5,2,'1234','$2b$10$iJGvFWwnOAyDNHe7IngMoO6iWqheNrmDFGxaviQdVrz0S1pyXKU0K',1);

/*!40000 ALTER TABLE `mst_auth` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mst_dosen
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mst_dosen`;

CREATE TABLE `mst_dosen` (
  `id_mst_dosen` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_mst_auth` int(11) DEFAULT NULL,
  `nip` int(11) DEFAULT NULL,
  `nama_dosen` varchar(255) DEFAULT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_mst_dosen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `mst_dosen` WRITE;
/*!40000 ALTER TABLE `mst_dosen` DISABLE KEYS */;

INSERT INTO `mst_dosen` (`id_mst_dosen`, `id_mst_auth`, `nip`, `nama_dosen`, `active`)
VALUES
	(1,3,1234,'Mukdar',1),
	(2,5,1234,'Edwin ',1);

/*!40000 ALTER TABLE `mst_dosen` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mst_kuesioner
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mst_kuesioner`;

CREATE TABLE `mst_kuesioner` (
  `id_mst_kuesioner` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nama_kuesioner` text DEFAULT NULL,
  `active` tinyint(2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_mst_kuesioner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `mst_kuesioner` WRITE;
/*!40000 ALTER TABLE `mst_kuesioner` DISABLE KEYS */;

INSERT INTO `mst_kuesioner` (`id_mst_kuesioner`, `nama_kuesioner`, `active`)
VALUES
	(1,'Kuesioner 1',1),
	(2,'Kuesioner 1',0),
	(3,'Kuedioner 2',1);

/*!40000 ALTER TABLE `mst_kuesioner` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mst_kuesioner_detail
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mst_kuesioner_detail`;

CREATE TABLE `mst_kuesioner_detail` (
  `id_mst_kuesioner_detail` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_mst_kuesioner` int(11) DEFAULT NULL,
  `pertanyaan` text DEFAULT NULL,
  `active` tinyint(2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_mst_kuesioner_detail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `mst_kuesioner_detail` WRITE;
/*!40000 ALTER TABLE `mst_kuesioner_detail` DISABLE KEYS */;

INSERT INTO `mst_kuesioner_detail` (`id_mst_kuesioner_detail`, `id_mst_kuesioner`, `pertanyaan`, `active`)
VALUES
	(2,1,'Kehadiran tepat waktu',1),
	(3,1,'Ketrampilan mengajar',1),
	(4,3,'Nama saya',1),
	(5,3,'Nama dia',1);

/*!40000 ALTER TABLE `mst_kuesioner_detail` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mst_mahasiswa
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mst_mahasiswa`;

CREATE TABLE `mst_mahasiswa` (
  `id_mst_mahasiswa` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_mst_auth` int(11) DEFAULT NULL,
  `nim` int(11) DEFAULT NULL,
  `nama_mahasiswa` varchar(255) DEFAULT NULL,
  `active` tinyint(2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_mst_mahasiswa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `mst_mahasiswa` WRITE;
/*!40000 ALTER TABLE `mst_mahasiswa` DISABLE KEYS */;

INSERT INTO `mst_mahasiswa` (`id_mst_mahasiswa`, `id_mst_auth`, `nim`, `nama_mahasiswa`, `active`)
VALUES
	(1,2,123,'Alfian lensun',0),
	(2,4,123,'Alfian',1);

/*!40000 ALTER TABLE `mst_mahasiswa` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mst_tipe_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mst_tipe_user`;

CREATE TABLE `mst_tipe_user` (
  `id_mst_tipe_user` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nm_tipe_user` varchar(100) DEFAULT NULL,
  `active` tinyint(2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_mst_tipe_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `mst_tipe_user` WRITE;
/*!40000 ALTER TABLE `mst_tipe_user` DISABLE KEYS */;

INSERT INTO `mst_tipe_user` (`id_mst_tipe_user`, `nm_tipe_user`, `active`)
VALUES
	(1,'admin',1),
	(2,'dosen',1),
	(3,'mahasiswa',1);

/*!40000 ALTER TABLE `mst_tipe_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table trx_kuesioner
# ------------------------------------------------------------

DROP TABLE IF EXISTS `trx_kuesioner`;

CREATE TABLE `trx_kuesioner` (
  `id_trx_kuesioner` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_mst_mahasiswa` int(11) DEFAULT NULL,
  `id_mst_dosen` int(11) DEFAULT NULL,
  `id_mst_kuesioner` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `active` tinyint(2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_trx_kuesioner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `trx_kuesioner` WRITE;
/*!40000 ALTER TABLE `trx_kuesioner` DISABLE KEYS */;

INSERT INTO `trx_kuesioner` (`id_trx_kuesioner`, `id_mst_mahasiswa`, `id_mst_dosen`, `id_mst_kuesioner`, `score`, `active`)
VALUES
	(1,1,1,1,3,1),
	(2,1,1,1,5,1),
	(3,1,1,1,3,1),
	(4,1,1,1,4,1),
	(5,1,1,1,3,1),
	(6,1,1,1,5,1),
	(7,1,1,1,4,1),
	(8,1,1,1,4,1),
	(9,1,1,1,3,1),
	(10,1,1,1,5,1),
	(11,NULL,1,3,3,1),
	(12,NULL,1,3,3,1),
	(13,NULL,1,3,5,1),
	(14,NULL,1,3,5,1),
	(15,NULL,1,3,3,1),
	(16,NULL,1,3,4,1);

/*!40000 ALTER TABLE `trx_kuesioner` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
