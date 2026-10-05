-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2026 at 03:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aeroground`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `flight_id` varchar(50) DEFAULT NULL,
  `equipment_type` varchar(100) DEFAULT NULL,
  `equipment_id` int(11) DEFAULT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `task` varchar(255) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `flight_id`, `equipment_type`, `equipment_id`, `assigned_to`, `task`, `location`, `priority`, `status`, `due_date`, `created_at`) VALUES
(1, 'LH404', 'Pushback Tug', 2, NULL, NULL, NULL, NULL, 'Assigned', NULL, '2026-10-05 12:56:03');

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
  `equipment_code` varchar(50) NOT NULL,
  `equipment_name` varchar(150) NOT NULL,
  `serial` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `zone` varchar(100) DEFAULT NULL,
  `operating_hours` int(11) DEFAULT 0,
  `duty_percent` int(11) DEFAULT 0,
  `status` varchar(50) DEFAULT 'Available',
  `fuel_battery` int(11) DEFAULT 100,
  `power_type` varchar(50) DEFAULT 'Diesel',
  `assigned_flight` varchar(100) DEFAULT 'Unassigned',
  `assigned_operator` varchar(150) DEFAULT 'Standby Dispatch',
  `service_schedule` varchar(100) DEFAULT 'Nominal',
  `next_check` varchar(100) DEFAULT '30d (Standard)',
  `last_service` varchar(100) DEFAULT 'Today',
  `gps` varchar(100) DEFAULT NULL,
  `last_inspection` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `equipment_code`, `equipment_name`, `serial`, `description`, `category`, `location`, `zone`, `operating_hours`, `duty_percent`, `status`, `fuel_battery`, `power_type`, `assigned_flight`, `assigned_operator`, `service_schedule`, `next_check`, `last_service`, `gps`, `last_inspection`, `created_at`) VALUES
(1, 'GPU-001', 'Ground Power Unit 01', NULL, NULL, 'Ground Power Unit', 'Bay A1', NULL, 0, 0, 'Available', 100, 'Diesel', 'Unassigned', 'Standby Dispatch', 'Nominal', '30d (Standard)', 'Today', NULL, '2026-09-28', '2026-10-05 10:39:17'),
(2, 'TUG-001', 'Aircraft Pushback Tug 01', NULL, NULL, 'Pushback Tug', 'Bay A2', NULL, 0, 0, NULL, 100, 'Diesel', 'Unassigned', 'Standby Dispatch', 'Nominal', '30d (Standard)', 'Today', NULL, '2026-09-25', '2026-10-05 10:39:17'),
(3, 'BLT-001', 'Belt Loader 01', NULL, NULL, 'Baggage Equipment', 'Bay B1', NULL, 0, 0, 'Available', 100, 'Diesel', 'Unassigned', 'Standby Dispatch', 'Nominal', '30d (Standard)', 'Today', NULL, '2026-09-30', '2026-10-05 10:39:17'),
(4, 'BUS-001', 'Passenger Apron Bus 01', NULL, NULL, 'Passenger Transport', 'Terminal 1', NULL, 0, 0, 'Available', 100, 'Diesel', 'Unassigned', 'Standby Dispatch', 'Nominal', '30d (Standard)', 'Today', NULL, '2026-09-27', '2026-10-05 10:39:17'),
(5, 'FUEL-001', 'Aircraft Refuelling Unit 01', NULL, NULL, 'Fuel Equipment', 'Fuel Station', NULL, 0, 0, 'Maintenance', 100, 'Diesel', 'Unassigned', 'Standby Dispatch', 'Nominal', '30d (Standard)', 'Today', NULL, '2026-09-20', '2026-10-05 10:39:17'),
(6, 'STAIR-001', 'Passenger Boarding Stairs 01', NULL, NULL, 'Passenger Equipment', 'Bay C2', NULL, 0, 0, 'Available', 100, 'Diesel', 'Unassigned', 'Standby Dispatch', 'Nominal', '30d (Standard)', 'Today', NULL, '2026-10-01', '2026-10-05 10:39:17'),
(7, 'TUG-025', 'TLD TPX-200', 'TLD-9988X', 'Towbarless Electric Pushback Tractor', 'Pushback Tug', 'Apron Staging Bay S5', 'Terminal 1 Apron', 450, 4, '0', 95, 'Hybrid 400V', 'Unassigned', 'Standby Dispatch', 'Nominal', '30d (Standard)', 'Today', '01.3580° N, 103.9890° E', NULL, '2026-10-05 11:54:28'),
(8, 'TUG-026', 'TLD TPX-200', 'TLD-9988X', 'Towbarless Electric Pushback Tractor', 'Pushback Tug', 'Apron Staging Bay S5', 'Terminal 1 Apron', 450, 4, '0', 95, 'Lithium e-GSE', 'Unassigned', 'Standby Dispatch', 'Nominal', '30d (Standard)', 'Today', '01.3580° N, 103.9890° E', NULL, '2026-10-05 13:35:52');

-- --------------------------------------------------------

--
-- Table structure for table `fault_reports`
--

CREATE TABLE `fault_reports` (
  `id` int(11) NOT NULL,
  `fault_code` varchar(50) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `equipment_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `reported_by_name` varchar(100) DEFAULT NULL,
  `severity` varchar(50) DEFAULT NULL,
  `grounded` tinyint(1) DEFAULT 0,
  `status` varchar(50) DEFAULT 'Open',
  `notes` longtext DEFAULT NULL,
  `reported_by` int(11) DEFAULT NULL,
  `reported_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fault_reports`
--

INSERT INTO `fault_reports` (`id`, `fault_code`, `category`, `equipment_id`, `title`, `description`, `location`, `reported_by_name`, `severity`, `grounded`, `status`, `notes`, `reported_by`, `reported_at`) VALUES
(1, 'FLT-9422', 'Electrical', 1, '', 'Electrical failure', 'Bay A1', 'Test', 'High', 1, 'Reported', '[]', NULL, '2026-10-05 12:42:32');

-- --------------------------------------------------------

--
-- Table structure for table `inspections`
--

CREATE TABLE `inspections` (
  `id` int(11) NOT NULL,
  `inspection_code` varchar(50) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `inspection_type` varchar(50) NOT NULL,
  `inspector` varchar(100) NOT NULL,
  `checks` longtext DEFAULT NULL,
  `result` varchar(50) DEFAULT 'Pending',
  `status` varchar(50) DEFAULT 'Pending',
  `inspection_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inspections`
--

INSERT INTO `inspections` (`id`, `inspection_code`, `equipment_id`, `inspection_type`, `inspector`, `checks`, `result`, `status`, `inspection_date`, `created_at`) VALUES
(1, 'INS-2313', 7, 'Pre-use', 'test', '{\"Brakes\":\"Pass\",\"Tyres\":\"Pass\",\"Hydraulic System\":\"Pass\",\"Lights\":\"Pass\",\"Warning Indicators\":\"Pass\",\"Battery\":\"Pass\",\"Emergency Stop\":\"Pass\",\"Fluid Leakage\":\"Pass\",\"External Damage\":\"Pass\"}', 'Pass', 'Completed', '2026-10-05', '2026-10-05 12:59:24');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance`
--

CREATE TABLE `maintenance` (
  `id` int(11) NOT NULL,
  `work_order_code` varchar(50) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `fault_id` int(11) DEFAULT NULL,
  `maintenance_type` varchar(50) NOT NULL,
  `priority` varchar(20) NOT NULL DEFAULT 'Medium',
  `technician` varchar(100) DEFAULT NULL,
  `scheduled_date` date NOT NULL,
  `problem` text NOT NULL,
  `notes` text DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Created',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance`
--

INSERT INTO `maintenance` (`id`, `work_order_code`, `equipment_id`, `fault_id`, `maintenance_type`, `priority`, `technician`, `scheduled_date`, `problem`, `notes`, `status`, `created_at`) VALUES
(1, 'MNT-2818', 5, NULL, 'Preventive', 'High', 'John', '2026-09-11', 'Fuel pipe burst', '', 'Assigned', '2026-10-05 13:03:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `employee_code` varchar(30) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'Operator',
  `department` varchar(100) DEFAULT NULL,
  `status` varchar(30) DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_code`, `name`, `email`, `password`, `role`, `department`, `status`, `created_at`) VALUES
(1, 'EMP-001', 'AeroGround Administrator', 'admin@aeroground.com', '$2y$10$s1bvZoO1lSnu5zqHxsP4lufOivSIMLx7M5Ptml2JQJZOljbXxerRq', 'Administrator', 'Airport Operations', 'Active', '2026-10-05 13:17:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipment_id` (`equipment_id`),
  ADD KEY `assigned_to` (`assigned_to`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `equipment_code` (`equipment_code`);

--
-- Indexes for table `fault_reports`
--
ALTER TABLE `fault_reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fault_code` (`fault_code`),
  ADD KEY `equipment_id` (`equipment_id`),
  ADD KEY `reported_by` (`reported_by`);

--
-- Indexes for table `inspections`
--
ALTER TABLE `inspections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inspection_code` (`inspection_code`),
  ADD KEY `equipment_id` (`equipment_id`);

--
-- Indexes for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `work_order_code` (`work_order_code`),
  ADD KEY `equipment_id` (`equipment_id`),
  ADD KEY `fault_id` (`fault_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `employee_code` (`employee_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `fault_reports`
--
ALTER TABLE `fault_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inspections`
--
ALTER TABLE `inspections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `fault_reports`
--
ALTER TABLE `fault_reports`
  ADD CONSTRAINT `fault_reports_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fault_reports_ibfk_2` FOREIGN KEY (`reported_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `inspections`
--
ALTER TABLE `inspections`
  ADD CONSTRAINT `inspections_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`fault_id`) REFERENCES `fault_reports` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
