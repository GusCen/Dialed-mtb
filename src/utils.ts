
import { CalculatedSettings, UserPreferences, SuspensionComponent, Adjustment } from './types';
import { suspensionDatabase } from './constants';

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

// Parse a leading integer out of a range string, e.g. "16 clicks" -> 16.
const parseMaxClicks = (range: string | undefined): number => {
  const parsed = parseInt((range ?? '').split(' ')[0], 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 12;
};

// Parse "150-250 PSI" -> { min: 150, max: 250 }. Returns null if unparseable.
const parsePsiRange = (range: string | undefined): { min: number; max: number } | null => {
  const match = (range ?? '').match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };
};

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
  const adjustments = component.adjustments;

  // --- 1. Sag Recommendations based on Ride Style ---
  const sagMap: Record<string, string> = {
    'XC': '20-22%',
    'Trail': '25-28%',
    'Enduro': '30-32%',
    'Bike Park': '28-30%', // Slightly firmer for support on big landings
    'Downhill': '33-35%'
  };

  // --- 2. Spring Calculation (Air Pressure or Coil Rate) ---
  // Coil is identified by a `preload` adjuster (decoupled from display names).
  const isCoil = Object.values(adjustments).some(adj => adj.func === 'preload');

  let mainAirPressure: number | null = null;

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

    mainAirPressure = Math.round(
      weight * baseMultiplier * (rideTypeMultipliers[rideType] || 1.0)
      * preferences.pressureModifier * eBikeMultiplier
    );
    settings['Air Pressure'] = mainAirPressure;
  } else {
    // Coil Rate Logic
    const baseRate = weight * (componentType === 'fork' ? 5.5 : 6.8);
    settings['Spring Rate'] = Math.round(baseRate / 50) * 50;
    settings['Spring Preload'] = "1-2 turns";
  }

  // --- 3. Damping Calculation Helpers ---
  const reboundOffset = (bikeType === 'ebike' ? 2 : 0) + preferences.reboundModifier;
  const compressionOffset = (bikeType === 'ebike' ? -2 : 0);

  // Rebound now responds to ride style (Bug 1 fix): faster rebound (more clicks
  // out) for pedally/flow disciplines, slower (fewer clicks out) for repeated
  // big-hit disciplines.
  const reboundRideTypeOffsets: Record<string, number> = {
    'XC': 2,
    'Trail': 0,
    'Enduro': -1,
    'Bike Park': -2,
    'Downhill': -2
  };
  const reboundRideTypeOffset = reboundRideTypeOffsets[rideType] ?? 0;

  // 0 at <=50kg, 1 at >=120kg.
  const riderFactor = clamp((weight - 50) / (120 - 50), 0, 1);

  const computeReboundClicks = (adj: Adjustment): number => {
    const maxClicks = parseMaxClicks(adj.range);
    let baseClicksOut = Math.round(maxClicks - (riderFactor * (maxClicks * 0.7)));
    baseClicksOut += reboundRideTypeOffset;
    let finalClicks = baseClicksOut + reboundOffset;
    if (adj.func === 'hsr') finalClicks += 2;
    return clamp(finalClicks, 1, maxClicks - 1);
  };

  const computeCompressionClicks = (adj: Adjustment): number => {
    const maxClicks = parseMaxClicks(adj.range);
    let baseClicksOut = Math.round(maxClicks / 2);
    baseClicksOut -= Math.round(riderFactor * 4); // heavier -> fewer clicks out
    if (rideType === 'Bike Park' || rideType === 'Downhill') baseClicksOut -= 2;
    if (rideType === 'XC') baseClicksOut += 2;
    let finalClicks = baseClicksOut - compressionOffset;
    if (adj.func === 'hsc') finalClicks += 1;
    return clamp(finalClicks, 1, maxClicks - 1);
  };

  // Some compression controls (e.g. Fox DPS "Open Mode Adjust") expose discrete
  // positions (1 = firmest .. 3 = most open) rather than clicks.
  const computeCompressionPosition = (): number => {
    if (weight >= 85 || rideType === 'Bike Park' || rideType === 'Downhill') return 1;
    if (weight <= 65 || rideType === 'XC') return 3;
    return 2;
  };

  const isPositionBased = (adj: Adjustment): boolean =>
    !!adj.positions || /position|setting/i.test(adj.range ?? '');

  // --- 4. Iterate through adjustments, branching on `func` (never name strings) ---
  Object.entries(adjustments).forEach(([key, adj]) => {
    if (!adj.func) {
      // No silent fall-through: surface mislabelled / incomplete data in dev.
      console.warn(`[calculateSettings] Adjuster "${key}" on "${componentName}" has no func; skipping.`);
      return;
    }

    switch (adj.func) {
      case 'airSpring':
      case 'preload':
        // Already handled by the spring logic above.
        return;

      case 'rampUp': {
        // Secondary air chamber (e.g. Öhlins ramp-up). It's a second pressure,
        // not damping: main pressure + 40-60 PSI, a touch more for heavier
        // riders and big-hit disciplines. Clamped to the chamber's stated range.
        if (mainAirPressure === null) return;
        let bump = 40 + Math.round(riderFactor * 20);
        if (rideType === 'Bike Park' || rideType === 'Downhill') bump += 10;
        let rampPressure = mainAirPressure + bump;
        const psiRange = parsePsiRange(adj.range);
        if (psiRange) rampPressure = clamp(rampPressure, psiRange.min, psiRange.max);
        settings[key] = rampPressure;
        return;
      }

      case 'modeLever':
        // Stays Open by default; the field lets us later set Medium/Firm for
        // XC + climbing without another refactor.
        settings[key] = 'Open';
        return;

      case 'lsr':
      case 'hsr':
        settings[key] = computeReboundClicks(adj);
        return;

      case 'lsc':
      case 'hsc':
        settings[key] = isPositionBased(adj)
          ? computeCompressionPosition()
          : computeCompressionClicks(adj);
        return;

      default:
        console.warn(`[calculateSettings] Unhandled func "${adj.func}" on "${key}".`);
        return;
    }
  });

  return {
    settings,
    recommendedSag: sagMap[rideType] || '25-30%'
  };
};
