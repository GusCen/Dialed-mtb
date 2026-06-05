
export interface Adjustment {
  location: string;
  tool?: string;
  range?: string;
  setting?: string; // e.g. "clicks from closed", "Position"
  baseline?: number | string;
  type?: 'knob' | 'lever' | 'spacer';
  positions?: string[];

  // The tuning engine MUST branch on `func`, never on whether the display key
  // string contains "Compression"/"Rebound". Fox names its FIT4/DPX2 low-speed
  // compression dial "Open Mode Adjust", which the old string-match never
  // recognised as compression. `func` decouples the marketing name (kept in the
  // key / `location`) from the tuning function.
  //   lsc/hsc/lsr/hsr — low/high-speed compression/rebound damping knobs
  //   airSpring       — main air pressure
  //   rampUp          — secondary ramp-up air chamber
  //   preload         — coil spring preload
  //   modeLever       — climb / mode lever (Open/Medium/Firm etc.)
  func?: 'lsc' | 'hsc' | 'lsr' | 'hsr'
       | 'airSpring' | 'rampUp' | 'preload' | 'modeLever';
}

export interface SuspensionComponent {
  model: string;
  series: string;
  damper: string;
  airSpring?: string;
  spring?: string;
  travel?: string[];
  capabilities: {
    lsc: boolean;
    hsc: boolean;
    lsr: boolean;
    hsr: boolean;
  };
  adjustments: Record<string, Adjustment>;
}

export interface BikeSpec {
  fork: string;
  shock: string;
  travel: string;
}

export interface SuspensionDB {
  forks: Record<string, SuspensionComponent>;
  shocks: Record<string, SuspensionComponent>;
}

export interface BikeDB {
  [category: string]: Record<string, BikeSpec>;
}

export interface FormData {
  weight: string;
  bikeType: string;
  bikeCategory: string;
  bikeModel: string;
  frontSuspension: string;
  rearShock: string;
  rideType: string;
  terrain: string;
}

export interface CalculatedSettings {
  settings: Record<string, string | number>;
  recommendedSag?: string;
}

export interface UserPreferences {
  pressureModifier: number; // Default 1.0. >1.0 is stiffer, <1.0 is softer
  reboundModifier: number; // Default 0. + is faster (less damping), - is slower
}

export interface SavedSetup {
  id: string;
  name: string;
  date: string;
  formData: FormData;
  rating?: number; // 1-5
  feedback?: 'Perfect' | 'Too Soft' | 'Too Hard' | 'Too Fast' | 'Too Slow';
}
