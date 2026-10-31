/**
 * Only images that actually exist in public/ are listed here.
 * The source catalog references many secondary captures that were copied
 * into public/work/, so galleries are curated and verified.
 */
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

export function galleryFor(project) {
  const list = galleries[project?.slug] || []
  return list.filter((src) => src !== project?.image)
}
