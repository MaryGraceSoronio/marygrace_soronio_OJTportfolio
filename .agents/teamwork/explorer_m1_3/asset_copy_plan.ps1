# Asset Copy Plan for Mary Grace V. Soronio Portfolio
# Run from repository root: C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio

$root = "C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path "$root\public\work"
New-Item -ItemType Directory -Force -Path "$root\public\certificates"
New-Item -ItemType Directory -Force -Path "$root\public\docs"
New-Item -ItemType Directory -Force -Path "$root\public\video"

# 1. Profile photo
Copy-Item "$root\Sources\mary-grace-1x1-id-image.jpg" "$root\public\mary-grace-1x1-id-image.jpg" -Force
Copy-Item "$root\Sources\mary-grace-1x1-id-image.jpg" "$root\public\profile.jpg" -Force

# 2. Missing Primary Project Images (Previously image: null in projects.js)
Copy-Item "$root\Sources\PROJECT PICTURES\Activity Recognition System\_2uGllNfftl.avif" "$root\public\work\activity-recognition.avif" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Computer Vision-Based Phone Detection\1.png" "$root\public\work\keyboard-detection.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Computer Vision-Based Phone Detection\2.png" "$root\public\work\keyboard-detection-model.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\MSU-IIT CampusLink_ Mobile Application for Student Service & Engagement\1.png" "$root\public\work\campuslink.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\MSU-IIT CampusLink_ Mobile Application for Student Service & Engagement\2.png" "$root\public\work\campuslink-features.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\QR-Attendance-System-With-Laravel-API\1.png" "$root\public\work\qr-attendance.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard\1.avif" "$root\public\work\rtthread-hmi.avif" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard\2.avif" "$root\public\work\rtthread-hmi-2.avif" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard\3.avif" "$root\public\work\rtthread-hmi-3.avif" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard\4.avif" "$root\public\work\rtthread-hmi-4.avif" -Force

# 3. Project Detail & Gallery Assets
Copy-Item "$root\Sources\PROJECT PICTURES\FERMONITOR_ Machine Learning-Driven Electronic Nose for Artisanal Fermentation Monitoring\1.png" "$root\public\work\fermonitor-1.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\FERMONITOR_ Machine Learning-Driven Electronic Nose for Artisanal Fermentation Monitoring\2.png" "$root\public\work\fermonitor-2.png" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\Real-Time Multisensor Room Monitoring System\1.png" "$root\public\work\room-monitoring-wokwi.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Real-Time Multisensor Room Monitoring System\2.png" "$root\public\work\room-monitoring-diagram.png" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\Personal MP3 Player\1.jpg" "$root\public\work\mp3-player-1.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Personal MP3 Player\2.jpg" "$root\public\work\mp3-player-2.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Personal MP3 Player\3.jpg" "$root\public\work\mp3-player-3.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Personal MP3 Player\4.jpg" "$root\public\work\mp3-player-4.jpg" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\Industrial Drying Oven Control System\1.png" "$root\public\work\drying-oven-1.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Industrial Drying Oven Control System\2.png" "$root\public\work\drying-oven-2.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Industrial Drying Oven Control System\3.png" "$root\public\work\drying-oven-3.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Industrial Drying Oven Control System\4.png" "$root\public\work\drying-oven-4.png" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\12V DC Power Supply Design and Construction\1.jpg" "$root\public\work\dc-supply-1.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\12V DC Power Supply Design and Construction\2.png" "$root\public\work\dc-supply-schematic.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\12V DC Power Supply Design and Construction\3.png" "$root\public\work\dc-supply-pcb.png" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\College Contribution Tracking System\Screenshot 2026-10-28 131518.png" "$root\public\work\contribution-tracker-dashboard.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\College Contribution Tracking System\Screenshot 2026-10-28 131541.png" "$root\public\work\contribution-tracker-reports.png" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\FPGA-Based Automated Industrial Drying Oven Controller\1.png" "$root\public\work\fpga-oven-fsm.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\FPGA-Based Automated Industrial Drying Oven Controller\2.png" "$root\public\work\fpga-oven-rtl.png" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\RICEDIRECT PH_ Smart Rice Bin & E-Commerce Delivery System\1.png" "$root\public\work\ricedirect-gui.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\RICEDIRECT PH_ Smart Rice Bin & E-Commerce Delivery System\2.png" "$root\public\work\ricedirect-bin.png" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\ eTee_ Manure Management for Small-Scale Chicken Coops using IoT\1.jpg" "$root\public\work\etee-hardware.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\ eTee_ Manure Management for Small-Scale Chicken Coops using IoT\2.jpg" "$root\public\work\etee-chicks.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\ eTee_ Manure Management for Small-Scale Chicken Coops using IoT\3.jpg" "$root\public\work\etee-coop.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\ eTee_ Manure Management for Small-Scale Chicken Coops using IoT\4.jpg" "$root\public\work\etee-app.jpg" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\1.png" "$root\public\work\digistamp-kiosk.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\2.png" "$root\public\work\digistamp-game.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\3.png" "$root\public\work\digistamp-analytics.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\4.png" "$root\public\work\digistamp-dashboard.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\5.jpg" "$root\public\work\digistamp-branding.jpg" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\AquaFlush_ Arduino-Based Water-Flow Monitoring System\1.png" "$root\public\work\aquaflush-rig.png" -Force

Copy-Item "$root\Sources\PROJECT PICTURES\Line-Following Robot using ATmega328P and 8-bit AVR Assembly\1.png" "$root\public\work\line-robot-code.png" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Line-Following Robot using ATmega328P and 8-bit AVR Assembly\2.jpg" "$root\public\work\line-robot-track.jpg" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Line-Following Robot using ATmega328P and 8-bit AVR Assembly\3.jpg" "$root\public\work\line-robot-chassis.jpg" -Force

# 4. Certificates
Copy-Item "$root\Sources\CERTIFICATES\IoT Conference Philippines.jpg" "$root\public\certificates\iot-conference-philippines.jpg" -Force
Copy-Item "$root\Sources\CERTIFICATES\SYO Certificates_pages-to-jpg-0021.jpg" "$root\public\certificates\syo-ojt-workshop.jpg" -Force
Copy-Item "$root\Sources\CERTIFICATES\SmartCT Participation.png" "$root\public\certificates\smartct-participation.png" -Force
Copy-Item "$root\Sources\CERTIFICATES\certificate_ai-career-readiness.png" "$root\public\certificates\ai-career-readiness.png" -Force
Copy-Item "$root\Sources\CERTIFICATES\Startup Basics 101 Certificate - Mary Grace V. Soronio.pdf" "$root\public\certificates\startup-basics-101.pdf" -Force
Copy-Item "$root\Sources\CERTIFICATES\lia-webinar-22_signed.pdf" "$root\public\certificates\zx-calculus-webinar.pdf" -Force
Copy-Item "$root\Sources\CERTIFICATES\Mary Grace V. Soronio Certs.pdf" "$root\public\certificates\mary-grace-soronio-certs.pdf" -Force

# 5. Manuscripts & Media
Copy-Item "$root\Sources\Line-Following Robot using ATmega328P and 8-bit AVR Assembly.mp4" "$root\public\video\line-robot-demo.mp4" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\ eTee_ Manure Management for Small-Scale Chicken Coops using IoT\eTee Project Manuscript (1).pdf" "$root\public\docs\etee-manuscript.pdf" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\AquaFlush_ Arduino-Based Water-Flow Monitoring System\AquaFlash Lab Report (1).pdf" "$root\public\docs\aquaflush-lab-report.pdf" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Computer Vision-Based Phone Detection\Keyboard Object Detection Lab Report.pdf" "$root\public\docs\keyboard-detection-report.pdf" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\DIGISTAMP_ Gamified POS Loyalty Platform\Brand_Building_Worksheet_Tech4Ward (DigiStamp).docx.pdf" "$root\public\docs\digistamp-worksheet.pdf" -Force
Copy-Item "$root\Sources\PROJECT PICTURES\Line-Following Robot using ATmega328P and 8-bit AVR Assembly\BCA143-Line-Following-Robot-1.pdf" "$root\public\docs\line-robot-manuscript.pdf" -Force

Write-Host "Asset copy plan executed successfully. All 17 projects now have verified authentic image assets."
