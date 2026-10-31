/**
 * Authentic Project Catalog - Mary Grace V. Soronio Portfolio
 * Total: 17 Authentic Projects
 * Strictly sourced from Sources/Soronio, Mary grace V..md and Sources/PROJECT PICTURES/
 * ZERO FABRICATION
 */

const gh = 'https://github.com/MaryGraceSoronio'

export const categories = [
  { id: 'all', label: 'All Builds' },
  { id: 'embedded', label: 'Embedded & RTOS' },
  { id: 'iot', label: 'Sensing & IoT' },
  { id: 'digital-logic', label: 'FPGA & PCB' },
  { id: 'software', label: 'Web & Systems' },
]

export const projects = [
  {
    slug: 'fermonitor',
    title: 'FERMONITOR',
    name: 'FERMONITOR',
    subtitle: 'Machine Learning-Driven Electronic Nose for Artisanal Fermentation Monitoring',
    line: 'An electronic nose that reads bagoong fermentation from the gas above the pail.',
    category: 'iot',
    categoryLabel: 'Sensing & IoT',
    featured: true,
    order: 1,
    period: 'Aug 2025 – Present',
    image: '/work/fermonitor.jpg',
    gallery: [
      '/work/fermonitor.jpg',
      '/work/case-fermonitor.jpg',
      '/work/case-fermonitor-verdict.jpg',
      '/work/fermonitor-1.png',
      '/work/fermonitor-2.png',
    ],
    w: 900,
    h: 562,
    summary:
      'Non-invasive electronic nose monitoring system tailored for small-scale fermented food producers, utilizing multi-channel gas sensors and on-device ML.',
    overview:
      'Undergraduate thesis leading the software architecture, hardware integration, and telemetry pipeline for traditional shrimp paste (bagoong alamang) fermentation. Features an edge-computing gas sensing array with a 16-bit signal chain to non-invasively classify batch fermentation states (Normal, At-Risk, Possible Spoilage).',
    details:
      'Electronic nose system monitoring traditional fermentation. Integrates 4 gas sensor channels (MQ-135, MQ-136, MQ-137, and NDIR CO2) sampled through a 16-bit ADS1115 ADC. Features continuous windowed inference on Raspberry Pi with local SQLite logging and Firebase synchronization.',
    problem:
      'Artisanal shrimp paste (bagoong alamang) fermentation in the Philippines relies on subjective, manual sensory checks (color, smell, taste), leading to inconsistent batch quality, risk of undetected spoilage, and lack of objective quality tracking in small-scale coastal production.',
    solution:
      'Engineered an edge-computing gas sensing array (MQ-137 for ammonia, MQ-136 for hydrogen sulfide, MQ-135 for air quality, and NDIR optical CO2) with a 16-bit ADS1115 ADC signal chain and a Raspberry Pi 4B local-first Linux service stack. Formulated a 22-feature vector from 10-minute gas response windows normalized against variable pail fill volumes to classify fermentation states in real-time. Features local SQLite caching, store-and-forward Firebase synchronization for 100% data integrity during outages, and a dual-deployment Flask/Firebase web dashboard.',
    hardwareStack: [
      'Raspberry Pi 4B',
      'MQ-137 (Ammonia Sensor)',
      'MQ-136 (Hydrogen Sulfide Sensor)',
      'MQ-135 (Air Quality Sensor)',
      'NDIR Optical CO₂ Sensor',
      'ADS1115 16-Bit I²C ADC',
      'Precision Gas Sampling Chamber',
    ],
    softwareStack: [
      'Python',
      'Flask',
      'Edge Machine Learning',
      'SQLite',
      'Firebase Realtime Database',
      'Linux Systemd Services',
    ],
    stack: 'ML, Gas Sensing, Raspberry Pi, ADS1115',
    challenges: [
      'Compensating for non-linear sensor baseline drift and cross-sensitivity in high-humidity fermentation environments.',
      'Formulating a 22-feature statistical vector robust against variable headspace volume and batch fill levels.',
      'Guaranteeing zero data loss during power intermittency and coastal network dropouts via SQLite store-and-forward syncing.',
    ],
    metrics: [
      { label: 'Signal Chain', value: '16-Bit ADS1115 ADC' },
      { label: 'Feature Vector', value: '22 Normalized Features' },
      { label: 'Window Size', value: '10-Minute Response Windows' },
      { label: 'Data Integrity', value: '100% Local-First Caching' },
    ],
    links: [],
    note: 'Undergraduate thesis, paper forthcoming',
  },
  {
    slug: 'room-monitoring',
    title: 'Real-Time Multisensor Room Monitoring System',
    name: 'Room Monitor',
    subtitle: 'Concurrent Multi-Task Environmental Telemetry on STM32 & FreeRTOS',
    line: 'Four sensor tasks on FreeRTOS, each one on its own schedule.',
    category: 'embedded',
    categoryLabel: 'Embedded & RTOS',
    featured: true,
    order: 2,
    period: '2025',
    image: '/work/room-monitoring.jpg',
    gallery: [
      '/work/room-monitoring.jpg',
      '/work/room-monitoring-wokwi.png',
      '/work/room-monitoring-diagram.png',
    ],
    w: 675,
    h: 422,
    summary:
      'FreeRTOS application executing deterministic real-time task scheduling and concurrent multi-sensor environmental telemetry on ARM Cortex-M architecture.',
    overview:
      'Engineered a FreeRTOS-based embedded C application to practice multi-tasking architectures, task scheduling, and real-time sensor integration. The system coordinates concurrent sensor data acquisition loops to continuously monitor ambient room conditions, ensuring predictable execution timing and reliable task management across multiple environmental input streams.',
    details:
      'Concurrent multi-sensor environment telemetry on ARM Cortex-M architecture. Implements preemptive multitasking with dedicated sensor acquisition tasks, inter-task message queues, and mutex-guarded serial logging.',
    problem:
      'Single-threaded microcontroller loops suffer from timing jitter, blocking I/O delays, and erratic sensor sampling when orchestrating multiple environmental sensors with disparate acquisition rates.',
    solution:
      'Architected a FreeRTOS application partitioning telemetry acquisition into dedicated, prioritized tasks with deterministic scheduling. Implemented inter-task message queues for thread-safe telemetry aggregation and mutex-guarded serial logging to guarantee predictable timing and zero resource contention.',
    hardwareStack: [
      'STM32 Microcontroller (ARM Cortex-M)',
      'DHT22 Temperature & Humidity Sensor',
      'Photoresistor / Ambient Light Sensor',
      'Wokwi Simulation Environment',
    ],
    softwareStack: [
      'FreeRTOS',
      'Embedded C',
      'Preemptive Task Scheduling',
      'Inter-Task Message Queues',
      'Mutex Resource Locks',
      'UART Serial Telemetry',
    ],
    stack: 'STM32, FreeRTOS, Wokwi, Embedded C',
    challenges: [
      'Tuning task priorities and stack depths to eliminate task starvation under constrained microcontroller RAM.',
      'Preventing priority inversion during concurrent UART telemetry writes using FreeRTOS mutexes.',
    ],
    metrics: [
      { label: 'RTOS Kernel', value: 'FreeRTOS Preemptive' },
      { label: 'Concurrency', value: 'Multi-Task Sensor Loops' },
      { label: 'Simulation', value: 'Wokwi STM32' },
    ],
    links: [
      {
        label: 'GitHub',
        href: `${gh}/bca182-freertos-multisensor`,
        url: `${gh}/bca182-freertos-multisensor`,
        type: 'github',
      },
      {
        label: 'Hackster',
        href: 'https://www.hackster.io/marygracesoronio/simulated-stm32-freertos-room-monitoring-system-in-wokwi-c2216d',
        url: 'https://www.hackster.io/marygracesoronio/simulated-stm32-freertos-room-monitoring-system-in-wokwi-c2216d',
        type: 'hackster',
      },
    ],
  },
  {
    slug: 'mp3-player',
    title: 'Personal MP3 Player',
    name: 'Personal MP3 Player',
    subtitle: 'ARM Cortex-M Embedded Audio Player with ES8388 Codec & FreeRTOS',
    line: 'An STM32F407 playing audio through an ES8388 codec, the track list on its OLED.',
    category: 'embedded',
    categoryLabel: 'Embedded & RTOS',
    featured: false,
    order: 3,
    period: '2025',
    image: '/work/mp3-player.jpg',
    gallery: [
      '/work/mp3-player.jpg',
      '/work/mp3-player-1.jpg',
      '/work/mp3-player-2.jpg',
      '/work/mp3-player-3.jpg',
      '/work/mp3-player-4.jpg',
    ],
    w: 900,
    h: 562,
    summary:
      'Standalone embedded media player integrating STM32F407 hardware, DMA I2S audio stream decoding, and an ES8388 codec with FreeRTOS multitasking.',
    overview:
      'Developed a functional, standalone embedded media player by integrating microcontroller hardware with dedicated audio playback firmware. The project involved mapping hardware peripheral interfaces, managing digital-to-analog output signals, and implementing user input controls to achieve seamless track selection and reliable audio decoding on a custom hardware setup.',
    details:
      'ARM Cortex-M4 audio player using DMA I2S streaming into an ES8388 audio codec chip. FreeRTOS coordinates SD card FATFS reading, playback buffer streaming, and SSD1306 OLED interface updates.',
    problem:
      'Streaming and decoding digital audio in real time requires continuous high-throughput DMA transfers without causing audio buffer underruns, glitching, or freezing the user interface during SD card sector reads.',
    solution:
      'Built a functional standalone embedded media player using an STM32F407 MCU streaming decoded audio via DMA over I2S to an ES8388 codec chip. FreeRTOS coordinates multi-threaded FATFS audio file streaming from SD card, real-time ping-pong audio playback buffers, and responsive OLED track and volume navigation.',
    hardwareStack: [
      'STM32F407 (ARM Cortex-M4)',
      'ES8388 Audio Codec',
      'MicroSD Card Module (SPI/SDIO)',
      'SSD1306 0.96" OLED Display',
      'Tactile Push Buttons',
      '3.5mm Headphone Jack',
    ],
    softwareStack: [
      'FreeRTOS',
      'Embedded C',
      'FATFS File System',
      'DMA I²S Audio Streaming',
      'Hardware Peripheral Drivers',
    ],
    stack: 'STM32F407, ES8388, FreeRTOS, DMA I2S',
    challenges: [
      'Implementing DMA ping-pong double-buffering over I2S to eliminate audio buffer underruns during SPI/SDIO latency spikes.',
      'Synchronizing asynchronous button debouncing interrupts with OLED display refresh rates.',
    ],
    metrics: [
      { label: 'Audio Architecture', value: 'DMA I²S Stream' },
      { label: 'Codec', value: 'ES8388 Low-Power' },
      { label: 'Storage', value: 'FATFS on MicroSD' },
    ],
    links: [
      {
        label: 'GitHub',
        href: `${gh}/bca182-laboratory2-mp3-player`,
        url: `${gh}/bca182-laboratory2-mp3-player`,
        type: 'github',
      },
    ],
  },
  {
    slug: 'activity-recognition',
    title: 'Activity Recognition System',
    name: 'Activity Recognition',
    subtitle: 'Edge-to-Cloud Human Motion Telemetry & Posture Classification',
    line: 'Motion classified into idle, walking and running, then charted live.',
    category: 'iot',
    categoryLabel: 'Sensing & IoT',
    featured: false,
    order: 4,
    period: '2025',
    image: '/work/activity-recognition.avif',
    gallery: ['/work/activity-recognition.avif'],
    w: 900,
    h: 562,
    summary:
      'Edge-to-cloud motion telemetry on the RT-Spark board classifying human movement states in real time with interactive cloud dashboard visualization.',
    overview:
      'Built an edge-to-web telemetry system designed to process motion sensor data, classify user physical activities, and present real-time movement states. By implementing feature extraction algorithms on sensor inputs, the system categorizes movement into idle, walking, and running states, dynamically visualizing telemetry data and classification outputs through an interactive web dashboard.',
    details:
      'Cloud and edge connected IMU telemetry. Accelerometer 3-axis readings processed through rolling window feature extractors to classify human locomotive postures in real-time.',
    problem:
      'Distinguishing human motion states (idle, walking, running) directly from noisy raw accelerometer data streams on resource-constrained microcontrollers without latency or excessive power draw.',
    solution:
      'Built an edge-to-web telemetry pipeline on the RT-Spark development board. Raw 3-axis accelerometer data is sampled through rolling-window statistical feature extraction (mean, variance, peak frequency) to categorize user motion states, streaming telemetry live to an interactive cloud dashboard.',
    hardwareStack: [
      'RT-Spark Board (STM32)',
      'On-board 3-Axis Accelerometer / IMU',
      'Wi-Fi Module',
    ],
    softwareStack: [
      'Embedded C',
      'RT-Thread IoT OS',
      'Edge Machine Learning',
      'Statistical Feature Extraction',
      'Web Dashboard',
      'MQTT / HTTP Cloud Telemetry',
    ],
    stack: 'RT-Spark, RT-Thread, Feature Extraction, Cloud Telemetry',
    challenges: [
      'Filtering out high-frequency sensor noise and gravitational drift while executing low-latency feature extraction within microcontroller CPU budget.',
    ],
    metrics: [
      { label: 'Hardware', value: 'RT-Spark STM32' },
      { label: 'Classification', value: 'Idle / Walk / Run' },
      { label: 'OS', value: 'RT-Thread IoT OS' },
    ],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/msyennna/rt-spark-activity-recognition',
        url: 'https://github.com/msyennna/rt-spark-activity-recognition',
        type: 'github',
      },
      {
        label: 'Hackster',
        href: 'https://www.hackster.io/phoebiencanete/rt-spark-cloud-based-human-activity-recognition-3a945f',
        url: 'https://www.hackster.io/phoebiencanete/rt-spark-cloud-based-human-activity-recognition-3a945f',
        type: 'hackster',
      },
    ],
  },
  {
    slug: 'drying-oven',
    title: 'Industrial Drying Oven Control System',
    name: 'Drying Oven',
    subtitle: 'Comparative Multi-Platform Industrial Thermal Loop: CODESYS PLC, Verilog HDL & RT-Thread RTOS',
    line: 'The same oven controller built three ways: PLC, HDL and RTOS.',
    category: 'embedded',
    categoryLabel: 'Embedded & RTOS',
    featured: true,
    order: 5,
    period: '2025',
    image: '/work/drying-oven.jpg',
    gallery: [
      '/work/drying-oven.jpg',
      '/work/drying-oven-1.png',
      '/work/drying-oven-2.png',
      '/work/drying-oven-3.png',
      '/work/drying-oven-4.png',
    ],
    w: 900,
    h: 562,
    summary:
      'Multi-platform comparative industrial process control study implementing thermal regulation, stage timing, and door interlocks across PLC, HDL, and RTOS.',
    overview:
      'Engineered real-time industrial temperature and process control logic utilizing a multi-platform control approach across CODESYS PLC programming, Verilog HDL safety interlocks, and RT-Thread RTOS. The system models multi-stage thermal operational loops, integrating real-time sensor polling, safety status displays, and automated process management for reliable industrial heating applications.',
    details:
      'Comparative control engineering study implementing thermal regulation, stage timing, and door interlocks across three paradigms: IEC 61131-3 Ladder Logic (CODESYS), RTL hardware description (Verilog), and preemptive RTOS threads (RT-Thread).',
    problem:
      'Industrial thermal drying processes require strict multi-stage heating, temperature regulation, and fail-safe door interlocks where control delays or software crashes could cause thermal runaway or combustion.',
    solution:
      'Built a comparative industrial process control study implementing thermal regulation, stage timing, and door interlocks across three distinct control paradigms: IEC 61131-3 Ladder Logic on CODESYS PLC, hardware-level RTL safety interlocks in Verilog HDL, and preemptive multitasking threads on RT-Thread RTOS.',
    hardwareStack: [
      'Industrial Thermal Probes',
      'Safety Door Interlocks',
      'Heating Coil Actuators',
      'RT-Thread Development Board',
      'PLC Experimental Rig',
    ],
    softwareStack: [
      'CODESYS IEC 61131-3 (Ladder Diagram)',
      'Verilog HDL',
      'RT-Thread RTOS (Embedded C)',
      'Multi-Stage Temperature Loops',
    ],
    stack: 'CODESYS, Verilog, RT-Thread, Multi-Platform',
    challenges: [
      'Harmonizing behavioral timing, sensor hysteresis, and emergency trip latency across ladder logic scan cycles, hardware gate propagation, and RTOS thread scheduling.',
    ],
    metrics: [
      { label: 'Control Paradigms', value: '3 (PLC, HDL, RTOS)' },
      { label: 'Safety Interlocks', value: 'Hardware-Level Trip' },
      { label: 'Simulation', value: 'CODESYS + Vivado' },
    ],
    links: [
      {
        label: 'Video Demo',
        href: 'https://drive.google.com/file/d/1lRLGec-UeTProo6J7GAswQ8ufEBXrGBk/view',
        url: 'https://drive.google.com/file/d/1lRLGec-UeTProo6J7GAswQ8ufEBXrGBk/view',
        type: 'video',
      },
      {
        label: 'Documentation',
        href: 'https://sites.google.com/g.msuiit.edu.ph/bca153finalprojectsoronio/home',
        url: 'https://sites.google.com/g.msuiit.edu.ph/bca153finalprojectsoronio/home',
        type: 'docs',
      },
    ],
  },
  {
    slug: 'keyboard-detection',
    title: 'Computer Vision-Based Keyboard Detection',
    name: 'Keyboard Detection',
    subtitle: 'Edge Impulse Real-Time Object Detection Model for Resource-Constrained Hardware',
    line: 'An Edge Impulse detector that boxes keyboards for constrained hardware.',
    category: 'iot',
    categoryLabel: 'Sensing & IoT',
    featured: false,
    order: 6,
    period: '2025',
    image: '/work/keyboard-detection.png',
    gallery: [
      '/work/keyboard-detection.png',
      '/work/keyboard-detection-model.png',
    ],
    w: 900,
    h: 562,
    summary:
      'Edge machine learning object detection model trained with Edge Impulse and INT8 quantization for real-time localization on resource-constrained devices.',
    overview:
      'Developed and trained an edge machine learning computer vision model using Edge Impulse to accurately detect and localize mobile Keyboards within image streams. The project involved dataset curation, image preprocessing, and model training to generate precise bounding boxes around detected target objects. Designed with embedded deployment constraints in mind, the system demonstrates real-time object detection capabilities suitable for integration into resource-constrained edge hardware.',
    details:
      'Edge AI computer vision model quantized with INT8 weights for microcontrollers. Trained with transfer learning on FOMO/MobileNet architectures for high FPS edge inference.',
    problem:
      'Deploying standard deep learning computer vision models (like heavy YOLO or SSD) onto edge microcontrollers is unfeasible due to strict memory (RAM/Flash) and computation limitations.',
    solution:
      'Curated a custom image dataset, applied bounding box annotations and augmentation, and trained a lightweight FOMO/MobileNet object detection architecture in Edge Impulse. Applied INT8 weight quantization to enable sub-100ms inference on resource-constrained microcontrollers with high localization precision.',
    hardwareStack: [
      'Embedded Camera Module',
      'ARM Cortex-M / Edge AI Microcontroller Platform',
    ],
    softwareStack: [
      'Edge Impulse Studio',
      'FOMO (Faster Objects, More Objects)',
      'MobileNetV2',
      'INT8 Quantization',
      'Python',
      'OpenCV',
    ],
    stack: 'Edge Impulse, Bounding Boxes, FOMO, INT8',
    challenges: [
      'Balancing spatial resolution and bounding box accuracy against tight SRAM footprints on microcontrollers.',
    ],
    metrics: [
      { label: 'Inference Engine', value: 'FOMO Edge Impulse' },
      { label: 'Quantization', value: 'INT8 Weights' },
      { label: 'Latency', value: 'Sub-100ms Inference' },
    ],
    links: [
      {
        label: 'Lab Report',
        href: 'https://drive.google.com/file/d/1JiOHUOdVBOheZ5_L9M-kyQy683yu4Iw0/view',
        url: 'https://drive.google.com/file/d/1JiOHUOdVBOheZ5_L9M-kyQy683yu4Iw0/view',
        type: 'report',
      },
    ],
  },
  {
    slug: 'dc-supply',
    title: '12V DC Regulated Power Supply Design and Construction',
    name: '12V Power Supply',
    subtitle: 'Benchtop AC-to-DC Regulated Power Supply with Custom PCB Fabrication',
    line: 'A regulated 12V bench supply, simulated first and soldered after.',
    category: 'digital-logic',
    categoryLabel: 'FPGA & PCB',
    featured: false,
    order: 7,
    period: '2024',
    image: '/work/dc-supply.jpg',
    gallery: [
      '/work/dc-supply.jpg',
      '/work/dc-supply-1.jpg',
      '/work/dc-supply-schematic.png',
      '/work/dc-supply-pcb.png',
    ],
    w: 900,
    h: 562,
    summary:
      'Regulated 12V DC benchtop power supply designed, simulated, and hand-fabricated with transformer rectification, filtering, and linear regulation on custom PCB.',
    overview:
      'Designed, simulated, and manually assembled a regulated 12V DC variable power supply unit to deliver stable voltage output for laboratory testing and electronic prototyping. The project encompassed transformer selection, AC-to-DC rectification, filtering, and linear voltage regulation to ensure low ripple and steady load performance. Hands-on hardware assembly involved circuit schematic design, PCB layout optimization, and precision soldering, resulting in a reliable benchtop power source for microcontrollers and embedded peripherals.',
    details:
      'Hardware electronics bench build: step-down AC transformer, full-bridge diode rectification, capacitor smoothing, LM7812 linear regulation, and custom etched single-sided PCB.',
    problem:
      'Microcontroller development and electronic laboratory prototyping require stable, ripple-free 12V DC power protected against AC line transients and thermal load stress.',
    solution:
      'Designed, simulated, etched, and hand-assembled a regulated 12V DC benchtop power supply. Features step-down AC transformer coupling, full-bridge diode rectification, RC capacitive filtering, and LM7812 linear voltage regulation on a custom single-sided etched PCB with thermal heat-sinking.',
    hardwareStack: [
      'Step-Down Transformer (220V AC to 15V AC)',
      '1N4007 Full-Bridge Diode Rectifier',
      'Electrolytic Smoothing Capacitors',
      'LM7812 Linear Voltage Regulator',
      'Single-Sided Copper Clad PCB',
      'Heat Sink',
      'Terminal Blocks',
    ],
    softwareStack: [
      'Multisim Circuit Simulation',
      'PCB Layout & CAD Tooling',
    ],
    stack: 'PCB Layout, Rectification, Soldering, LM7812',
    challenges: [
      'Minimizing peak-to-peak output voltage ripple under heavy load and calculating thermal heat dissipation for the linear regulator under continuous operation.',
    ],
    metrics: [
      { label: 'Output Voltage', value: '12V DC Regulated' },
      { label: 'Rectification', value: 'Full-Wave Bridge' },
      { label: 'Fabrication', value: 'Hand-Etched Single-Sided PCB' },
    ],
    links: [],
  },
  {
    slug: 'contribution-tracker',
    title: 'College Contribution Tracking System (CCS-CTS)',
    name: 'Contribution Tracker',
    subtitle: 'Institutional Financial Management & Audit Portal with Role-Based Access',
    line: 'Student fees tracked, verified and reported behind role-based access.',
    category: 'software',
    categoryLabel: 'Web & Systems',
    featured: true,
    order: 8,
    period: '2025 – 2026',
    image: '/work/contribution-tracker.jpg',
    gallery: [
      '/work/contribution-tracker.jpg',
      '/work/contribution-tracker-dashboard.png',
      '/work/contribution-tracker-reports.png',
    ],
    w: 900,
    h: 562,
    summary:
      'Web-based financial tracking portal with role-based authentication, real-time analytics dashboards, and automated PDF receipt generation for student fees.',
    overview:
      'Co-developed a web-based financial management portal designed to streamline student contribution collection, record-keeping, and receipt verification for academic departments. Featuring role-based authentication using institutional credentials, the platform provides administrators with dynamic analytics dashboards—including payment distribution charts, weekly collection graphs, and semester filters—alongside searchable transaction logs and automated PDF report generation for unsettled accounts.',
    details:
      'Institutional fiscal transparency platform used across College of Computer Studies student councils. Provides cryptographically verified audit trails, instant receipt generation, and analytical export.',
    problem:
      'College student councils manage thousands of student fees manually on paper receipts and uncoordinated spreadsheets, resulting in audit disputes, lost records, and delayed clearance verifications.',
    solution:
      'Co-developed a web-based financial tracking portal featuring role-based authentication (student council treasurers vs. administrators), real-time collection distribution analytics, searchable transaction ledgers, and automated cryptographic digital receipt generation.',
    hardwareStack: ['Cloud Web Servers', 'Client Devices'],
    softwareStack: [
      'React JS',
      'Tailwind CSS',
      'Node.js Express',
      'MongoDB / Firebase',
      'Role-Based Access Control (RBAC)',
      'Chart.js Analytics',
      'PDF Generation (jsPDF)',
    ],
    stack: 'Role-Based Access, Analytics, PDF Reports, React',
    challenges: [
      'Enforcing strict transaction ledger immutability and role-based permissions while maintaining instant receipt search across thousands of student records.',
    ],
    metrics: [
      { label: 'Access Control', value: 'Multi-Tiered RBAC' },
      { label: 'Reports', value: 'Automated PDF Generation' },
      { label: 'Deployment', value: 'Netlify Live Cloud' },
    ],
    links: [
      {
        label: 'Live App',
        href: 'https://ccs-cts.netlify.app/',
        url: 'https://ccs-cts.netlify.app/',
        type: 'live',
      },
      {
        label: 'GitHub',
        href: `${gh}/ccs-contribution-tracker-system`,
        url: `${gh}/ccs-contribution-tracker-system`,
        type: 'github',
      },
    ],
  },
  {
    slug: 'fpga-oven',
    title: 'FPGA-Based Automated Industrial Drying Oven Controller',
    name: 'FPGA Oven',
    subtitle: 'Hardware-Deterministic One-Hot FSM Industrial Controller in VHDL',
    line: 'A one-hot FSM in VHDL that cuts heater power the instant a door opens.',
    category: 'digital-logic',
    categoryLabel: 'FPGA & PCB',
    featured: false,
    order: 9,
    period: '2025',
    image: '/work/fpga-oven.jpg',
    gallery: [
      '/work/fpga-oven.jpg',
      '/work/fpga-oven-fsm.png',
      '/work/fpga-oven-rtl.png',
    ],
    w: 468,
    h: 292,
    summary:
      'Hardware-deterministic industrial drying oven controller in VHDL with One-Hot FSM, dynamic PWM thermal feedback, and combinational safety interlocks.',
    overview:
      'Architected and verified a hardware-deterministic industrial drying oven controller in VHDL, simulated using AMD Vivado to eliminate software-execution vulnerabilities in thermal processing. Built around a One-Hot encoded Finite State Machine (FSM), the digital logic manages IDLE, PREHEAT, DRYING, and COOLING states while integrating hardwired combinational safety interlocks that instantaneously cut heater power upon sensor or door fault detection. Additionally, the system incorporates custom 1Hz clock division and dynamic PWM thermal feedback logic to flatten target temperature curves, successfully preventing material scorching during moisture extraction.',
    details:
      'Digital logic design on Xilinx Artix-7/Spartan architecture synthesized using Vivado. Employs one-hot state encoding for zero-latency hazard response and strict safety lockouts.',
    problem:
      'Industrial thermal drying can suffer catastrophic failure if software operating systems hang or experience scheduling delays during emergency door-open or over-temperature events.',
    solution:
      'Architected and verified a hardware-deterministic drying oven controller in VHDL synthesized in AMD Vivado. Utilized a One-Hot encoded Finite State Machine (IDLE, PREHEAT, DRYING, COOLING) with combinational safety interlocks that physically sever heater power in sub-microsecond clock cycles upon fault detection. Integrated 1Hz clock divider and dynamic PWM thermal modulation to prevent material scorching.',
    hardwareStack: [
      'Xilinx Artix-7 / Spartan FPGA Board',
      'Digital Temperature Probes',
      'Safety Door Interlocks',
      'Actuator Switches',
    ],
    softwareStack: [
      'VHDL',
      'AMD Vivado Design Suite',
      'Behavioral RTL Simulation',
      'One-Hot FSM Synthesis',
      'Digital Clock Dividers',
    ],
    stack: 'VHDL, Vivado, One-Hot FSM, FPGA',
    challenges: [
      'Achieving timing closure, ensuring glitch-free state transitions in One-Hot encoding, and managing clock domain crossing from master clock down to 1Hz control logic.',
    ],
    metrics: [
      { label: 'FSM Encoding', value: 'One-Hot Deterministic' },
      { label: 'Synthesis Tool', value: 'AMD Vivado' },
      { label: 'Safety Trip', value: 'Instant Combinational Interlock' },
    ],
    links: [
      {
        label: 'Manuscript',
        href: 'https://drive.google.com/file/d/1AAFNrjuYTWzE6JFpFPuitMI1s5Rhwss_/view',
        url: 'https://drive.google.com/file/d/1AAFNrjuYTWzE6JFpFPuitMI1s5Rhwss_/view',
        type: 'report',
      },
    ],
  },
  {
    slug: 'ricedirect',
    title: 'RICEDIRECT PH: Smart Rice Bin & E-Commerce Delivery System',
    name: 'RiceDirect PH',
    subtitle: 'IoT Agricultural Supply Chain Platform with Qt/QML Desktop & Telemetry Bin',
    line: 'A Qt desktop app wired to a rice bin that weighs itself and reorders.',
    category: 'software',
    categoryLabel: 'Web & Systems',
    featured: true,
    order: 10,
    period: '2025',
    image: '/work/ricedirect.jpg',
    gallery: [
      '/work/ricedirect.jpg',
      '/work/ricedirect-gui.png',
      '/work/ricedirect-bin.png',
    ],
    w: 900,
    h: 562,
    summary:
      'IoT agricultural supply chain platform combining a Qt/QML C++ desktop application with a smart rice bin hardware prototype featuring load cell telemetry.',
    overview:
      'Engineered a comprehensive IoT-driven agricultural supply chain platform combining a Qt C++ desktop GUI app with a smart rice bin hardware prototype. Built using core Object-Oriented Programming (OOP) principles and QML, the desktop application features product cataloging, automated dispensing controls, inventory management, and direct farmer-to-consumer e-commerce workflows. The physical bin prototype integrates real-time telemetry sensors for temperature and moisture monitoring, internal load cell weighing for automated reorder triggers, and airtight mechanical seals to prevent grain spoilage.',
    details:
      'Smart grain inventory platform pairing load cell instrumentation with an event-driven Qt/QML cross-platform management console for automated merchant stock replenishment.',
    problem:
      'Small-scale grain retailers and consumers face severe rice spoilage from ambient humidity and lack automated inventory visibility, resulting in stockouts and high intermediary distribution markups.',
    solution:
      'Engineered an integrated IoT supply chain system pairing a smart hermetic rice bin prototype (with strain-gauge load cells and environmental sensing) with a cross-platform Qt/QML desktop application. Provides automated grain dispensing, real-time inventory mass tracking, automated farmer reordering triggers, and direct-to-consumer e-commerce order management.',
    hardwareStack: [
      'HX711 Load Cell Amplifier',
      'Internal Strain-Gauge Load Cell',
      'DHT22 Temperature & Humidity Sensor',
      'Microcontroller Telemetry Bridge',
      'Motorized Dispenser Mechanism',
    ],
    softwareStack: [
      'Qt 6 C++',
      'QML (Qt Quick)',
      'C++ Object-Oriented Architecture',
      'Figma UI/UX Prototype',
      'IoT Serial Telemetry Protocols',
    ],
    stack: 'Qt, C++, QML, IoT, Hardware Prototype',
    challenges: [
      'Calibrating analog load cell drift across fluctuating ambient temperatures and building an asynchronous QML UI binding to C++ serial telemetry threads.',
    ],
    metrics: [
      { label: 'Desktop Framework', value: 'Qt 6 C++ & QML' },
      { label: 'Instrumentation', value: 'HX711 Strain-Gauge Load Cell' },
      { label: 'Supply Chain', value: 'Direct Farmer-to-Consumer' },
    ],
    links: [
      {
        label: 'GitHub',
        href: `${gh}/RiceDirect-PH`,
        url: `${gh}/RiceDirect-PH`,
        type: 'github',
      },
      {
        label: 'Figma',
        href: 'https://www.figma.com/proto/ngF0TXo5D4bRWZE1WzQoMR/RiceDirect',
        url: 'https://www.figma.com/proto/ngF0TXo5D4bRWZE1WzQoMR/RiceDirect',
        type: 'figma',
      },
      {
        label: 'Documentation',
        href: 'https://docs.google.com/document/d/1CUmHYFOf9G3q0s4_jdMu8eoqs4cupf-HygPrptOGodI/edit',
        url: 'https://docs.google.com/document/d/1CUmHYFOf9G3q0s4_jdMu8eoqs4cupf-HygPrptOGodI/edit',
        type: 'docs',
      },
    ],
  },
  {
    slug: 'etee',
    title: 'eTee: Manure Management for Small-Scale Chicken Coops using IoT',
    name: 'eTee',
    subtitle: 'Solar-Powered Automated Waste Conveyor & Edge YOLO-V3 Health Telemetry',
    line: 'A solar coop that clears manure on a conveyor and grades droppings with YOLO.',
    category: 'iot',
    categoryLabel: 'Sensing & IoT',
    featured: true,
    order: 11,
    period: '2025',
    image: '/work/etee.jpg',
    gallery: [
      '/work/etee.jpg',
      '/work/etee-hardware.jpg',
      '/work/etee-chicks.jpg',
      '/work/etee-coop.jpg',
      '/work/etee-app.jpg',
    ],
    w: 900,
    h: 562,
    summary:
      'Solar-powered IoT poultry management coop with automated motorized conveyor cleaning, environmental gas tracking, and edge YOLO-V3 health grading.',
    overview:
      'Designed and developed a solar-powered IoT chicken coop environment tailored for small-scale backyard poultry operations to automate waste handling and minimize health risks. The system pairs an ATmega2560 data acquisition unit and ESP32 DevKit V3 with environmental sensors (DHT22, MH-Z19C, MQ-137) to continuously track ambient temperature, humidity, CO2, and toxic ammonia concentrations. Featuring a motorized inclined conveyor belt for continuous manure removal, the platform integrates an Edge-deployed YOLO-V3 computer vision model on a Raspberry Pi 5 for automated fecal health classification, streaming telemetry to a Node.js Progressive Web Application (PWA) dashboard.',
    details:
      'Automated solar-powered poultry management coop. Cleans droppings via automated conveyor belt cycles and performs computer-vision health grading using YOLO inference on ESP32/ATmega2560 control architecture.',
    problem:
      'Backyard poultry operations in the tropics suffer from toxic ammonia gas buildup and spread of avian enteric diseases due to labor-intensive, infrequent manual manure removal.',
    solution:
      'Designed a solar-powered IoT chicken coop combining an ATmega2560/ESP32 sensor node with environmental sensors (DHT22, MH-Z19C, MQ-137) and an automated motorized conveyor belt. A Raspberry Pi 5 runs an edge-deployed YOLO-V3 computer vision model to automatically grade poultry droppings for early disease detection, transmitting status alerts to a Node.js PWA.',
    hardwareStack: [
      'Raspberry Pi 5',
      'ESP32 DevKit V3',
      'ATmega2560 Data Acquisition Board',
      'MH-Z19C NDIR CO2 Sensor',
      'MQ-137 Ammonia Sensor',
      'DHT22 Sensor',
      'Motorized Inclined Conveyor Belt',
      'Solar Charge Controller & PV Panel',
    ],
    softwareStack: [
      'Embedded C/C++',
      'Python',
      'YOLO-V3 Computer Vision',
      'Node.js',
      'Progressive Web App (PWA)',
      'MQTT Telemetry',
    ],
    stack: 'ATmega2560, ESP32, YOLO, Solar IoT',
    challenges: [
      'Protecting sensitive gas sensors from severe ammonia corrosion in coop environments and optimizing YOLO vision inference speeds on edge Linux single-board computers.',
    ],
    metrics: [
      { label: 'Power Source', value: '100% Solar-Powered PV' },
      { label: 'Sensors', value: 'Ammonia, CO₂, Temp, Humidity' },
      { label: 'Edge AI', value: 'YOLO-V3 on Raspberry Pi 5' },
    ],
    links: [
      {
        label: 'Manuscript',
        href: 'https://drive.google.com/file/d/1gAU6lhphFTfvEVjtbXKsx-nOQe5N53tm/view',
        url: 'https://drive.google.com/file/d/1gAU6lhphFTfvEVjtbXKsx-nOQe5N53tm/view',
        type: 'report',
      },
    ],
  },
  {
    slug: 'campuslink',
    title: 'MSU-IIT CampusLink: Mobile Application for Student Service & Engagement',
    name: 'CampusLink',
    subtitle: 'Centralized University Governance, E-Service Requests & Emergency Broadcast Mobile App',
    line: 'One mobile app for campus announcements, e-services and emergencies.',
    category: 'software',
    categoryLabel: 'Web & Systems',
    featured: false,
    order: 12,
    period: '2025',
    image: '/work/campuslink.png',
    gallery: [
      '/work/campuslink.png',
      '/work/campuslink-features.png',
    ],
    w: 900,
    h: 562,
    summary:
      'Centralized mobile portal modernizing university communication with verified student council broadcasts, administrative e-service workflows, and emergency alerts.',
    overview:
      'Developed a centralized mobile application designed to modernize university communication and streamline campus administrative service delivery. Built to replace fragmented social media and paper-based tracking, the application integrates real-time institutional announcement feeds, digital e-service request workflows, and a one-tap emergency safety module. Supported by a MongoDB cloud backend, CampusLink provides role-based access for students, verified student council officers, and campus administrators through active analytical dashboards to monitor service response times and enhance governance transparency.',
    details:
      'Unified campus ecosystem application providing centralized security alerts, administrative request routing, and real-time student service broadcasts.',
    problem:
      'University communication and administrative student requests (scholarships, clearances, facility booking) are fragmented across unverified social media groups and manual paper forms.',
    solution:
      'Built a centralized mobile application unifying student council announcement broadcasts, administrative e-service request workflows, and a one-tap campus emergency safety module. Backed by MongoDB and role-based permissions for students, council officers, and administrators with analytical response-time tracking.',
    hardwareStack: ['Mobile Client Devices (Android / iOS)'],
    softwareStack: [
      'React Native / Mobile UI',
      'Node.js / Express Backend',
      'MongoDB Cloud Atlas',
      'Role-Based Access Control',
      'Push Notification Services',
    ],
    stack: 'Mobile, MongoDB, Role-Based Access, Express',
    challenges: [
      'Designing a robust notification queue capable of delivering urgent campus safety alerts instantaneously across diverse mobile hardware.',
    ],
    metrics: [
      { label: 'Database', value: 'MongoDB Cloud Atlas' },
      { label: 'Architecture', value: 'REST API + Mobile Client' },
      { label: 'Features', value: 'E-Services, Alerts, Safety' },
    ],
    links: [
      {
        label: 'GitHub',
        href: `${gh}/msu-iit-connect`,
        url: `${gh}/msu-iit-connect`,
        type: 'github',
      },
      {
        label: 'Demo Video',
        href: 'https://drive.google.com/file/d/196OfdoYhliQ3gbWSnEIzEZqUaGYrglAZ/view',
        url: 'https://drive.google.com/file/d/196OfdoYhliQ3gbWSnEIzEZqUaGYrglAZ/view',
        type: 'video',
      },
    ],
  },
  {
    slug: 'digistamp',
    title: 'DIGISTAMP: Gamified POS Loyalty Platform',
    name: 'DigiStamp',
    subtitle: 'Interactive Touchscreen POS Micro-Gaming & SaaS Merchant Loyalty Analytics',
    line: 'Ten-second games at the counter, replacing paper punch cards.',
    category: 'software',
    categoryLabel: 'Web & Systems',
    featured: false,
    order: 13,
    period: '2025',
    image: '/work/digistamp.jpg',
    gallery: [
      '/work/digistamp.jpg',
      '/work/digistamp-kiosk.png',
      '/work/digistamp-game.png',
      '/work/digistamp-analytics.png',
      '/work/digistamp-dashboard.png',
      '/work/digistamp-branding.jpg',
    ],
    w: 900,
    h: 562,
    summary:
      'Gamified SaaS checkout loyalty platform deploying touchscreen React micro-games to replace paper punch cards and eliminate customer stamp fraud.',
    overview:
      'Conceptualized and built a gamified SaaS loyalty platform designed to replace traditional paper punch cards at local small business checkouts. The system deploys a touchscreen React web application locked in Android kiosk mode, allowing customers to enter their phone number to play instant, 10-second RNG mini-games for real-time micro-rewards. Powered by an Express Node.js API and MongoDB database backend, the platform provides business owners with a SaaS analytics dashboard to track repeat customer visit rates and eliminate physical stamp fraud.',
    details:
      'Interactive loyalty micro-gaming web application deployed at store POS counters. Replaces traditional physical stamp cards with mobile interactive rewards.',
    problem:
      'Traditional paper stamp cards suffer from high abandonment rates, physical counterfeiting, and provide zero customer behavioral data to small business owners.',
    solution:
      'Developed an interactive counter-top loyalty kiosk platform. Customers enter their mobile number at checkout to play a 10-second RNG mini-game yielding instant micro-rewards. An Express/MongoDB SaaS dashboard provides merchants with retention cohort analytics, visit frequencies, and fraud-proof digital stamp logs.',
    hardwareStack: ['Touchscreen Tablet / Android Kiosk Rig'],
    softwareStack: [
      'React JS',
      'Tailwind CSS',
      'Node.js Express REST API',
      'MongoDB',
      'RNG Gamification Engine',
      'Merchant Analytics',
    ],
    stack: 'React, Express, MongoDB, Gamification',
    challenges: [
      'Designing a rapid, friction-free 10-second interaction cycle that prevents checkout queue bottlenecks while securing RNG token distribution.',
    ],
    metrics: [
      { label: 'Interaction Time', value: '10-Second Micro-Game' },
      { label: 'Backend', value: 'Express + MongoDB' },
      { label: 'Frontend', value: 'React Kiosk Mode' },
    ],
    links: [
      {
        label: 'Documentation',
        href: 'https://drive.google.com/file/d/1FuiIh8ddRy2bsu44cnzBfgvQAye-atNU/view',
        url: 'https://drive.google.com/file/d/1FuiIh8ddRy2bsu44cnzBfgvQAye-atNU/view',
        type: 'docs',
      },
    ],
  },
  {
    slug: 'aquaflush',
    title: 'AquaFlush: Arduino-Based Water-Flow Monitoring System',
    name: 'AquaFlush',
    subtitle: 'Urban Drainage Discharge Telemetry with Hardware Interrupts & I²C Display',
    line: 'A drainage model that counts litres an hour from a pulse sensor and an ISR.',
    category: 'iot',
    categoryLabel: 'Sensing & IoT',
    featured: false,
    order: 14,
    period: '2025',
    image: '/work/aquaflush.jpg',
    gallery: [
      '/work/aquaflush.jpg',
      '/work/aquaflush-rig.png',
    ],
    w: 900,
    h: 562,
    summary:
      'Arduino-based urban drainage monitoring prototype calculating real-time fluid discharge in liters per hour via hardware interrupts and I2C LCD telemetry.',
    overview:
      'Designed and constructed an Arduino-based urban drainage monitoring laboratory prototype to address local community flooding concerns. The embedded C++ firmware attaches hardware interrupts to a pulse-output water-flow sensor to calculate real-time fluid velocity in liters per hour. Integrated within a miniature roadway and drainage model, the system outputs continuous flow telemetry to a 16×2 I²C LCD display and serial monitor, serving as an educational proof-of-concept for automated blockage monitoring.',
    details:
      'Sub-millisecond pulse timing on external interrupt pin to monitor urban drainage discharge. Yields reliable volumetric flow calculation in L/hr with LCD readout and I2C telemetry.',
    problem:
      'Local urban communities suffer from flash flooding caused by clogged storm drains that go unnoticed until water spills onto roadways.',
    solution:
      'Built an urban drainage laboratory scale model equipped with an in-line Hall-effect turbine flow sensor. The embedded C++ firmware leverages hardware pin interrupts (ISR) for sub-millisecond pulse timing, computing fluid velocity in Liters/Hour and streaming real-time status to an I2C LCD and serial monitor.',
    hardwareStack: [
      'Arduino Uno (ATmega328P)',
      'YF-S201 Hall-Effect Water Flow Sensor',
      '16x2 I2C Character LCD',
      'Drainage Channel Prototype',
      '5V Power Subsystem',
    ],
    softwareStack: [
      'Embedded C++',
      'Hardware Interrupt Service Routines (ISR)',
      'I2C Communication Protocol',
      'Serial Stream Telemetry',
    ],
    stack: 'Arduino, Interrupts, I²C, Telemetry',
    challenges: [
      'Eliminating contact bounce and pulse jitter at high fluid turbulence through interrupt debounce and calibrated conversion algorithms.',
    ],
    metrics: [
      { label: 'Sensor Interface', value: 'Hardware ISR Pin' },
      { label: 'Display Bus', value: 'I²C 2-Wire Protocol' },
      { label: 'Calculation', value: 'Liters per Hour' },
    ],
    links: [
      {
        label: 'GitHub',
        href: `${gh}/AquaFlush-Water-Flow-Monitoring`,
        url: `${gh}/AquaFlush-Water-Flow-Monitoring`,
        type: 'github',
      },
      {
        label: 'Lab Report',
        href: 'https://drive.google.com/file/d/1bngzv2xRivRsVjLHPKc_ThAJG51AdQmG/view',
        url: 'https://drive.google.com/file/d/1bngzv2xRivRsVjLHPKc_ThAJG51AdQmG/view',
        type: 'report',
      },
    ],
  },
  {
    slug: 'rtthread-hmi',
    title: 'RT-Thread HMI Industrial Drying Oven Simulated Control Dashboard',
    name: 'RT-Thread HMI',
    subtitle: 'Interactive Industrial Touch GUI with LVGL & SquareLine Studio on Renesas RA6M3',
    line: 'An LVGL control panel with presets, a rotary dial and safety interlocks.',
    category: 'embedded',
    categoryLabel: 'Embedded & RTOS',
    featured: false,
    order: 15,
    period: '2025',
    image: '/work/rtthread-hmi.avif',
    gallery: [
      '/work/rtthread-hmi.avif',
      '/work/rtthread-hmi-2.avif',
      '/work/rtthread-hmi-3.avif',
      '/work/rtthread-hmi-4.avif',
    ],
    w: 900,
    h: 562,
    summary:
      'High-performance touch Human-Machine Interface (HMI) built with LVGL and SquareLine Studio on RT-Thread RTOS and Renesas RA6M3.',
    overview:
      'Engineered an interactive Human-Machine Interface (HMI) control dashboard for industrial drying oven simulation built on the RT-Thread RTOS and Renesas RA6M3 platform. Developed using SquareLine Studio and LVGL graphics libraries, the HMI interface enables users to toggle between preset automatic drying modes and manual potentiometer-style rotary controls. The system features real-time safety indicator logic, interactive numeric keypads, and dynamic multi-level warning notifications mapped to simulated cavity temperatures.',
    details:
      'Renesas RA6M3 GUI design running RT-Thread and LVGL graphics library. Includes animated dial inputs, profile selection, temperature graphing, and hardware fault emergency shutdown.',
    problem:
      'Modern industrial machine operators require responsive, intuitive graphical touch interfaces that reflect complex multi-stage thermal profiles without lagging or dropping real-time safety alarms.',
    solution:
      'Designed a high-performance Human-Machine Interface (HMI) running on RT-Thread RTOS and Renesas RA6M3. Developed custom UI screens with SquareLine Studio and LVGL, implementing preset temperature curves, interactive rotary dials, numeric keypads, real-time temperature graphing, and visual emergency safety interlocks.',
    hardwareStack: [
      'Renesas RA6M3 Development Board (ARM Cortex-M4)',
      'Touchscreen TFT LCD Panel',
      'Rotary Encoder / Potentiometer',
      'Thermal Sensors',
    ],
    softwareStack: [
      'RT-Thread RTOS',
      'LVGL Graphics Library',
      'SquareLine Studio',
      'Embedded C',
      'Hardware Safety Interlocks',
    ],
    stack: 'LVGL, SquareLine, RA6M3, RT-Thread',
    challenges: [
      'Optimizing LVGL double-buffered rendering performance and frame rate over SPI/RGB display bus on the Renesas RA6M3 microcontroller.',
    ],
    metrics: [
      { label: 'Microcontroller', value: 'Renesas RA6M3 (Cortex-M4)' },
      { label: 'Graphics Engine', value: 'LVGL + SquareLine Studio' },
      { label: 'Operating System', value: 'RT-Thread RTOS' },
    ],
    links: [
      {
        label: 'GitHub',
        href: `${gh}/SIDOSCD_VoxTek`,
        url: `${gh}/SIDOSCD_VoxTek`,
        type: 'github',
      },
      {
        label: 'Hackster',
        href: 'https://www.hackster.io/voxtek/rt-thread-hmi-drying-oven-simulated-control-dashboard-86429e',
        url: 'https://www.hackster.io/voxtek/rt-thread-hmi-drying-oven-simulated-control-dashboard-86429e',
        type: 'hackster',
      },
    ],
  },
  {
    slug: 'qr-attendance',
    title: 'QR-Attendance-System-With-Laravel-API',
    name: 'QR Attendance System',
    subtitle: 'Anti-Proxy Dynamic Rotating QR Code Student Attendance with Laravel REST API',
    line: 'Single-use QR codes that refresh, so nobody signs in for a friend.',
    category: 'software',
    categoryLabel: 'Web & Systems',
    featured: false,
    order: 16,
    period: '2025',
    image: '/work/qr-attendance.png',
    gallery: ['/work/qr-attendance.png'],
    w: 900,
    h: 562,
    summary:
      'Real-time mobile attendance management application with Figma mobile UI and Laravel REST API using dynamic rotating single-use QR codes to prevent proxy check-ins.',
    overview:
      'Designed and implemented a real-time mobile attendance management application developed to prevent proxy attendance and eliminate manual record-keeping inefficiencies in academic institutions. Built with a Figma-designed user interface and backed by a Laravel RESTful API, the system features a dynamic QR code generator that continuously refreshes single-use QR codes on student screens prior to class schedules. Instructors scan the dynamic codes directly to record real-time attendance, supported by session validation, secure data encryption, and manual administrative overrides for seamless fallback handling.',
    details:
      'Dynamic attendance engine generating rotating cryptographic tokens on a timed cadence to eliminate proxy check-ins for university lecture sessions.',
    problem:
      'University lecture halls suffer widespread proxy attendance and fraudulent check-ins when using static QR codes or physical sign-in sheets.',
    solution:
      'Engineered a secure mobile attendance verification system backed by a Laravel RESTful API. Students display dynamic, time-synced single-use QR codes that refresh every few seconds. Instructors scan codes directly for instant cryptographically signed check-in verification, with administrative audit overrides.',
    hardwareStack: [
      'Mobile Client Devices (Camera QR Scanner)',
      'Cloud Application Server',
    ],
    softwareStack: [
      'Laravel PHP Framework',
      'RESTful API Architecture',
      'MySQL / PostgreSQL Database',
      'Dynamic QR Token Generator (HMAC/Timestamp)',
      'Figma Mobile UI Design',
    ],
    stack: 'Laravel API, QR, Figma, REST API',
    challenges: [
      'Preventing replay and screenshot sharing of QR tokens across chat groups via short-lived cryptographic hash validation.',
    ],
    metrics: [
      { label: 'API Backend', value: 'Laravel RESTful' },
      { label: 'Security', value: 'Rotating Dynamic QR Tokens' },
      { label: 'UI Design', value: 'Figma Mobile Spec' },
    ],
    links: [
      {
        label: 'GitHub',
        href: `${gh}/QR-Attendance-System-With-Laraverl-API`,
        url: `${gh}/QR-Attendance-System-With-Laraverl-API`,
        type: 'github',
      },
      {
        label: 'Documentation',
        href: 'https://docs.google.com/document/d/1RB9-VtUPkifmtcyjLgoESTi7X_Sp6RUvIzUvi9zW8_c/edit',
        url: 'https://docs.google.com/document/d/1RB9-VtUPkifmtcyjLgoESTi7X_Sp6RUvIzUvi9zW8_c/edit',
        type: 'docs',
      },
    ],
  },
  {
    slug: 'line-robot',
    title: 'Line-Following Robot using ATmega328P and 8-bit AVR Assembly',
    name: 'Line-Following Robot',
    subtitle: 'Bare-Metal 8-bit AVR Assembly Autonomous Track Navigator with 1ms Timer Interrupts',
    line: 'Track following in 8-bit assembly, on a 1ms timer interrupt.',
    category: 'embedded',
    categoryLabel: 'Embedded & RTOS',
    featured: false,
    order: 17,
    period: '2024',
    image: '/work/line-robot.jpg',
    gallery: [
      '/work/line-robot.jpg',
      '/work/line-robot-code.png',
      '/work/line-robot-track.jpg',
      '/work/line-robot-chassis.jpg',
    ],
    w: 900,
    h: 562,
    summary:
      'Autonomous line-following robot programmed entirely in bare-metal 8-bit AVR Assembly with deterministic 1ms Timer0 interrupts and direct port register I/O.',
    overview:
      'Designed, built, and programmed an autonomous line-following robot powered by an ATmega328P microcontroller, an L298N H-Bridge motor driver, twin IR proximity sensors, and an 11.1V LiPo battery. Low-level control logic was written entirely in 8-bit AVR Assembly language using PlatformIO to maximize execution speed, manage precise 1ms Timer0 background interrupts, and handle differential motor PWM speed adjustments for track navigation. The firmware features custom state machine algorithms and timing routines to handle complex track conditions, including executing controlled 2-second stop sequences upon detecting dual-sensor black line intersections.',
    details:
      'Bare-metal 8-bit AVR assembly program without C runtime overhead. Sensor array reads directly through PORT registers, motor speed driven by Timer0 PWM, state loop resolved in deterministic sub-millisecond clock cycles.',
    problem:
      'Line-following robots written in high-level interpreted or abstracted C environments often introduce variable execution delays and jitter, compromising high-speed trajectory corrections.',
    solution:
      'Programmed an autonomous line-following robot entirely in raw 8-bit AVR Assembly language. Eliminates C runtime overhead, mapping sensor inputs directly through MCU PORT registers and executing sub-millisecond differential motor PWM adjustments triggered by deterministic 1ms Timer0 background interrupts.',
    hardwareStack: [
      'ATmega328P Microcontroller (DIP-28)',
      'L298N Dual H-Bridge Motor Driver',
      'Dual TCRT5000 Infrared Sensors',
      'DC Gear Motors & Robot Chassis',
      '11.1V 3S LiPo Battery Pack',
    ],
    softwareStack: [
      '8-bit AVR Assembly Language',
      'PlatformIO / AVR-GCC toolchain',
      'Timer0 1ms CTC Interrupts',
      'Hardware PWM Generation',
      'Direct Register I/O Manipulation',
    ],
    stack: 'AVR Assembly, ATmega328P, PWM, L298N',
    challenges: [
      'Cycle-accurate assembly instruction timing, calibrating differential steering inertia, and debouncing IR reflectance transitions on shiny track tape.',
    ],
    metrics: [
      { label: 'Language', value: '100% 8-bit AVR Assembly' },
      { label: 'Interrupt Timing', value: '1ms Timer0 CTC Loop' },
      { label: 'Microcontroller', value: 'ATmega328P Bare-Metal' },
    ],
    links: [
      {
        label: 'Manuscript',
        href: 'https://drive.google.com/file/d/14X2Ktqn8DIcKXhxMQshC-NuzvDAuEdqG/view',
        url: 'https://drive.google.com/file/d/14X2Ktqn8DIcKXhxMQshC-NuzvDAuEdqG/view',
        type: 'report',
      },
      {
        label: 'Demo Video',
        href: 'https://drive.google.com/file/d/100Nz2wVprRYmCajcbTtk3l6EphIvcEKq/view',
        url: 'https://drive.google.com/file/d/100Nz2wVprRYmCajcbTtk3l6EphIvcEKq/view',
        type: 'video',
      },
    ],
  },
]

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured)
}

export function getProjectsByCategory(category) {
  if (!category || category === 'all') return projects
  return projects.filter((p) => p.category === category)
}
