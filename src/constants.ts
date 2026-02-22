
import { SuspensionDB, BikeDB } from './types';

export const suspensionDatabase: SuspensionDB = {
  forks: {
    'Fox 34 Factory GRIP2': {
      model: 'Fox 34',
      series: 'Factory',
      damper: 'GRIP2',
      airSpring: 'FLOAT EVOL',
      travel: ['120', '130', '140'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (Blue air cap).', tool: 'Fox shock pump', range: '50-120 PSI' },
        'Low-Speed Rebound': { location: 'Red inner knob, bottom right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Red outer ring, bottom right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue inner knob, top right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Blue outer ring, top right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' }
      }
    },
    'Fox 34 Factory FIT4': {
      model: 'Fox 34',
      series: 'Factory',
      damper: 'FIT4',
      airSpring: 'FLOAT EVOL',
      travel: ['120', '130', '140'],
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (Blue air cap).', tool: 'Fox shock pump', range: '50-120 PSI' },
        'Low-Speed Rebound': { location: 'Red knob, bottom right leg.', setting: 'clicks from closed', range: '14 clicks', baseline: 7, type: 'knob' },
        'Open Mode Adjust': { location: 'Black inner dial, top right leg.', setting: 'clicks', range: '22 clicks', baseline: 11, type: 'knob' },
        'Compression Mode': { location: 'Blue lever, top right leg.', setting: 'Position', range: '3 positions', positions: ['Open', 'Medium', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'Fox 36 Factory GRIP X2': {
      model: 'Fox 36',
      series: 'Factory',
      damper: 'GRIP X2',
      airSpring: 'FLOAT NA2',
      travel: ['140', '150', '160', '170', '180'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (Blue air cap).', tool: 'Fox shock pump', range: '50-140 PSI' },
        'Low-Speed Rebound': { location: 'Red inner knob, bottom right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Red outer ring, bottom right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue inner knob, top right leg.', setting: 'clicks from closed', range: '22 clicks', baseline: 11, type: 'knob' },
        'High-Speed Compression': { location: 'Blue outer ring, top right leg.', setting: 'clicks from closed', range: '12 clicks', baseline: 2, type: 'knob' }
      }
    },
    'Fox 36 Factory GRIP2': {
      model: 'Fox 36',
      series: 'Factory',
      damper: 'GRIP2',
      airSpring: 'FLOAT EVOL',
      travel: ['140', '150', '160', '170', '180'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (Blue air cap).', tool: 'Fox shock pump', range: '50-140 PSI' },
        'Low-Speed Rebound': { location: 'Red inner knob, bottom right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Red outer ring, bottom right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue inner knob, top right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Blue outer ring, top right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' }
      }
    },
    'Fox 36 Factory FIT4': {
      model: 'Fox 36',
      series: 'Factory',
      damper: 'FIT4',
      airSpring: 'FLOAT EVOL',
      travel: ['140', '150', '160'],
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (Blue air cap).', tool: 'Fox shock pump', range: '50-140 PSI' },
        'Low-Speed Rebound': { location: 'Red knob, bottom right leg.', setting: 'clicks from closed', range: '14 clicks', baseline: 7, type: 'knob' },
        'Open Mode Adjust': { location: 'Black inner dial, top right leg.', setting: 'clicks', range: '22 clicks', baseline: 11, type: 'knob' },
        'Compression Mode': { location: 'Blue lever, top right leg.', setting: 'Position', range: '3 positions', positions: ['Open', 'Medium', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'Fox 36 Performance Elite GRIP2': {
      model: 'Fox 36',
      series: 'Performance Elite',
      damper: 'GRIP2',
      airSpring: 'FLOAT EVOL',
      travel: ['140', '150', '160', '170'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (Blue air cap).', tool: 'Fox shock pump', range: '50-140 PSI' },
        'Low-Speed Rebound': { location: 'Red inner knob, bottom right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Red outer ring, bottom right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue inner knob, top right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Blue outer ring, top right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' }
      }
    },
    'Fox 36 Performance GRIP': {
      model: 'Fox 36',
      series: 'Performance',
      damper: 'GRIP',
      airSpring: 'FLOAT EVOL',
      travel: ['140', '150', '160'],
      capabilities: { lsc: false, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (Blue air cap).', tool: 'Fox shock pump', range: '50-140 PSI' },
        'Low-Speed Rebound': { location: 'Red knob, bottom right leg.', setting: 'clicks from closed', range: '10 clicks', baseline: 5, type: 'knob' },
        'Compression Mode': { location: 'Blue lever, top right leg.', setting: 'Position', range: '3 positions', positions: ['Open', 'Medium', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'Fox 38 Factory GRIP X2': {
      model: 'Fox 38',
      series: 'Factory',
      damper: 'GRIP X2',
      airSpring: 'FLOAT NA2',
      travel: ['160', '170', '180'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (Blue air cap).', tool: 'Fox shock pump', range: '60-150 PSI' },
        'Low-Speed Rebound': { location: 'Red inner knob, bottom right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Red outer ring, bottom right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue inner knob, top right leg.', setting: 'clicks from closed', range: '22 clicks', baseline: 11, type: 'knob' },
        'High-Speed Compression': { location: 'Blue outer ring, top right leg.', setting: 'clicks from closed', range: '12 clicks', baseline: 2, type: 'knob' }
      }
    },
    'Fox 38 Factory GRIP2': {
      model: 'Fox 38',
      series: 'Factory',
      damper: 'GRIP2',
      airSpring: 'FLOAT NA2',
      travel: ['160', '170', '180'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (Blue air cap).', tool: 'Fox shock pump', range: '60-150 PSI' },
        'Low-Speed Rebound': { location: 'Red inner knob, bottom right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Red outer ring, bottom right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue inner knob, top right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Blue outer ring, top right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' }
      }
    },
    'Fox 38 Performance Elite GRIP2': {
      model: 'Fox 38',
      series: 'Performance Elite',
      damper: 'GRIP2',
      airSpring: 'FLOAT EVOL',
      travel: ['160', '170', '180'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (Blue air cap).', tool: 'Fox shock pump', range: '60-150 PSI' },
        'Low-Speed Rebound': { location: 'Red inner knob, bottom right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Red outer ring, bottom right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue inner knob, top right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Blue outer ring, top right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' }
      }
    },
    'Fox 40 Factory GRIP X2': {
      model: 'Fox 40',
      series: 'Factory',
      damper: 'GRIP X2',
      spring: 'Coil (requires correct spring rate)',
      travel: ['180', '190', '203'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Spring Preload': { location: 'Blue dial, top left leg.', tool: 'Hand', range: 'Variable', type: 'knob' },
        'Low-Speed Rebound': { location: 'Red inner knob, bottom right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Red outer ring, bottom right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue inner knob, top right leg.', setting: 'clicks from closed', range: '22 clicks', baseline: 11, type: 'knob' },
        'High-Speed Compression': { location: 'Blue outer ring, top right leg.', setting: 'clicks from closed', range: '12 clicks', baseline: 2, type: 'knob' }
      }
    },
    'Fox 40 Factory GRIP2': {
      model: 'Fox 40',
      series: 'Factory',
      damper: 'GRIP2',
      spring: 'Coil (requires correct spring rate)',
      travel: ['203'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Spring Preload': { location: 'Blue dial, top left leg.', tool: 'Hand', range: 'Variable', type: 'knob' },
        'Low-Speed Rebound': { location: 'Red inner knob, bottom right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Red outer ring, bottom right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue inner knob, top right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Blue outer ring, top right leg.', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' }
      }
    },
    'RockShox Pike Ultimate RC2': {
      model: 'RockShox Pike',
      series: 'Ultimate',
      damper: 'Charger 3 RC2',
      airSpring: 'DebonAir+',
      travel: ['130', '140', '150', '160'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg (remove cap).', tool: 'RockShox pump', range: '50-140 PSI' },
        'Low-Speed Rebound': { location: 'Red knob, bottom right leg.', setting: 'clicks from closed', range: '18 clicks', baseline: 9, type: 'knob' },
        'Low-Speed Compression': { location: 'Small silver dial on top right leg.', setting: 'clicks from closed', range: '18 clicks', baseline: 9, type: 'knob' },
        'High-Speed Compression': { location: 'Large dial on top right leg.', setting: 'clicks from closed', range: '5 clicks', baseline: 2, type: 'knob' }
      }
    },
    'RockShox Pike Ultimate RC': {
      model: 'RockShox Pike',
      series: 'Ultimate',
      damper: 'Charger 3 RC',
      airSpring: 'DebonAir+',
      travel: ['130', '140', '150', '160'],
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg.', tool: 'RockShox pump', range: '50-140 PSI' },
        'Low-Speed Rebound': { location: 'Red knob, bottom right leg.', setting: 'clicks from closed', range: '18 clicks', baseline: 9, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue lever, top right leg.', setting: 'Position', range: '3 positions', positions: ['Open', 'Pedal', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'RockShox Pike Select+ RC': {
      model: 'RockShox Pike',
      series: 'Select+',
      damper: 'Charger 2.1 RC',
      airSpring: 'DebonAir',
      travel: ['130', '140', '150', '160'],
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg.', tool: 'RockShox pump', range: '50-140 PSI' },
        'Low-Speed Rebound': { location: 'Red knob, bottom right leg.', setting: 'clicks from closed', range: '15 clicks', baseline: 8, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue lever, top right leg.', setting: 'Position', range: '3 positions', positions: ['Open', 'Pedal', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'RockShox Lyrik Ultimate RC2': {
      model: 'RockShox Lyrik',
      series: 'Ultimate',
      damper: 'Charger 3 RC2',
      airSpring: 'DebonAir+',
      travel: ['160', '170', '180'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg.', tool: 'RockShox pump', range: '60-150 PSI' },
        'Low-Speed Rebound': { location: 'Red knob, bottom right leg.', setting: 'clicks from closed', range: '18 clicks', baseline: 9, type: 'knob' },
        'Low-Speed Compression': { location: 'Small silver dial on top right leg.', setting: 'clicks from closed', range: '18 clicks', baseline: 9, type: 'knob' },
        'High-Speed Compression': { location: 'Large dial on top right leg.', setting: 'clicks from closed', range: '5 clicks', baseline: 2, type: 'knob' }
      }
    },
    'RockShox Lyrik Ultimate RC': {
      model: 'RockShox Lyrik',
      series: 'Ultimate',
      damper: 'Charger 3 RC',
      airSpring: 'DebonAir+',
      travel: ['160', '170', '180'],
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg.', tool: 'RockShox pump', range: '60-150 PSI' },
        'Low-Speed Rebound': { location: 'Red knob, bottom right leg.', setting: 'clicks from closed', range: '18 clicks', baseline: 9, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue lever, top right leg.', setting: 'Position', range: '3 positions', positions: ['Open', 'Pedal', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'RockShox Lyrik Select+ RC': {
      model: 'RockShox Lyrik',
      series: 'Select+',
      damper: 'Charger 2.1 RC',
      airSpring: 'DebonAir',
      travel: ['160', '170', '180'],
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg.', tool: 'RockShox pump', range: '60-150 PSI' },
        'Low-Speed Rebound': { location: 'Red knob, bottom right leg.', setting: 'clicks from closed', range: '15 clicks', baseline: 8, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue lever, top right leg.', setting: 'Position', range: '3 positions', positions: ['Open', 'Pedal', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'RockShox ZEB Ultimate RC2': {
      model: 'RockShox ZEB',
      series: 'Ultimate',
      damper: 'Charger 3 RC2',
      airSpring: 'DebonAir+',
      travel: ['170', '180', '190'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, left leg.', tool: 'RockShox pump', range: '60-150 PSI' },
        'Low-Speed Rebound': { location: 'Red knob, bottom right leg.', setting: 'clicks from closed', range: '18 clicks', baseline: 9, type: 'knob' },
        'Low-Speed Compression': { location: 'Small silver dial on top right leg.', setting: 'clicks from closed', range: '18 clicks', baseline: 9, type: 'knob' },
        'High-Speed Compression': { location: 'Large dial on top right leg.', setting: 'clicks from closed', range: '5 clicks', baseline: 2, type: 'knob' }
      }
    },
    'Öhlins RXF36 M.2': {
      model: 'Öhlins RXF36',
      series: 'Standard',
      damper: 'TTX18',
      airSpring: 'Twin-tube air',
      travel: ['160', '170', '180'],
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Top cap, right leg (Main chamber).', tool: 'Shock pump', range: '60-150 PSI' },
        'Ramp Up Chamber': { location: 'Valve under bottom of right leg.', tool: 'Shock pump', range: '150-250 PSI' },
        'Low-Speed Rebound': { location: 'Gold knob, bottom right leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue knob, top left leg.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Black lever, top left leg.', setting: 'clicks from closed', range: '3 clicks', baseline: 1, type: 'knob' }
      }
    }
  },
  shocks: {
    'Fox Float X Factory 2-Pos': {
      model: 'Fox Float X',
      series: 'Factory',
      damper: '2-Position',
      spring: 'FLOAT with volume spacers',
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Schrader valve on main body eyelet.', tool: 'Fox shock pump', range: '100-350 PSI' },
        'Low-Speed Rebound': { location: 'Red knob near bottom eyelet.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue dial on reservoir.', setting: 'clicks from closed', range: '10 clicks', baseline: 5, type: 'knob' },
        'Compression Mode': { location: 'Blue lever on reservoir.', setting: 'Position', range: '2 positions', positions: ['Open', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'Fox Float X Performance Elite 2-Pos': {
      model: 'Fox Float X',
      series: 'Performance Elite',
      damper: '2-Position',
      spring: 'FLOAT EVOL',
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Schrader valve on main body eyelet.', tool: 'Fox shock pump', range: '100-350 PSI' },
        'Low-Speed Rebound': { location: 'Red knob near bottom eyelet.', setting: 'clicks from closed', range: '12 clicks', baseline: 6, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue dial on reservoir.', setting: 'clicks from closed', range: '10 clicks', baseline: 5, type: 'knob' },
        'Compression Mode': { location: 'Blue lever on reservoir.', setting: 'Position', range: '2 positions', positions: ['Open', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'Fox Float X2 Factory': {
      model: 'Fox Float X2',
      series: 'Factory',
      damper: 'Twin-tube',
      spring: 'FLOAT X2 dual air chambers',
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Air Pressure': { location: 'Valve on reservoir (max 300psi).', tool: 'Fox shock pump', range: '100-300 PSI' },
        'Low-Speed Rebound': { location: 'Inner 3mm hex in red dial (Reservoir eyelet).', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Outer 6mm hex in red dial (Reservoir eyelet).', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Inner 3mm hex in blue dial (Reservoir eyelet).', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Outer 6mm hex in blue dial (Reservoir eyelet).', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' }
      }
    },
    'Fox DHX2 Factory': {
      model: 'Fox DHX2',
      series: 'Factory',
      damper: 'Twin-tube',
      spring: 'Coil (requires correct spring rate)',
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: true },
      adjustments: {
        'Spring Preload': { location: 'Preload collar on shock body.', tool: 'Hand', range: 'Variable', type: 'knob' },
        'Low-Speed Rebound': { location: 'Inner 3mm hex in red dial (Reservoir eyelet).', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Rebound': { location: 'Outer 6mm hex in red dial (Reservoir eyelet).', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' },
        'Low-Speed Compression': { location: 'Inner 3mm hex in blue dial (Reservoir eyelet).', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Outer 6mm hex in blue dial (Reservoir eyelet).', setting: 'clicks from closed', range: '8 clicks', baseline: 4, type: 'knob' }
      }
    },
    'Fox DPX2 Factory': {
      model: 'Fox DPX2',
      series: 'Factory',
      damper: 'Twin-tube',
      spring: 'FLOAT EVOL',
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Air valve on main can.', tool: 'Fox shock pump', range: '100-350 PSI' },
        'Low-Speed Rebound': { location: 'Red knob.', setting: 'clicks from closed', range: '14 clicks', baseline: 7, type: 'knob' },
        'Open Mode Adjust': { location: '3mm hex inside blue lever.', setting: 'clicks from closed', range: '10 clicks', baseline: 5, type: 'knob' },
        'Compression Mode': { location: 'Blue lever.', setting: 'Position', range: '3 positions', positions: ['Open', 'Medium', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'Fox Float DPS Factory 3-Pos': {
      model: 'Fox Float DPS',
      series: 'Factory',
      damper: '3-Position',
      spring: 'EVOL',
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Air valve on main body.', tool: 'Fox shock pump', range: '100-300 PSI' },
        'Low-Speed Rebound': { location: 'Red knob near eyelet.', setting: 'clicks from closed', range: '12 clicks', baseline: 6, type: 'knob' },
        'Open Mode Adjust': { location: 'Black knob inside blue lever.', setting: 'clicks', range: '3 settings (1, 2, 3)', type: 'knob' },
        'Compression Mode': { location: 'Blue lever.', setting: 'Position', range: '3 positions', positions: ['Open', 'Medium', 'Firm'], baseline: 'Open', type: 'lever' }
      }
    },
    'Fox Float GENIE': {
      model: 'Fox Float GENIE',
      series: 'Specialized',
      damper: '2-Position Custom',
      spring: 'FLOAT',
      capabilities: { lsc: false, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Air valve on main body.', tool: 'Fox shock pump', range: '100-350 PSI' },
        'Low-Speed Rebound': { location: 'Red knob on eyelet.', setting: 'clicks from closed', range: '12 clicks', baseline: 6, type: 'knob' },
        'Compression Mode': { location: 'Blue lever.', setting: 'Position', range: '2 positions', positions: ['Open', 'Climb'], baseline: 'Open', type: 'lever' }
      }
    },
    'RockShox Super Deluxe Ultimate 2-Pos': {
      model: 'RockShox Super Deluxe Ultimate',
      series: 'Ultimate',
      damper: 'RC2T',
      spring: 'DebonAir+ with volume spacers',
      capabilities: { lsc: true, hsc: false, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Air valve on can.', tool: 'RockShox pump', range: '100-350 PSI' },
        'Low-Speed Rebound': { location: 'Red knob on eyelet.', setting: 'clicks from closed', range: '15 clicks', baseline: 8, type: 'knob' },
        'Low-Speed Compression': { location: 'Small dial on piggyback.', setting: 'clicks from closed', range: '5 clicks', baseline: 2, type: 'knob' },
        'Compression Mode': { location: 'Blue lever.', setting: 'Position', range: '2 positions', positions: ['Open', 'Threshold'], baseline: 'Open', type: 'lever' }
      }
    },
    'RockShox Super Deluxe Ultimate+ LSC Knob': {
      model: 'RockShox Super Deluxe Ultimate',
      series: 'Ultimate+',
      damper: 'RC2T',
      spring: 'DebonAir+ with volume spacers',
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Air valve on can.', tool: 'RockShox pump', range: '100-350 PSI' },
        'Low-Speed Rebound': { location: 'Red knob on eyelet.', setting: 'clicks from closed', range: '15 clicks', baseline: 8, type: 'knob' },
        'Low-Speed Compression': { location: 'Small dial on reservoir.', setting: 'clicks from closed', range: '5 clicks', baseline: 3, type: 'knob' },
        'High-Speed Compression': { location: 'Large dial on reservoir.', setting: 'clicks from closed', range: '5 clicks', baseline: 2, type: 'knob' }
      }
    },
    'RockShox Super Deluxe Ultimate Coil': {
      model: 'RockShox Super Deluxe Ultimate Coil',
      series: 'Ultimate',
      damper: 'RC2T',
      spring: 'Coil (requires correct spring rate)',
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: false },
      adjustments: {
        'Spring Preload': { location: 'Preload collar.', tool: 'Hand', range: 'Variable', type: 'knob' },
        'Low-Speed Rebound': { location: 'Red knob on eyelet.', setting: 'clicks from closed', range: '15 clicks', baseline: 8, type: 'knob' },
        'Low-Speed Compression': { location: 'Small dial on reservoir.', setting: 'clicks from closed', range: '5 clicks', baseline: 3, type: 'knob' },
        'High-Speed Compression': { location: 'Large dial on reservoir.', setting: 'clicks from closed', range: '5 clicks', baseline: 2, type: 'knob' }
      }
    },
    'Öhlins TTX Air': {
      model: 'Öhlins TTX Air',
      series: 'Standard',
      damper: 'TTX Air',
      spring: 'TTX Air (unique design)',
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: false },
      adjustments: {
        'Air Pressure': { location: 'Valve on can.', tool: 'Shock pump', range: '100-350 PSI' },
        'Low-Speed Rebound': { location: 'Gold knob near eyelet.', setting: 'clicks from closed', range: '20 clicks', baseline: 10, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue knob on reservoir.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Black lever on reservoir.', setting: 'Position', range: '3 positions', positions: ['Open', 'Pedal', 'Lock'], type: 'lever' }
      }
    },
    'Öhlins TTX22m': {
      model: 'Öhlins TTX22m',
      series: 'Standard',
      damper: 'TTX22m',
      spring: 'Coil (requires correct spring rate)',
      capabilities: { lsc: true, hsc: true, lsr: true, hsr: false },
      adjustments: {
        'Spring Preload': { location: 'Preload collar.', tool: 'Spanner wrench', range: 'Variable', type: 'knob' },
        'Low-Speed Rebound': { location: 'Gold knob near eyelet.', setting: 'clicks from closed', range: '20 clicks', baseline: 10, type: 'knob' },
        'Low-Speed Compression': { location: 'Blue knob on reservoir.', setting: 'clicks from closed', range: '16 clicks', baseline: 8, type: 'knob' },
        'High-Speed Compression': { location: 'Black lever/knob on reservoir.', setting: 'clicks from closed', range: '3 clicks', baseline: 1, type: 'knob' }
      }
    }
  }
};

export const bikeDatabase: BikeDB = {
  trail: {
    'Santa Cruz Tallboy': { fork: 'Fox 34 Factory GRIP2', shock: 'Fox Float DPS Factory 3-Pos', travel: '130/120mm' },
    'Santa Cruz 5010': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float DPS Factory 3-Pos', travel: '140/130mm' },
    'Santa Cruz Hightower': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float X Factory 2-Pos', travel: '150/145mm' },
    'Santa Cruz Bronson': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float X Factory 2-Pos', travel: '160/150mm' },
    'Trek Top Fuel': { fork: 'RockShox Pike Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '130/120mm' },
    'Trek Fuel EX': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float X Factory 2-Pos', travel: '150/140mm' },
    'YT Izzo': { fork: 'RockShox Pike Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '140/130mm' },
    'YT Jeffsy': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float X Factory 2-Pos', travel: '150/145mm' },
    'Radon Skeen Trail': { fork: 'RockShox Pike Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '140/120mm' },
    'Radon Slide Trail': { fork: 'RockShox Pike Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '140/140mm' },
    'Specialized Stumpjumper 15': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float GENIE', travel: '150/145mm' },
    'Yeti SB140': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float X Factory 2-Pos', travel: '150/140mm' },
    'Ibis Ripmo V3': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float X Factory 2-Pos', travel: '160/147mm' },
    'Whyte T-160': { fork: 'RockShox Lyrik Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '160/160mm' },
    'Revel Rascal': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float DPS Factory 3-Pos', travel: '150/140mm' },
    'Ari Delano Peak': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float DPS Factory 3-Pos', travel: '150/135mm' }
  },
  enduro: {
    'Santa Cruz Megatower': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '170/165mm' },
    'Santa Cruz Nomad': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '170/170mm' },
    'Trek Slash': { fork: 'RockShox ZEB Ultimate RC2', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '170/170mm' },
    'YT Capra': { fork: 'RockShox Lyrik Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '180/170mm' },
    'Radon Swoop': { fork: 'RockShox Lyrik Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '170/170mm' },
    'Radon JAB 29': { fork: 'RockShox Lyrik Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '170/170mm' },
    'Radon JAB MX': { fork: 'RockShox Lyrik Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '170/170mm' },
    'Yeti SB160': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '170/160mm' },
    'Pivot Firebird': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '180/170mm' },
    'Rocky Mountain Altitude': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '170/160mm' },
    'Canyon Strive': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '170/170mm' },
    'Specialized Enduro': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '180/170mm' },
    'Transition Spire': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '170/170mm' },
    'Orbea Rallon': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '170/160mm' }
  },
  'bike park / downhill': {
    'Santa Cruz V10': { fork: 'Fox 40 Factory GRIP2', shock: 'Fox DHX2 Factory', travel: '215/215mm' },
    'Trek Session': { fork: 'Fox 40 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '200/200mm' },
    'YT Tues': { fork: 'RockShox Lyrik Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '200/200mm' },
    'Yeti SB165': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '180/165mm' },
    'Specialized Demo': { fork: 'Fox 40 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '200/200mm' }
  }
};

export const eBikeDatabase: BikeDB = {
  trail: {
    'Santa Cruz Heckler': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float X Factory 2-Pos', travel: '150/140mm' },
    'Trek Fuel EXe': { fork: 'Fox 36 Factory GRIP2', shock: 'Fox Float X Factory 2-Pos', travel: '150/140mm' },
    'Radon Render': { fork: 'RockShox Pike Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '150/140mm' }
  },
  enduro: {
    'Santa Cruz Bullit': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '170/160mm' },
    'Trek Rail': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '160/150mm' },
    'YT Decoy': { fork: 'RockShox Lyrik Ultimate RC', shock: 'RockShox Super Deluxe Ultimate 2-Pos', travel: '170/165mm' },
    'YT Decoy MX': { fork: 'Fox 38 Factory GRIP2', shock: 'Fox Float X2 Factory', travel: '170/165mm' },
    'Radon Swoop Hybrid': { fork: 'RockShox Lyrik Ultimate RC', shock: 'RockShox Super Deluxe Ultimate Coil', travel: '170/165mm' }
  }
};
