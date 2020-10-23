-- MySQL Script generated by MySQL Workbench
-- Thu 22 Oct 2020 06:15:43 PM
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema darq
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema darq
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `darq` ;
USE `darq` ;

-- -----------------------------------------------------
-- Table `darq`.`business_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `darq`.`business_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `verified` TINYINT NOT NULL DEFAULT 0,
  `email` CHAR(128) NOT NULL,
  `password` CHAR(64) NOT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `darq`.`business`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `darq`.`business` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `owner` INT NOT NULL,
  `approved` ENUM('TENTATIVE', 'APPROVED_AND_LISTED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'TENTATIVE',
  `display_name` CHAR(128) NOT NULL,
  `display_picture` CHAR(64) NOT NULL,
  `type` CHAR(32) NOT NULL,
  `sub_type` CHAR(64) NOT NULL,
  `calculated_rating` DOUBLE NULL,
  `listing_index` INT NOT NULL DEFAULT -1,
  `props` JSON NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_business_user1_idx` (`owner` ASC) VISIBLE,
  INDEX `listing` USING BTREE (`listing_index`) VISIBLE,
  CONSTRAINT `fk_business_user1`
    FOREIGN KEY (`owner`)
    REFERENCES `darq`.`business_user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `darq`.`event`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `darq`.`event` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `owner` INT NOT NULL,
  `approved` ENUM('TENTATIVE', 'APPROVED_AND_LISTED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'TENTATIVE',
  `display_name` CHAR(128) NOT NULL,
  `display_picture` CHAR(64) NOT NULL,
  `type` CHAR(32) NOT NULL,
  `start` DATETIME NOT NULL,
  `end` DATETIME NOT NULL,
  `listing_index` INT NOT NULL DEFAULT -1,
  `props` JSON NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_event_user1_idx` (`owner` ASC) VISIBLE,
  INDEX `listing` USING BTREE (`listing_index`) VISIBLE,
  INDEX `start` USING BTREE (`start`) VISIBLE,
  INDEX `end` (`end` ASC) VISIBLE,
  CONSTRAINT `fk_event_user1`
    FOREIGN KEY (`owner`)
    REFERENCES `darq`.`business_user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `darq`.`public_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `darq`.`public_user` (
  `id` BIGINT NOT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `darq`.`rating`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `darq`.`rating` (
  `business_id` INT NOT NULL,
  `public_user_id` BIGINT NOT NULL,
  `stars` TINYINT NOT NULL,
  PRIMARY KEY (`business_id`, `public_user_id`),
  INDEX `fk_rating_public_user1_idx` (`public_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_rating_business1`
    FOREIGN KEY (`business_id`)
    REFERENCES `darq`.`business` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_rating_public_user1`
    FOREIGN KEY (`public_user_id`)
    REFERENCES `darq`.`public_user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `darq`.`message_thread`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `darq`.`message_thread` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `business_id` INT NOT NULL,
  `public_user_id` BIGINT NOT NULL,
  `business_user_id` INT NOT NULL,
  `targetLastSeenIndex` INT NULL,
  `senderLastSeenIndex` INT NULL,
  INDEX `fk_message_thread_business1_idx` (`business_id` ASC) VISIBLE,
  INDEX `fk_message_thread_public_user1_idx` (`public_user_id` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  INDEX `fk_message_thread_business_user1_idx` (`business_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_message_thread_business1`
    FOREIGN KEY (`business_id`)
    REFERENCES `darq`.`business` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_message_thread_public_user1`
    FOREIGN KEY (`public_user_id`)
    REFERENCES `darq`.`public_user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_message_thread_business_user1`
    FOREIGN KEY (`business_user_id`)
    REFERENCES `darq`.`business_user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `darq`.`message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `darq`.`message` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `message_thread_id` INT NOT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sender` ENUM('BUSINESS', 'PUBLIC') NOT NULL,
  `data` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_message_message_thread1_idx` (`message_thread_id` ASC) VISIBLE,
  CONSTRAINT `fk_message_message_thread1`
    FOREIGN KEY (`message_thread_id`)
    REFERENCES `darq`.`message_thread` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `darq`.`business_tentative_update`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `darq`.`business_tentative_update` (
  `business_id` INT NOT NULL,
  `approved` ENUM('TENTATIVE', 'APPROVED_AND_LISTED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'TENTATIVE',
  `updated_data` JSON NOT NULL,
  PRIMARY KEY (`business_id`),
  CONSTRAINT `fk_business_update_business1`
    FOREIGN KEY (`business_id`)
    REFERENCES `darq`.`business` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;