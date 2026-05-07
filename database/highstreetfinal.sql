CREATE DATABASE  IF NOT EXISTS `highstreet` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `highstreet`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: highstreet
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `ActivityID` int NOT NULL AUTO_INCREMENT,
  `ActivityName` varchar(255) DEFAULT NULL,
  `ActivityDescription` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ActivityID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,'Boxing','An awesome combat sport that only allows for punches'),(2,'Zumba','A funky dancing excercise that helps you get active and fit while busting a move!'),(3,'Indoor Cycling','Take a ride on our cycling machines'),(4,'Body Attack','Take on an intensive training regiment designed to better your mind, muscles, willpower and everything else!'),(7,'Aqua Sports','All the exercise you need in a swimming pool'),(21,'Yoga','An excellent activity to improve your concentration and flexibility'),(22,'HIIT','An intensive cardio workout routine that will bring out the best in you'),(23,'Pilates','A low-impact physical activity that combines controlled movements, mindful breathing, and a strong focus on the core muscles to improve overall body balance and posture.'),(24,'Abs Workout','Put yourself through our expertly crafted ab routine'),(25,'Body Pump','The perfect weight lifting routine to grow your strength and muscles.');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `BookingID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `SessionID` int DEFAULT NULL,
  PRIMARY KEY (`BookingID`),
  KEY `bookings_ibfk_1` (`UserID`),
  KEY `bookings_ibfk_2` (`SessionID`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`SessionID`) REFERENCES `sessions` (`SessionID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (41,78,22),(42,78,7),(44,78,4),(46,78,23),(47,79,5),(48,79,20),(49,79,23),(69,81,24),(70,81,8);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `LocationID` int NOT NULL AUTO_INCREMENT,
  `LocationTitle` varchar(255) DEFAULT NULL,
  `LocationAddress` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`LocationID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Ashgrove High Street Gym','27 Cleveland Road, Ashgrove 7777'),(2,'City District High Street Gym','Level 2 Shop 04, 226 Queen Street, Brisbane City 4000 '),(3,'Chermside High Street Gym','53 Barnsley Street, Chermside 3584'),(4,'Graceville High Street Gym','19 Kenley Street, Graceville 3421'),(5,'Westlake High Street Gym','Level 1 Shop 11, 4 Nair Road, Westlake 9342'),(9,'Indooroopilly High Street Gym','Indooroopilly Shopping Centre Level 3'),(10,'Strathpine High Street Gym','36 Kurry St'),(11,'Sherwood High Street Gym','12 Lawler Rd'),(12,'Logan High Street Gym','18 Millwall Avenue'),(13,'Inala High Street Gym','2 Salford St');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `PostID` int NOT NULL AUTO_INCREMENT,
  `PostContent` varchar(1000) DEFAULT NULL,
  `UserID` int DEFAULT NULL,
  PRIMARY KEY (`PostID`),
  KEY `posts_ibfk_1` (`UserID`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (45,'yes king d s sa asd',2),(52,'killllsdsaasdsd',2),(53,'sdsasdasasdsadada',2),(56,'Can\'t wait to try out westlake gym!',78),(57,'Was great fun',78),(58,'High Street has been alright so far but I much perfer RIZAP..',81),(59,'Has anyone seen taichi around here?',81),(60,'Loving the vibes at ashgrove!',75),(61,'Just tried some aqua sports with Maise, it was sooo good',75),(62,'..wonder if creatine would help with my gains :p',75),(67,'ffdfdsfsdddfs  f dsfsdfdsf sdsdfdfssd fds',81),(69,'',81),(70,'me bomba',81),(71,'me bomba clart',81),(75,'dsfdsffsd',81);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `SessionID` int NOT NULL AUTO_INCREMENT,
  `SessionDate` date DEFAULT NULL,
  `SessionTime` time DEFAULT NULL,
  `ActivityID` int DEFAULT NULL,
  `TrainerID` int DEFAULT NULL,
  `LocationID` int DEFAULT NULL,
  PRIMARY KEY (`SessionID`),
  KEY `sessions_ibfk_1` (`ActivityID`),
  KEY `sessions_ibfk_2` (`TrainerID`),
  KEY `sessions_ibfk_3` (`LocationID`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`ActivityID`) REFERENCES `activities` (`ActivityID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`TrainerID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sessions_ibfk_3` FOREIGN KEY (`LocationID`) REFERENCES `locations` (`LocationID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (2,'2025-09-11','12:00:00',1,1,1),(4,'2025-10-03','16:00:00',1,1,5),(5,'2025-11-03','19:00:00',2,1,1),(7,'2026-01-01','12:00:00',2,2,5),(8,'2026-01-01','13:00:00',1,2,3),(9,'2026-01-01','11:00:00',1,82,2),(14,'2026-01-01','18:03:00',2,1,2),(15,'2026-01-01','10:33:00',2,1,2),(20,'2025-09-12','10:58:00',1,1,1),(22,'2025-09-22','16:22:00',1,1,1),(23,'2025-08-20','19:30:00',7,1,5),(24,'2025-10-08','09:30:00',22,82,11),(25,'2025-10-16','10:30:00',24,79,10);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `UserRole` enum('Member','Trainer','Admin') DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `GymID` int DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `AuthenticationKey` varchar(36) DEFAULT NULL,
  `Deleted` tinyint NOT NULL DEFAULT 0,
  PRIMARY KEY (`UserID`),
  KEY `location` (`GymID`),
  CONSTRAINT `location` FOREIGN KEY (`GymID`) REFERENCES `locations` (`LocationID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (UserID, FirstName, LastName, UserRole, Password, Email, Address, GymID, PhoneNumber) VALUES (1,'Jacob','Murphy','Trainer','$2b$10$4a8SPbPFbIcmga6b9.jy7.7YhzBHu2Efet5UQYqciswoZDrF0GYwq','jacob@gmail.com','Jacob\'s new nuts',2,'323242343232'),(2,'John','Administrator','Admin','$2b$10$/Kwdp9mu6eTKZ.zlgdVoeee92ACNhnGRsa0YUnQTbUCPwi0qqClym','john@gmail.com','John Land',1,'04120391212'),(75,'Jane','Gym-goer','Member','$2b$10$gtOvBIKxirKMRvGPnfGynuDnjzOKfRJ0G4QyBWZq5tPv8S4wurlVu','JGG@gmail.com','32 Haggy St',1,'34897902384328474'),(78,'Sebi','Wright','Member','$2b$10$fRrcZE8uwP9ijJT0rB0tJengK4o2kULREZMeA6vgbPCOMkQ88.97K','sebiw@gmail.com','2 Fish Lane',2,'0448093328'),(79,'Tyler','Arnold','Trainer','$2b$10$eWNXxrHU7PVhC4MqjZdXf.5ErRoj8G6.Aho/CyXGiiNahEWHMHt2O','tyleraa@gmail.com','33 Monson St',1,'326324624632'),(80,'Kenny','Wong','Admin','$2b$10$.TI90GJgoZdj1ROw4xMghOtnZGRVOWfrCSohSyp8ltS9SE/hk/hza','kw12@gmail.com','6 Leeds Avenue',4,'0447823874'),(81,'Kazuma','Kiryu','Member','$2b$10$2UlSF2xyR11MXK3Dbb.yHOacQtORKGldGyBg0yIv2CwvjmcFXLW8q','judgementkazzy@gmail.com','Ryuku Morning Glory',2,'81408723024'),(82,'Nathan','Kennedy','Trainer','$2b$10$kSlOZ4pBG1EmUjYo7sRkceo5CAOF3zEw0yf2nVECvHxqIw69Zv1R6','nkenn@gmail.com','121 June St',1,'04483202340'),(83,'Steve','Bruce','Admin','$2b$10$f0qFfCvsV89gH.1X/lN6AuAsxU/CldNv2w5ZHM8v48L9QR1r/Vnde','bruce@gmail.com','Hill Dickinson Stadium',9,'43298498423');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-06 22:38:46
