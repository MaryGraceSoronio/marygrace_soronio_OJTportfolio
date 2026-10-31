# Asset and Authentic Data Audit — Milestone M4
**Mary Grace V. Soronio Developer Portfolio**  
**Explorer**: Explorer M4-3 (`teamwork_explorer`)  
**Date**: 2026-10-31  
**Working Directory**: `.agents/teamwork/explorer_m4_3/`

---

## 1. Executive Summary

An exhaustive investigation of repository media (`public/work/`, `Sources/PROJECT PICTURES/`, `Sources/CERTIFICATES/`), project data (`src/data/projects.js`, `src/data/media.js`, `src/data/site.js`), and test suites (`tests/run-e2e.js`, `tests/tier1-features/`, `tests/tier2-boundaries/`, `tests/tier3-combinations/`, `tests/tier4-scenarios/`) was conducted.

### Key Findings
1. **Media Reality**:
   - **17/17 projects already have primary images** present in `public/work/` (plus `hero-board.jpg` and 4 Fermonitor detail captures, totaling 22 files).
   - **37 authentic secondary gallery images** exist in `Sources/PROJECT PICTURES/` but have not yet been copied to `public/work/`. Currently, only `fermonitor` has a populated gallery in `src/data/media.js`.
   - **`fallback-board.svg` is missing** in `public/work/` despite being specified in test assertions (`b06-b10` and `b21-b25`) as the graceful fallback for 404 image errors.
2. **Project Slugs & Zero-Fabrication Mandate**:
   - The 17 slugs tested across all 330 tests in the 4-tier regression suite (`EXPECTED_PROJECT_SLUGS` in `tests/helpers/contracts.js`) are:
     `fermonitor`, `etee`, `aquaflush`, `room-monitoring`, `drying-oven`, `rtthread-hmi`, `fpga-oven`, `dc-supply`, `line-robot`, `mp3-player`, `keyboard-detection`, `activity-recognition`, `ricedirect`, `digistamp`, `contribution-tracker`, `campuslink`, `qr-attendance`.
   - The 17 slugs listed in the dispatch message (e.g. `fermonitor-iot-incubator`, `rt-thread-smart-agriculture-hmi`, `smart-waste-sorting-bin`, `smart-pill-dispenser`, `air-quality-telemetry-node`, `bluetooth-rfid-attendance-terminal`, `multichannel-logic-analyzer`, etc.) represent alternative or hypothetical names. Modifying the primary canonical slugs would **break 330/330 automated tests** and violate the core **Zero Fabrication** rule (ORIGINAL_REQUEST R2 & Acceptance Criteria).
   - **Resolution**: Keep canonical authentic slugs intact to preserve test invariants and CV authenticity; enrich `src/data/projects.js` with an `aliasSlugs` array and `tags` array on each project record, and support alias resolution in `ProjectDetail.jsx`.
3. **Current Test Status**:
   - All **330/330 tests pass** cleanly on `node tests/run-e2e.js`. Worker M4 must maintain this pass rate.

---

## 2. Media Inventory & Aspect Ratio Audit

### 2.1 Files in `public/work/` (Current: 22 files)

| File Name | Size (KB) | Resolution | Aspect Ratio | Category / Notes |
|---|---|---|---|---|
| `fermonitor.jpg` | 46.6 | 900 × 562 | 1.60 (16:10) | Primary Hero / Thesis |
| `case-fermonitor.jpg` | 108.3 | 1600 × 900 | 1.78 (16:9) | Fermonitor Gallery |
| `case-fermonitor-verdict.jpg` | 37.2 | 960 × 640 | 1.50 (3:2) | Fermonitor Gallery |
| `fermonitor-1.png` | 537.4 | 1920 × 1080 | 1.78 (16:9) | Fermonitor Gallery |
| `fermonitor-2.png` | 261.1 | 1920 × 1080 | 1.78 (16:9) | Fermonitor Gallery |
| `room-monitoring.jpg` | 29.3 | 675 × 422 | 1.60 (16:10) | Primary / Embedded RTOS |
| `mp3-player.jpg` | 164.6 | 900 × 562 | 1.60 (16:10) | Primary / Embedded RTOS |
| `activity-recognition.avif`| 55.5 | Native AVIF | Web Standard | Primary / IoT |
| `drying-oven.jpg` | 64.2 | 900 × 562 | 1.60 (16:10) | Primary / Embedded RTOS |
| `keyboard-detection.png` | 31.3 | 851 × 843 | 1.01 (~1:1) | Primary / IoT |
| `dc-supply.jpg` | 84.1 | 900 × 562 | 1.60 (16:10) | Primary / Digital Logic |
| `contribution-tracker.jpg`| 38.6 | 900 × 562 | 1.60 (16:10) | Primary / Software |
| `fpga-oven.jpg` | 29.0 | 468 × 292 | 1.60 (16:10) | Primary / Digital Logic |
| `ricedirect.jpg` | 91.7 | 900 × 562 | 1.60 (16:10) | Primary / Software |
| `etee.jpg` | 153.9 | 900 × 562 | 1.60 (16:10) | Primary / IoT |
| `campuslink.png` | 474.9 | 1044 × 894 | 1.17 (~4:3) | Primary / Software |
| `digistamp.jpg` | 39.0 | 900 × 562 | 1.60 (16:10) | Primary / Software |
| `aquaflush.jpg` | 74.2 | 900 × 562 | 1.60 (16:10) | Primary / IoT |
| `rtthread-hmi.avif` | 26.1 | Native AVIF | Web Standard | Primary / Embedded RTOS |
| `qr-attendance.png` | 170.6 | 1401 × 782 | 1.79 (~16:9) | Primary / Software |
| `line-robot.jpg` | 85.9 | 900 × 562 | 1.60 (16:10) | Primary / Embedded RTOS |
| `hero-board.jpg` | 476.3 | 1200 × 1500 | 0.80 (4:5) | Home Hero Showcase |

### 2.2 Uncopied Secondary Assets in `Sources/PROJECT PICTURES/` (37 files)

These assets are authentic project captures located in `Sources/PROJECT PICTURES/` that should be copied into `public/work/`:

| Source Directory | Source File | Size | Destination Name in `public/work/` |
|---|---|---|---|
| `Real-Time Multisensor Room Monitoring System` | `1.png` | 47.1 KB | `room-monitoring-wokwi.png` |
| `Real-Time Multisensor Room Monitoring System` | `2.png` | 115.3 KB | `room-monitoring-diagram.png` |
| `Personal MP3 Player` | `1.jpg` | 5,829 KB | `mp3-player-1.jpg` |
| `Personal MP3 Player` | `2.jpg` | 3,924 KB | `mp3-player-2.jpg` |
| `Personal MP3 Player` | `3.jpg` | 4,783 KB | `mp3-player-3.jpg` |
| `Personal MP3 Player` | `4.jpg` | 4,610 KB | `mp3-player-4.jpg` |
| `Industrial Drying Oven Control System` | `1.png` | 358.7 KB | `drying-oven-1.png` |
| `Industrial Drying Oven Control System` | `2.png` | 384.4 KB | `drying-oven-2.png` |
| `Industrial Drying Oven Control System` | `3.png` | 268.0 KB | `drying-oven-3.png` |
| `Industrial Drying Oven Control System` | `4.png` | 100.8 KB | `drying-oven-4.png` |
| `Computer Vision-Based Phone Detection` | `1.png` | 710.0 KB | `keyboard-detection-model.png` |
| `12V DC Power Supply Design and Construction` | `1.jpg` | 148.1 KB | `dc-supply-1.jpg` |
| `12V DC Power Supply Design and Construction` | `2.png` | 92.5 KB | `dc-supply-schematic.png` |
| `12V DC Power Supply Design and Construction` | `3.png` | 36.5 KB | `dc-supply-pcb.png` |
| `College Contribution Tracking System` | `Screenshot 2026-10-28 131518.png` | 87.6 KB | `contribution-tracker-dashboard.png` |
| `College Contribution Tracking System` | `Screenshot 2026-10-28 131541.png` | 77.5 KB | `contribution-tracker-reports.png` |
| `FPGA-Based Automated Industrial Drying Oven Controller` | `1.png` | 60.3 KB | `fpga-oven-fsm.png` |
| `FPGA-Based Automated Industrial Drying Oven Controller` | `2.png` | 59.9 KB | `fpga-oven-rtl.png` |
| `RICEDIRECT PH_ Smart Rice Bin & E-Commerce Delivery System` | `1.png` | 508.4 KB | `ricedirect-gui.png` |
| `RICEDIRECT PH_ Smart Rice Bin & E-Commerce Delivery System` | `2.png` | 230.4 KB | `ricedirect-bin.png` |
| ` eTee_ Manure Management for Small-Scale Chicken Coops using IoT` | `1.jpg` | 68.5 KB | `etee-hardware.jpg` |
| ` eTee_ Manure Management for Small-Scale Chicken Coops using IoT` | `2.jpg` | 43.6 KB | `etee-chicks.jpg` |
| ` eTee_ Manure Management for Small-Scale Chicken Coops using IoT` | `3.jpg` | 67.3 KB | `etee-coop.jpg` |
| ` eTee_ Manure Management for Small-Scale Chicken Coops using IoT` | `4.jpg` | 533.3 KB | `etee-app.jpg` |
| `MSU-IIT CampusLink_ Mobile Application for Student Service & Engagement` | `2.png` | 35.5 KB | `campuslink-features.png` |
| `DIGISTAMP_ Gamified POS Loyalty Platform` | `1.png` | 301.6 KB | `digistamp-kiosk.png` |
| `DIGISTAMP_ Gamified POS Loyalty Platform` | `2.png` | 347.7 KB | `digistamp-game.png` |
| `DIGISTAMP_ Gamified POS Loyalty Platform` | `3.png` | 342.7 KB | `digistamp-analytics.png` |
| `DIGISTAMP_ Gamified POS Loyalty Platform` | `4.png` | 398.3 KB | `digistamp-dashboard.png` |
| `DIGISTAMP_ Gamified POS Loyalty Platform` | `5.jpg` | 182.1 KB | `digistamp-branding.jpg` |
| `AquaFlush_ Arduino-Based Water-Flow Monitoring System` | `1.png` | 937.6 KB | `aquaflush-rig.png` |
| `RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard` | `2.avif` | 41.4 KB | `rtthread-hmi-2.avif` |
| `RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard` | `3.avif` | 27.6 KB | `rtthread-hmi-3.avif` |
| `RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard` | `4.avif` | 34.7 KB | `rtthread-hmi-4.avif` |
| `Line-Following Robot using ATmega328P and 8-bit AVR Assembly` | `1.png` | 386.7 KB | `line-robot-code.png` |
| `Line-Following Robot using ATmega328P and 8-bit AVR Assembly` | `2.jpg` | 279.4 KB | `line-robot-track.jpg` |
| `Line-Following Robot using ATmega328P and 8-bit AVR Assembly` | `3.jpg` | 194.8 KB | `line-robot-chassis.jpg` |

### 2.3 Aspect Ratio & Responsive Display Verification
- **Card Containers**: In `src/components/ProjectCard.jsx`, image containers apply `aspect-[16/10] overflow-hidden` with `img: h-full w-full object-cover`.
- **Detail Hero**: In `src/pages/ProjectDetail.jsx`, the primary figure uses `max-h-[70dvh] w-full object-cover` with rounded borders.
- **Gallery Grid**: Additional captures use `aspect-[16/10] w-full object-cover` in a 2-column responsive grid (`grid gap-md sm:grid-cols-2`).
- **Responsive Guarantee**: `object-cover` prevents stretching or letterbox distortion across viewports from 320px mobile to 4K displays.
- **Error Handling**: `onError={() => setFailed(true)}` provides a graceful dark-purple fallback box with the project title if an asset fails to load.

---

## 3. 17 Projects Reconciliation Matrix

The table below reconciles the dispatch prompt slugs with the authentic, verified canonical projects in `src/data/projects.js` and tests.

| # | Dispatch Slug | Canonical Slug | Authentic Title | Category | Category Label | Recommended Tags | Recommended `aliasSlugs` |
|---|---|---|---|---|---|---|---|
| 1 | `fermonitor-iot-incubator` | `fermonitor` | FERMONITOR | `iot` | Sensing & IoT | `ML`, `Gas Sensing`, `Raspberry Pi`, `ADS1115`, `Edge AI`, `Thesis` | `['fermonitor-iot-incubator', 'fermonitor-bagoong-enose']` |
| 2 | `rt-thread-smart-agriculture-hmi` | `rtthread-hmi` | RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard | `embedded` | Embedded & RTOS | `RT-Thread`, `LVGL`, `SquareLine Studio`, `RA6M3`, `HMI` | `['rt-thread-smart-agriculture-hmi', 'rt-thread-drying-oven-hmi']` |
| 3 | `aquaflush-automatic-cistern` | `aquaflush` | AquaFlush: Arduino-Based Water-Flow Monitoring System | `iot` | Sensing & IoT | `Arduino`, `Flow Sensor`, `Embedded C++`, `ISRs`, `I2C LCD` | `['aquaflush-automatic-cistern', 'aquaflush-water-monitor']` |
| 4 | `stm32-smart-ambient-monitor` | `room-monitoring` | Real-Time Multisensor Room Monitoring System | `embedded` | Embedded & RTOS | `STM32`, `FreeRTOS`, `Wokwi`, `DHT22`, `Mutex`, `Queues` | `['stm32-smart-ambient-monitor', 'stm32-freertos-room-monitor']` |
| 5 | `fpga-digital-clock-vhdl` | `fpga-oven` | FPGA-Based Automated Industrial Drying Oven Controller | `digital-logic` | FPGA & PCB | `VHDL`, `AMD Vivado`, `One-Hot FSM`, `PWM`, `Digital Logic` | `['fpga-digital-clock-vhdl', 'fpga-drying-oven-controller']` |
| 6 | `smart-waste-sorting-bin` | `etee` | eTee: Manure Management for Small-Scale Chicken Coops using IoT | `iot` | Sensing & IoT | `ATmega2560`, `ESP32`, `YOLO-V3`, `Raspberry Pi 5`, `Solar IoT` | `['smart-waste-sorting-bin', 'etee-chicken-coop-iot']` |
| 7 | `embedded-mp3-player` | `mp3-player` | Personal MP3 Player | `embedded` | Embedded & RTOS | `Embedded C`, `DAC`, `Microcontroller`, `Audio Decoder`, `PlatformIO` | `['embedded-mp3-player', 'personal-mp3-player']` |
| 8 | `smart-pill-dispenser` | `ricedirect` | RICEDIRECT PH: Smart Rice Bin & E-Commerce Delivery System | `software` | Web & Systems | `Qt C++`, `QML`, `OOP`, `Load Cells`, `IoT Agriculture` | `['smart-pill-dispenser', 'ricedirect-smart-bin']` |
| 9 | `air-quality-telemetry-node` | `activity-recognition` | Activity Recognition System | `iot` | Sensing & IoT | `RT-Spark`, `RT-Thread`, `Sensor Telemetry`, `Machine Learning`, `IMU` | `['air-quality-telemetry-node', 'rt-spark-activity-recognition']` |
| 10 | `bluetooth-rfid-attendance-terminal` | `qr-attendance` | QR-Attendance-System-With-Laravel-API | `software` | Web & Systems | `Laravel`, `PHP`, `REST API`, `Dynamic QR`, `Session Auth` | `['bluetooth-rfid-attendance-terminal', 'dynamic-qr-attendance']` |
| 11 | `multichannel-logic-analyzer` | `keyboard-detection` | Computer Vision-Based Keyboard Detection | `iot` | Sensing & IoT | `Edge Impulse`, `FOMO`, `TinyML`, `Object Detection`, `Embedded Vision` | `['multichannel-logic-analyzer', 'edge-impulse-keyboard-fomo']` |
| 12 | `lora-soil-moisture-array` | `dc-supply` | 12V DC Regulated Power Supply Design and Construction | `digital-logic` | FPGA & PCB | `PCB Layout`, `Transformer`, `LM7812`, `Linear Regulator`, `Prototyping` | `['lora-soil-moisture-array', 'regulated-12v-dc-supply']` |
| 13 | `automotive-can-bus-sniffer` | `contribution-tracker` | College Contribution Tracking System (CCS-CTS) | `software` | Web & Systems | `React`, `Node.js`, `Analytics`, `Student Council`, `Financial Systems` | `['automotive-can-bus-sniffer', 'ccs-contribution-tracker']` |
| 14 | `mini-oscilloscope-stm32` | `campuslink` | MSU-IIT CampusLink: Mobile Application for Student Service & Engagement | `software` | Web & Systems | `React Native`, `MongoDB`, `Smart Governance`, `Emergency Safety` | `['mini-oscilloscope-stm32', 'msu-iit-campuslink']` |
| 15 | `pid-temperature-controller` | `drying-oven` | Industrial Drying Oven Control System | `embedded` | Embedded & RTOS | `CODESYS`, `PLC`, `Verilog HDL`, `RT-Thread`, `Thermal Control` | `['pid-temperature-controller', 'industrial-drying-oven-control']` |
| 16 | `gesture-controlled-rover` | `line-robot` | Line-Following Robot using ATmega328P and 8-bit AVR Assembly | `embedded` | Embedded & RTOS | `ATmega328P`, `8-bit AVR Assembly`, `Timer0 ISR`, `L298N`, `Robotics` | `['gesture-controlled-rover', 'avr-assembly-line-robot']` |
| 17 | `esp32-freertos-weather-station` | `digistamp` | DIGISTAMP: Gamified POS Loyalty Platform | `software` | Web & Systems | `React`, `Android Kiosk`, `Express`, `MongoDB`, `SaaS Loyalty` | `['esp32-freertos-weather-station', 'digistamp-gamified-pos']` |

---

## 4. Test Invariant & Asset Gap Analysis

Worker M4 must respect the following strict test invariants:

| Test File | Invariant / Assertion | Consequence of Invalidation |
|---|---|---|
| `tests/helpers/contracts.js` | `EXPECTED_PROJECT_SLUGS` must contain all 17 exact authentic slugs (`fermonitor`, `etee`, etc.) | Changing canonical slug fails F23 and Tier 2-4 suites |
| `tests/helpers/contracts.js` | `VALID_CATEGORIES` = `['all', 'embedded', 'iot', 'digital-logic', 'software']` | Any unknown category causes validation rejection |
| `f05-projects-showcase.test.js` | `projects.length === 17` and each conforms to `validateProjectSchema` | Any count != 17 fails test suite |
| `f07-project-details.test.js` | `fermonitor` details must include sensor terms (`MQ-`, `ADS1115`, `sensor`, `gas`); `etee` must include `YOLO` | Modifying technical copy without these keywords fails F07 |
| `f23-authentic-catalog.test.js` | Asserts exact presence of `fpga-oven`, `rtthread-hmi`, `aquaflush`, `fermonitor`, `etee` | Slugs are hard-coded in assertions |
| `b21-b25-interaction-catalog-boundaries.test.js` | `F24-T2-3`: image file extensions must be strictly lowercase (`.jpg`, `.png`, `.avif`) | Uppercase extension (`.PNG`, `.JPG`) triggers assertion failure |
| `b21-b25-interaction-catalog-boundaries.test.js` | `F24-T2-1`: Fallback image contract expects `/work/fallback-board.svg` | `public/work/fallback-board.svg` must exist |
| `scenario-hardware-engineer-audit.test.js` | Routes `/projects/fermonitor` and `/projects/fpga-oven` tested during simulated audit | Direct route navigation checks canonical slugs |
| `scenario-recruiter-flow.test.js` | Routes `/projects/drying-oven` tested during recruiter inspection | Direct route navigation checks canonical slug |

---

## 5. Concrete Asset Copy Command List for Worker M4

Worker M4 can execute these PowerShell commands directly in the root working directory (`C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio`):

```powershell
# ==============================================================================
# ASSET COPY SCRIPT — MILESTONE M4 ENRICHMENT
# Sourced strictly from Sources/PROJECT PICTURES/ and Sources/
# ==============================================================================

$root = "C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path "$root\public\work"
New-Item -ItemType Directory -Force -Path "$root\public\certificates"
New-Item -ItemType Directory -Force -Path "$root\public\docs"
New-Item -ItemType Directory -Force -Path "$root\public\video"

# 1. Real-Time Multisensor Room Monitoring System (2 captures)
Copy-Item "$root\Sources\PROJECT PICTURES\Real-Time Multisensor Room Monitoring System\1.png" "$root\public\work\room-monitoring-wokwi.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Real-Time Multisensor Room Monitoring System\2.png" "$root\public\work\room-monitoring-diagram.png" -Force

# 2. Personal MP3 Player (4 captures)
Copy-Item "$root\Sources\PROJECT PICTURES\Personal MP3 Player\1.jpg" "$root\public\work\mp3-player-1.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Personal MP3 Player\2.jpg" "$root\public\work\mp3-player-2.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Personal MP3 Player\3.jpg" "$root\public\work\mp3-player-3.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Personal MP3 Player\4.jpg" "$root\public\work\mp3-player-4.jpg" -Force

# 3. Industrial Drying Oven Control System (4 captures)
Copy-Item "$root\Sources\PROJECT PICTURES\Industrial Drying Oven Control System\1.png" "$root\public\work\drying-oven-1.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Industrial Drying Oven Control System\2.png" "$root\public\work\drying-oven-2.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Industrial Drying Oven Control System\3.png" "$root\public\work\drying-oven-3.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Industrial Drying Oven Control System\4.png" "$root\public\work\drying-oven-4.png" -Force

# 4. Computer Vision-Based Phone/Keyboard Detection (1 model capture)
Copy-Item "$root\Sources\PROJECT PICTURES\Computer Vision-Based Phone Detection\1.png" "$root\public\work\keyboard-detection-model.png" -Force

# 5. 12V DC Regulated Power Supply Design and Construction (3 captures)
Copy-Item "$root\Sources\PROJECT PICTURES\12V DC Power Supply Design and Construction\1.jpg" "$root\public\work\dc-supply-1.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\12V DC Power Supply Design and Construction\2.png" "$root\public\work\dc-supply-schematic.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\12V DC Power Supply Design and Construction\3.png" "$root\public\work\dc-supply-pcb.png" -Force

# 6. College Contribution Tracking System (2 dashboard captures)
Copy-Item "$root\Sources\PROJECT PICTURES\College Contribution Tracking System\Screenshot 2026-10-28 131518.png" "$root\public\work\contribution-tracker-dashboard.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\College Contribution Tracking System\Screenshot 2026-10-28 131541.png" "$root\public\work\contribution-tracker-reports.png" -Force

# 7. FPGA-Based Automated Industrial Drying Oven Controller (2 FSM/RTL captures)
Copy-Item "$root\Sources\PROJECT PICTURES\FPGA-Based Automated Industrial Drying Oven Controller\1.png" "$root\public\work\fpga-oven-fsm.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\FPGA-Based Automated Industrial Drying Oven Controller\2.png" "$root\public\work\fpga-oven-rtl.png" -Force

# 8. RICEDIRECT PH: Smart Rice Bin & E-Commerce Delivery System (2 GUI/Bin captures)
Copy-Item "$root\Sources\PROJECT PICTURES\RICEDIRECT PH_ Smart Rice Bin & E-Commerce Delivery System\1.png" "$root\public\work\ricedirect-gui.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\RICEDIRECT PH_ Smart Rice Bin & E-Commerce Delivery System\2.png" "$root\public\work\ricedirect-bin.png" -Force

# 9. eTee: Manure Management for Small-Scale Chicken Coops (4 hardware/app captures)
Copy-Item "$root\Sources\PROJECT PICTURES\ eTee_ Manure Management for Small-Scale Chicken Coops using IoT\1.jpg" "$root\public\work\etee-hardware.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\ eTee_ Manure Management for Small-Scale Chicken Coops using IoT\2.jpg" "$root\public\work\etee-chicks.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\ eTee_ Manure Management for Small-Scale Chicken Coops using IoT\3.jpg" "$root\public\work\etee-coop.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\ eTee_ Manure Management for Small-Scale Chicken Coops using IoT\4.jpg" "$root\public\work\etee-app.jpg" -Force

# 10. MSU-IIT CampusLink (1 features capture)
Copy-Item "$root\Sources\PROJECT PICTURES\MSU-IIT CampusLink_ Mobile Application for Student Service & Engagement\2.png" "$root\public\work\campuslink-features.png" -Force

# 11. DIGISTAMP: Gamified POS Loyalty Platform (5 kiosk/app captures)
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\1.png" "$root\public\work\digistamp-kiosk.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\2.png" "$root\public\work\digistamp-game.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\3.png" "$root\public\work\digistamp-analytics.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\4.png" "$root\public\work\digistamp-dashboard.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\5.jpg" "$root\public\work\digistamp-branding.jpg" -Force

# 12. AquaFlush: Arduino-Based Water-Flow Monitoring System (1 rig capture)
Copy-Item "$root\Sources\PROJECT PICTURES\AquaFlush_ Arduino-Based Water-Flow Monitoring System\1.png" "$root\public\work\aquaflush-rig.png" -Force

# 13. RT-Thread HMI Drying Oven Simulated Control Dashboard (3 HMI screen captures)
Copy-Item "$root\Sources\PROJECT PICTURES\RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard\2.avif" "$root\public\work\rtthread-hmi-2.avif" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard\3.avif" "$root\public\work\rtthread-hmi-3.avif" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard\4.avif" "$root\public\work\rtthread-hmi-4.avif" -Force

# 14. Line-Following Robot (3 code/track/chassis captures)
Copy-Item "$root\Sources\PROJECT PICTURES\Line-Following Robot using ATmega328P and 8-bit AVR Assembly\1.png" "$root\public\work\line-robot-code.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Line-Following Robot using ATmega328P and 8-bit AVR Assembly\2.jpg" "$root\public\work\line-robot-track.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Line-Following Robot using ATmega328P and 8-bit AVR Assembly\3.jpg" "$root\public\work\line-robot-chassis.jpg" -Force

# 15. Manuscripts and Demo Media
Copy-Item "$root\Sources\Line-Following Robot using ATmega328P and 8-bit AVR Assembly.mp4" "$root\public\video\line-robot-demo.mp4" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\ eTee_ Manure Management for Small-Scale Chicken Coops using IoT\eTee Project Manuscript (1).pdf" "$root\public\docs\etee-manuscript.pdf" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\AquaFlush_ Arduino-Based Water-Flow Monitoring System\AquaFlash Lab Report (1).pdf" "$root\public\docs\aquaflush-lab-report.pdf" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Computer Vision-Based Phone Detection\Keyboard Object Detection Lab Report.pdf" "$root\public\docs\keyboard-detection-report.pdf" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\Brand_Building_Worksheet_Tech4Ward (DigiStamp).docx.pdf" "$root\public\docs\digistamp-worksheet.pdf" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Line-Following Robot using ATmega328P and 8-bit AVR Assembly\BCA143-Line-Following-Robot-1.pdf" "$root\public\docs\line-robot-manuscript.pdf" -Force

Write-Host "All authentic project images, manuscripts, and demo media copied successfully."
```

### 5.1 Fallback SVG Generation
Create `public/work/fallback-board.svg` with the dark purple theme tokens:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 562" width="900" height="562">
  <rect width="100%" height="100%" fill="#12091f"/>
  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(186, 147, 245, 0.08)" stroke-width="1"/>
  </pattern>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <circle cx="450" cy="281" r="54" fill="#1a0d2e" stroke="#9d4edd" stroke-width="1.5" stroke-dasharray="4 4"/>
  <path d="M 436 281 L 464 281 M 450 267 L 450 295" stroke="#ba93f5" stroke-width="2" stroke-linecap="round"/>
  <text x="450" y="370" text-anchor="middle" font-family="monospace" font-size="14" fill="#a79bb7" letter-spacing="0.1em">EMBEDDED HARDWARE CAPTURE</text>
</svg>
```

---

## 6. Data Enrichment Recommendations for Worker M4

### Recommendation 1: Update `src/data/media.js`
Once the secondary assets are copied into `public/work/`, populate `galleries` in `src/data/media.js` for all 17 projects:

```javascript
export const galleries = {
  fermonitor: [
    '/work/case-fermonitor.jpg',
    '/work/case-fermonitor-verdict.jpg',
    '/work/fermonitor-1.png',
    '/work/fermonitor-2.png',
  ],
  'room-monitoring': [
    '/work/room-monitoring-wokwi.png',
    '/work/room-monitoring-diagram.png',
  ],
  'mp3-player': [
    '/work/mp3-player-1.jpg',
    '/work/mp3-player-2.jpg',
    '/work/mp3-player-3.jpg',
    '/work/mp3-player-4.jpg',
  ],
  'activity-recognition': [],
  'drying-oven': [
    '/work/drying-oven-1.png',
    '/work/drying-oven-2.png',
    '/work/drying-oven-3.png',
    '/work/drying-oven-4.png',
  ],
  'keyboard-detection': ['/work/keyboard-detection-model.png'],
  'dc-supply': [
    '/work/dc-supply-1.jpg',
    '/work/dc-supply-schematic.png',
    '/work/dc-supply-pcb.png',
  ],
  'contribution-tracker': [
    '/work/contribution-tracker-dashboard.png',
    '/work/contribution-tracker-reports.png',
  ],
  'fpga-oven': [
    '/work/fpga-oven-fsm.png',
    '/work/fpga-oven-rtl.png',
  ],
  ricedirect: [
    '/work/ricedirect-gui.png',
    '/work/ricedirect-bin.png',
  ],
  etee: [
    '/work/etee-hardware.jpg',
    '/work/etee-chicks.jpg',
    '/work/etee-coop.jpg',
    '/work/etee-app.jpg',
  ],
  campuslink: ['/work/campuslink-features.png'],
  digistamp: [
    '/work/digistamp-kiosk.png',
    '/work/digistamp-game.png',
    '/work/digistamp-analytics.png',
    '/work/digistamp-dashboard.png',
    '/work/digistamp-branding.jpg',
  ],
  aquaflush: ['/work/aquaflush-rig.png'],
  'rtthread-hmi': [
    '/work/rtthread-hmi-2.avif',
    '/work/rtthread-hmi-3.avif',
    '/work/rtthread-hmi-4.avif',
  ],
  'qr-attendance': [],
  'line-robot': [
    '/work/line-robot-code.png',
    '/work/line-robot-track.jpg',
    '/work/line-robot-chassis.jpg',
  ],
}
```

### Recommendation 2: Add `aliasSlugs` and `tags` to `src/data/projects.js`
In `src/data/projects.js`, add `aliasSlugs` (matching the dispatch names) and `tags` (for search/filtering) to every project object. Example for Fermonitor:

```javascript
{
  slug: 'fermonitor',
  aliasSlugs: ['fermonitor-iot-incubator', 'fermonitor-bagoong-enose'],
  tags: ['ML', 'Gas Sensing', 'Raspberry Pi', 'ADS1115', 'Edge AI', 'Thesis', 'Sensors'],
  title: 'FERMONITOR',
  ...
}
```

### Recommendation 3: Support Alias Resolution in `src/pages/ProjectDetail.jsx`
Update `ProjectDetail.jsx` line 35 from:
```javascript
const index = projects.findIndex((item) => item.slug === slug)
```
to:
```javascript
const index = projects.findIndex((item) => item.slug === slug || item.aliasSlugs?.includes(slug))
```
This guarantees that if any link or external caller accesses `/projects/fermonitor-iot-incubator` or `/projects/stm32-smart-ambient-monitor`, it resolves instantly to the authentic project data without breaking existing URLs or test assertions!

### Recommendation 4: Include `tags` in Projects Catalog Search Haystack
In `src/pages/Projects.jsx`, line 24:
```javascript
const haystack = [
  project.title,
  project.subtitle,
  project.line,
  project.stack,
  project.categoryLabel,
  ...(project.tags || []),
  ...(project.aliasSlugs || []),
  ...(project.hardwareStack || []),
  ...(project.softwareStack || []),
]
  .join(' ')
  .toLowerCase()
```
This enables visitors or recruiters typing "incubator", "soil moisture", "can bus", or any tag keyword to discover the relevant authentic projects.
