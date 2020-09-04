# ************************************************************
# Sequel Pro SQL dump
# Version 5446
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.5.5-MariaDB-1:10.5.5+maria~focal)
# Database: kuesioner
# Generation Time: 2020-09-01 10:45:32 +0000
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
	(2,3,'123','$2b$10$sf/ra3dg2fhGh9FgLhHZiu7gkVnPXRATDMxxuMILTss.SQoa5CkRa',1),
	(3,3,'16042092','$2b$10$6ETXoLSHvibGwDjpCb1pde/hrOlicregXsd..p4oq/vN00EVkV5UG',0),
	(4,3,'16024092','$2b$10$Dg1f6TTVkXUzQxwNVj7GqumNePZDvnHvng.MNacPBgvRoLNuo1QfC',1),
	(5,3,'16024018','$2b$10$Ixb588t5eEHpc3wbHhsSlum7WryBnwQKyu0dEOfWa73EO.Swvel2a',1);

/*!40000 ALTER TABLE `mst_auth` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mst_dosen
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mst_dosen`;

CREATE TABLE `mst_dosen` (
  `id_mst_dosen` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_mst_auth` int(11) DEFAULT NULL,
  `nip` varchar(255) DEFAULT NULL,
  `nama_dosen` varchar(255) DEFAULT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_mst_dosen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `mst_dosen` WRITE;
/*!40000 ALTER TABLE `mst_dosen` DISABLE KEYS */;

INSERT INTO `mst_dosen` (`id_mst_dosen`, `id_mst_auth`, `nip`, `nama_dosen`, `active`)
VALUES
	(1,2,'196412161991032001','Deitje Sofie Pongoh, ST, M.Pd',1),
	(2,3,'196812201994031006','Nathaniel Lumalan Bijang, ST, MT',1),
	(3,4,'196609261995122001','Ir. Stephy Beatrix Walukow, MT',1),
	(4,5,'196410061992031005','Sukandar Sawidin, ST, MT',1),
	(5,6,'196804171994032002','Dra. Betsi Rooroh, M.Pd',1),
	(6,7,'196704301992031003','Fanny Jouke Doringin, ST, MT',1),
	(7,8,'195812241990031001','Julianus Gesuri Daud, ST, MT',1),
	(8,9,'196311281990031002','Muchdar Daeng Patabo, ST.,MT',1),
	(9,10,'196002271990031002','Ir. Nikita A.E. Sajangbati, MT',1),
	(10,11,'196507111993031002','Julianus Gesuri Daud, ST, MT',1),
	(11,12,'196202241990031003','Ventje Ferdy Aror, SST.,MT',1),
	(12,13,'196410141993032001','Olga Engelien Melo, SST.,MT',1),
	(13,14,'195911091993032001','Dra. Grace Hellen Pontoh, M.Hum',1),
	(14,15,'196707091994031002','Anthon Arie Kimbal, S.Pd, SH,MH',1),
	(15,16,'197405232002121004','Maksy Sendiang, SST, MIT',1),
	(16,17,'197503052003121002','Marson James Budiman, SST.,MT',1),
	(17,18,'196405261998031001','Johan F. Makal, SST.,MT',1),
	(18,19,'197601272003121002','Herry Setiawan Langi, SST.,MT',1),
	(19,20,'197507242003122001','Anthoinete Pemina Yece Waroh, ST.,MT',1),
	(20,21,'197005202003122001','Maya Ernie Inneke Munaiseche, SS.,M.Hum',1),
	(21,22,'197610162005011001','Anritsu Steven Christian Polii, SST.,MT',1),
	(22,23,'196106011990031002','Ir. Jusuf Luther Mappadang,MT',1),
	(23,24,'196903191998032001','Maureen Langie, ST, M.Pd.,MM.Kom',1),
	(24,25,'196106241995021001','Tony Jemy Wungkana, ST, MT',1),
	(25,26,'196412211999032001','Josephin Sundah, SST.,MT',1),
	(26,27,'197610212002121003','Ottopianus Mellolo, S.Si.,MT',1),
	(27,28,'197101052002121002','Toban Tiku Pairunan, S.Si.,MT',1),
	(28,29,'197804062003122002','Marike Amelda Silvia Kondoj, SST, MT',1),
	(29,30,'196710132003122001','Yoice Rita Putung, SST.,MT',1),
	(30,31,'196808011998021001','Ventje M. A. Lumentut, ST.,MT',1),
	(31,32,'197401211998021001','Edwin Stephanus Alen Lumunon, ST, MIT',1),
	(32,33,'196406291990031007','Ir. Samsu Tuwongkesong, MT',1),
	(33,34,'196901301993031003','I Gede Para Atmaja, ST.,MT',1),
	(34,35,'196606041995121002','Ronny Evert Katuuk, SST.,MT',1),
	(35,36,'196204121997021001','Tirone Izaak Tanod, ST.,MM',1),
	(36,37,'195611131993031001','Herry Makapedua, SST.,MT',1),
	(37,38,'197303312005011001','Donald Bastian Noya, SST, MT',1),
	(38,39,'197507122002121001','Steven Johny Runtuwene, SST.,MEng',1),
	(39,40,'196804161995121001','Sonny R. Kasenda, ST.,MT',1),
	(40,41,'197101011999031004','Harson Kapoh, ST.,MT',1),
	(41,42,'196705281999031001','Eliezer Mangoting Rongre, S.Si M.Si',1),
	(42,43,'196504102001121001','Robby Tangkudung, ST.,MT',1),
	(43,44,'197309092003121001','Ali Akbar Steven Ramschie, SST.,MT',1),
	(44,45,'196312271998031001','Antonius P.G.Manginsela, ST.,MM.Kom',1),
	(45,46,'197312112002122001','Laela Worotikan, S.Ag. M.Pd.I',1),
	(46,47,'196305111992031001','Johan Pongoh, SST.,MT',1),
	(47,48,'195804281988031001','Benny A.P. Loegimin, ST, MT',1),
	(48,49,'197809272005011002','Alfrets Septy Wauran, ST.,MCSE',1),
	(49,50,'197707152001121004','Yonatan Parassa, S.Kom.,MT',1),
	(50,51,'197907202006042003','Sulastri Eksan, ST, MT',1),
	(51,52,'198002062005012001','Venny Vita Ponggawa, SST,MT',1),
	(52,53,'197312292003121001','Doostenreyk Niala Kantohe, SST.,MT',1),
	(53,54,'198912302018031001','Christtopel Hamonangan Simanjuntak, ST, M.Eng',1),
	(54,55,'198709082018031002','Stieven Netanel Rumokoy, ST.,M',1);

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
	(1,'Kuesioner Dosen',1);

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
	(1,1,'Penguasaan Materi',1),
	(2,1,'Kemampuan Menjelaskan Materi',1),
	(3,1,'Sistematika Menjelaskan Kuliah',1),
	(4,1,'Kemampuan Membangkitkan Minat Belajar Bagi Mahasiswa',1),
	(5,1,'Kemampuan Memberi Jawaban Atas Pertanyaan Yang Diajukan',1),
	(6,1,'Kedisiplinan ( Kehadiran dan Ketepatan Waktu)',1),
	(7,1,'Kesediaan Membantu Mahasiswa di Luar Jam Kuliah',1),
	(8,1,'Kepatuhan Terhadap Silabus',1),
	(9,1,'Kejelasan Silabus Kuliah',1),
	(10,1,'Kejelasan Kompetensi Yang Akan Diproleh Setelah Mengikuti Kuliah',1),
	(11,1,'Tata Cara Penilaian',1);

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
	(1,2,123,'Alfian',1),
	(2,3,16042092,'Olvia',0),
	(3,4,16024092,'Olivia',1),
	(4,5,16024018,'Arton',1);

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
  `id_mst_kuesioner_detail` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `active` tinyint(2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_trx_kuesioner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `trx_kuesioner` WRITE;
/*!40000 ALTER TABLE `trx_kuesioner` DISABLE KEYS */;

INSERT INTO `trx_kuesioner` (`id_trx_kuesioner`, `id_mst_mahasiswa`, `id_mst_dosen`, `id_mst_kuesioner`, `id_mst_kuesioner_detail`, `score`, `active`)
VALUES
	(1,1,31,1,1,3,1),
	(2,1,31,1,2,3,1),
	(3,1,31,1,3,4,1),
	(4,1,31,1,4,4,1),
	(5,1,31,1,5,3,1),
	(6,1,31,1,6,4,1),
	(7,1,31,1,7,4,1),
	(8,1,31,1,8,0,1),
	(9,1,31,1,9,4,1),
	(10,1,31,1,10,4,1),
	(11,1,31,1,11,4,1),
	(12,3,1,1,1,5,1),
	(13,3,1,1,2,4,1),
	(14,3,1,1,3,4,1),
	(15,3,1,1,4,5,1),
	(16,3,1,1,5,5,1),
	(17,3,1,1,6,5,1),
	(18,3,1,1,7,4,1),
	(19,3,1,1,8,4,1),
	(20,3,1,1,9,4,1),
	(21,3,1,1,10,4,1),
	(22,3,1,1,11,4,1),
	(23,4,28,1,1,5,1),
	(24,4,28,1,2,5,1),
	(25,4,28,1,3,4,1),
	(26,4,28,1,4,4,1),
	(27,4,28,1,5,5,1),
	(28,4,28,1,6,4,1),
	(29,4,28,1,7,5,1),
	(30,4,28,1,8,5,1),
	(31,4,28,1,9,4,1),
	(32,4,28,1,10,5,1),
	(33,4,28,1,11,5,1);

/*!40000 ALTER TABLE `trx_kuesioner` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
