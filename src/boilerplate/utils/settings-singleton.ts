interface Action {
  type: string;
}

interface gameSettings {
  maxFighters: integer;
  fighterSpawnInterval: integer;
  maxBattleships: integer;
  battleshipSpawnInterval: integer;
  zoom: number;
  musicVolume: number;
  sfxVolume: number;
  // game values
  score: integer;
  currentStreak: integer;
  streakLevels: Array<integer>;
}
let gameSettings = <gameSettings>{
  maxFighters: 0,
  fighterSpawnInterval: 4000,
  battleshipSpawnInterval: 16000,
  maxBattleships: 0,
  zoom: 0.4,
  sfxVolume: 0.0,
  musicVolume: 0.0,

  // game values
  score: 0,
  currentStreak: 0,
  streakLevels: [3, 8, 13, 21],
};

export class SettingsSingleton {
  private static instance: SettingsSingleton;
  settings: gameSettings;
  // private actionsSubject = new BehaviorSubject<Action>(null);

  //get actions$() {
  //  return this.actionsSubject.asObservable();
  //}

  private constructor(settings: gameSettings) {
    console.log('settings constructor called');
    this.settings = settings;
  }

  static getInstance(): SettingsSingleton {
    if (!SettingsSingleton.instance) {
      SettingsSingleton.instance = new SettingsSingleton(gameSettings);
    }

    return SettingsSingleton.instance;
  }

  dispatch(action: Action) {
    //this.actionsSubject.next(action);
  }
}
