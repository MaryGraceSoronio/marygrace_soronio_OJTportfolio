const fs = require('fs');
const path = 'src/data/projects.js';
let content = fs.readFileSync(path, 'utf8');

const enrichments = {
  fermonitor: {
    aliasSlugs: ['fermonitor-iot-incubator', 'fermonitor-bagoong-enose'],
    tags: ['ML', 'Gas Sensing', 'Raspberry Pi', 'ADS1115', 'Edge AI', 'Thesis', 'Sensors']
  },
  'rtthread-hmi': {
    aliasSlugs: ['rt-thread-smart-agriculture-hmi', 'rt-thread-drying-oven-hmi'],
    tags: ['RT-Thread', 'LVGL', 'SquareLine Studio', 'RA6M3', 'HMI']
  },
  aquaflush: {
    aliasSlugs: ['aquaflush-automatic-cistern', 'aquaflush-water-monitor'],
    tags: ['Arduino', 'Flow Sensor', 'Embedded C++', 'ISRs', 'I2C LCD']
  },
  'room-monitoring': {
    aliasSlugs: ['stm32-smart-ambient-monitor', 'stm32-freertos-room-monitor'],
    tags: ['STM32', 'FreeRTOS', 'Wokwi', 'DHT22', 'Mutex', 'Queues']
  },
  'fpga-oven': {
    aliasSlugs: ['fpga-digital-clock-vhdl', 'fpga-drying-oven-controller'],
    tags: ['VHDL', 'AMD Vivado', 'One-Hot FSM', 'PWM', 'Digital Logic']
  },
  etee: {
    aliasSlugs: ['smart-waste-sorting-bin', 'etee-chicken-coop-iot'],
    tags: ['ATmega2560', 'ESP32', 'YOLO-V3', 'Raspberry Pi 5', 'Solar IoT']
  },
  'mp3-player': {
    aliasSlugs: ['embedded-mp3-player', 'personal-mp3-player'],
    tags: ['Embedded C', 'DAC', 'Microcontroller', 'Audio Decoder', 'PlatformIO']
  },
  ricedirect: {
    aliasSlugs: ['smart-pill-dispenser', 'ricedirect-smart-bin'],
    tags: ['Qt C++', 'QML', 'OOP', 'Load Cells', 'IoT Agriculture']
  },
  'activity-recognition': {
    aliasSlugs: ['air-quality-telemetry-node', 'rt-spark-activity-recognition'],
    tags: ['RT-Spark', 'RT-Thread', 'Sensor Telemetry', 'Machine Learning', 'IMU']
  },
  'qr-attendance': {
    aliasSlugs: ['bluetooth-rfid-attendance-terminal', 'dynamic-qr-attendance'],
    tags: ['Laravel', 'PHP', 'REST API', 'Dynamic QR', 'Session Auth']
  },
  'keyboard-detection': {
    aliasSlugs: ['multichannel-logic-analyzer', 'edge-impulse-keyboard-fomo'],
    tags: ['Edge Impulse', 'FOMO', 'TinyML', 'Object Detection', 'Embedded Vision']
  },
  'dc-supply': {
    aliasSlugs: ['lora-soil-moisture-array', 'regulated-12v-dc-supply'],
    tags: ['PCB Layout', 'Transformer', 'LM7812', 'Linear Regulator', 'Prototyping']
  },
  'contribution-tracker': {
    aliasSlugs: ['automotive-can-bus-sniffer', 'ccs-contribution-tracker'],
    tags: ['React', 'Node.js', 'Analytics', 'Student Council', 'Financial Systems']
  },
  campuslink: {
    aliasSlugs: ['mini-oscilloscope-stm32', 'msu-iit-campuslink'],
    tags: ['React Native', 'MongoDB', 'Smart Governance', 'Emergency Safety']
  },
  'drying-oven': {
    aliasSlugs: ['pid-temperature-controller', 'industrial-drying-oven-control'],
    tags: ['CODESYS', 'PLC', 'Verilog HDL', 'RT-Thread', 'Thermal Control']
  },
  'line-robot': {
    aliasSlugs: ['gesture-controlled-rover', 'avr-assembly-line-robot'],
    tags: ['ATmega328P', '8-bit AVR Assembly', 'Timer0 ISR', 'L298N', 'Robotics']
  },
  digistamp: {
    aliasSlugs: ['esp32-freertos-weather-station', 'digistamp-gamified-pos'],
    tags: ['React', 'Android Kiosk', 'Express', 'MongoDB', 'SaaS Loyalty']
  }
};

let enriched = 0;
for (const [slug, data] of Object.entries(enrichments)) {
  const needle = "slug: '" + slug + "',";
  if (content.includes(needle)) {
    const replacement = "slug: '" + slug + "',\n    aliasSlugs: " + JSON.stringify(data.aliasSlugs) + ",\n    tags: " + JSON.stringify(data.tags) + ",";
    content = content.replace(needle, replacement);
    enriched++;
  }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully enriched ' + enriched + ' projects in src/data/projects.js');
