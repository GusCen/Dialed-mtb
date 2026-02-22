
import { CalculatedSettings, UserPreferences, SuspensionComponent } from './types';
import { suspensionDatabase } from './constants';

export const calculateSettings = (
  weight: number, 
  rideType: string, 
  componentName: string, 
  componentType: 'fork' | 'shock',
  preferences: UserPreferences = { pressureModifier: 1.0, reboundModifier: 0 },
  bikeType: 'muscle' | 'ebike' = 'muscle'
): CalculatedSettings => {
  
  const component: SuspensionComponent | undefined = componentType === 'fork' 
    ? suspensionDatabase.forks[componentName] 
    : suspensionDatabase.shocks[componentName];

  if (!component) {
    return { settings: {} };
  }

  const settings: Record<string, string | number> = {};
  const eBikeMultiplier = bikeType === 'ebike' ? 1.18 : 1.0; 
  
  // --- 1. Sag Recommendations based on Ride Style ---
  const sagMap: Record<string, string> = {
    'XC': '20-22%',
    'Trail': '25-28%',
    'Enduro': '30-32%',
    'Bike Park': '28-30%', // Slightly firmer for support on big landings
    'Downhill': '33-35%'
  };

  // --- 2. Spring Calculation (Air Pressure or Coil Rate) ---
  const isCoil = component.adjustments['Spring Preload'] !== undefined;
  
  if (!isCoil) {
    // Air Pressure Logic
    const baseMultiplier = componentType === 'fork' ? 1.05 : 2.7; 
    
    // XC = Less Sag = More Pressure. DH = More Sag = Less Pressure.
    const rideTypeMultipliers: Record<string, number> = {
      'XC': 1.15,        // +15% pressure for efficiency
      'Trail': 1.0,      // Baseline
      'Enduro': 0.92,    // -8% pressure for compliance
      'Bike Park': 1.04, // +4% for bottom-out support
      'Downhill': 0.86   // -14% for max traction
    };
    
    let psi = Math.round(weight * baseMultiplier * (rideTypeMultipliers[rideType] || 1.0) * preferences.pressureModifier * eBikeMultiplier);
    settings['Air Pressure'] = psi;
  } else {
    // Coil Rate Logic
    const baseRate = weight * (componentType === 'fork' ? 5.5 : 6.8);
    settings['Spring Rate'] = Math.round(baseRate / 50) * 50;
    settings['Spring Preload'] = "1-2 turns";
  }

  // --- 3. Damping Calculation Helpers ---
  const reboundOffset = (bikeType === 'ebike' ? 2 : 0) + preferences.reboundModifier;
  const compressionOffset = (bikeType === 'ebike' ? -2 : 0);

  // --- 4. Iterate through adjustments ---
  Object.keys(component.adjustments).forEach(key => {
    const adj = component.adjustments[key];
    if (key === 'Air Pressure' || key === 'Spring Preload' || key === 'Spring Rate') return;

    if (adj.type === 'lever') {
      settings[key] = "Open"; 
      return;
    }

    if (adj.type === 'knob' && adj.range) {
      const maxClicks = parseInt(adj.range.split(' ')[0]) || 12;
      
      if (key.includes('Rebound')) {
         const riderFactor = Math.max(0, Math.min(1, (weight - 50) / (120 - 50)));
         let baseClicksOut = Math.round(maxClicks - (riderFactor * (maxClicks * 0.7))); 
         let finalClicks = baseClicksOut + reboundOffset;
         if (key.includes('High-Speed')) finalClicks += 2;
         settings[key] = Math.max(1, Math.min(maxClicks - 1, finalClicks));
      } 
      else if (key.includes('Compression')) {
         const riderFactor = Math.max(0, Math.min(1, (weight - 50) / (120 - 50)));
         let baseClicksOut = Math.round(maxClicks / 2);
         baseClicksOut -= Math.round(riderFactor * 4);
         
         if (rideType === 'Bike Park' || rideType === 'Downhill') baseClicksOut -= 2;
         if (rideType === 'XC') baseClicksOut += 2;
         
         let finalClicks = baseClicksOut - compressionOffset;
         if (key.includes('High-Speed')) finalClicks += 1;
         settings[key] = Math.max(1, Math.min(maxClicks - 1, finalClicks));
      }
    }
  });

  return { 
    settings, 
    recommendedSag: sagMap[rideType] || '25-30%' 
  };
};
