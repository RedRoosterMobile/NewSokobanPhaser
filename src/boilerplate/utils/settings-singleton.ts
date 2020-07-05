interface Action {
  type: string;
}

interface gameSettings {
  maxFighters: integer;
  fighterSpawnInterval: integer,
  maxBattleships: integer,
  battleshipSpawnInterval: integer,
  zoom: number;
  musicVolume: number;
  sfxVolume: number;
}
let gameSettings = <gameSettings>{
  maxFighters: 10,
  fighterSpawnInterval: 4000,
  battleshipSpawnInterval: 8000,
  maxBattleships: 1,
  zoom: 0.4,
  sfxVolume: 0.0,
  musicVolume: 0.0,
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
