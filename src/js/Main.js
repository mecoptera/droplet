import MainMenu from './modules/MainMenu';
import GameMenu from './modules/GameMenu';
import Variable from './modules/Variable';
import Background from './modules/Background';
import Story from './modules/Story';
import Scene from './modules/Scene';
import { Text, Narrator } from './modules/Text';
import Character from './modules/Character';
import Choose from './modules/Choose';
import Input from './modules/Input';
import Sound from './modules/Sound';
import History from './modules/History';
import Save from './modules/Save';
import EngineStore from './stores/EngineStore';
import SceneStore from './stores/SceneStore';

class Main {
  constructor() {
    window.D = {
      Renderer: null,
      Stage: null,
      Loader: null,

      EngineStore: new EngineStore(),
      SceneStore: new SceneStore(),

      MainMenu: MainMenu,
      GameMenu: GameMenu,

      Variable: Variable,
      Background: Background,
      Story: Story,
      Scene: Scene,
      Text: Text,
      Narrator: Narrator,
      Character: Character,
      Choose: Choose,
      Input: Input,
      Sound: Sound,
      History: History,

      Save: Save,

      FPSMeter: new FPSMeter()
    };

    this._stageChildrenCount = 0;

    this._dom = {};
    this._dom.mainWarpper = document.querySelector('.js_main_wrapper');

    this._init();
  }

  _init() {
    D.Renderer = PIXI.autoDetectRenderer(1920, 1080, {
      antialias: false,
      transparent: false,
      resolution: 1
    });
    D.Renderer.view.style.display = 'none';

    document.body.insertBefore(D.Renderer.view, this._dom.mainWarpper);
    window.addEventListener('resize', this._resize.bind(this));

    D.Stage = new PIXI.Container();

    this._resize();
    this._load();
  }

  _resize() {
    const canvas = D.Renderer.view;
    const wWidth = this._dom.mainWarpper.offsetWidth;
    const wHeight = this._dom.mainWarpper.offsetHeight;
    let scale = 1;
    let scaleX = wWidth / 1920;
    let scaleY = wHeight / 1080;

    if (scaleX > scaleY) {
      scale = wHeight / 1080;

      this._dom.mainWarpper.style.width = parseInt(1920 * scaleY) + 'px';
      this._dom.mainWarpper.style.height = wHeight + 'px';
    } else {
      scale = wWidth / 1920;

      this._dom.mainWarpper.style.width = wWidth + 'px';
      this._dom.mainWarpper.style.height = parseInt(1080 * scaleX) + 'px';
    }

    const guiElements = this._dom.mainWarpper.querySelectorAll('.js_gui_element');

    [].forEach.call(guiElements, (elem) => {
      elem.style.transform = 'scale(' + scale + ')';
    });
    this._dom.mainWarpper.style.position = 'relative';

    const gameMenuHistory = this._dom.mainWarpper.querySelector('.js_history .js_gui_element');
    gameMenuHistory.style.transform = 'scale(' + scale + ') translateX(-50%) translateY(-50%)';

    const gameMenuSave = this._dom.mainWarpper.querySelector('.js_save .js_gui_element');
    gameMenuSave.style.transform = 'scale(' + scale + ') translateX(-50%) translateY(-50%)';

    canvas.style.transform = 'scale(' + scale + ')';
    canvas.style.marginLeft = this._dom.mainWarpper.offsetLeft + 'px';
    canvas.style.display = 'block';
  }

  _load() {
    this._dom.mainWarpper.style.display = 'none';

    const assetsToLoader = [
      'static/school_1.jpg',
      'static/school_2.jpg',
      'static/school_3.jpg',
      'static/char_1.json',
      'static/char_2.json',
      'static/player_avatar.png',
      'static/char_1_avatar.png',
      'static/char_2_avatar.png',
      'static/bgm_1.mp3',
      'static/bgm_2.mp3',
      'static/whosh.mp3',
      'static/birds.mp3'
    ];

    D.Loader = new PIXI.loaders.Loader();
    D.Loader.add(assetsToLoader);
    D.Loader.on('progress', this._loadProgress.bind(this));
    D.Loader.load(this._loadFinished.bind(this));
  }

  _loadProgress(event, resource) {
    
  }

  _loadFinished() {
    this._dom.mainWarpper.style.removeProperty('display');

    D.Background.init();
    D.MainMenu.show();

    this._update();
  }

  _updateLayersOrder() {
    D.Stage.children.sort(function(a, b) {
      if (a.position.z < b.position.z) {
        return -1;
      }

      if (a.position.z > b.position.z) {
        return 1;
      }

      return 0;
    });
  }

  _update() {
    D.FPSMeter.tickStart();

    this._updateLayersOrder();

    requestAnimationFrame(() => {
      this._render();
      this._update();
    });
  }

  _render() {
    D.Renderer.render(D.Stage);

    if (D.EngineStore.getData('takeScreenshot')) {
      D.EngineStore.setData('takeScreenshot', false);
    }

    D.FPSMeter.tick();
  }
}

(function() {
  new Main();
})();
