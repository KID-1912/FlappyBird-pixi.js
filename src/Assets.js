(function (game) {
  game.Assets = class {
    loader = null;
    bg = null;
    bird = null;
    ground = null;
    holdback = null;
    number = null;
    over = null;
    ready = null;
    birdAtlas = [];
    numberGlyphs = [];
    constructor() {
      // 资源列表
      const resources = [
        { name: "bg", url: "assets/images/bg.png" },
        { name: "bird", url: "assets/images/bird.png" },
        { name: "ground", url: "assets/images/ground.png" },
        { name: "holdback", url: "assets/images/holdback.png" },
        { name: "number", url: "assets/images/number.png" },
        { name: "over", url: "assets/images/over.png" },
        { name: "ready", url: "assets/images/ready.png" },
      ];
      this.loader = new PIXI.Loader().add(resources);
      // 初始化assets
      this.on("complete", (loader, resources) => {
        this.bg = resources.bg;
        this.bird = resources.bird;
        this.ground = resources.ground;
        this.holdback = resources.holdback;
        this.number = resources.number;
        this.over = resources.over;
        this.ready = resources.ready;
        const birdFrames = [
          [0, 0, 86, 60],
          [0, 60, 86, 60],
          [0, 120, 86, 60],
        ];
        this.birdAtlas = birdFrames.map((item) => {
          const frame = new PIXI.Rectangle(...item);
          return new PIXI.Texture(this.bird.texture, frame);
        });
        const numberTexture = this.number.texture;
        this.numberGlyphs = {
          0: new PIXI.Texture(numberTexture, new PIXI.Rectangle(0, 0, 60, 91)),
          1: new PIXI.Texture(numberTexture, new PIXI.Rectangle(61, 0, 60, 91)),
          2: new PIXI.Texture(
            numberTexture,
            new PIXI.Rectangle(121, 0, 60, 91)
          ),
          3: new PIXI.Texture(
            numberTexture,
            new PIXI.Rectangle(191, 0, 60, 91)
          ),
          4: new PIXI.Texture(
            numberTexture,
            new PIXI.Rectangle(261, 0, 60, 91)
          ),
          5: new PIXI.Texture(
            numberTexture,
            new PIXI.Rectangle(331, 0, 60, 91)
          ),
          6: new PIXI.Texture(
            numberTexture,
            new PIXI.Rectangle(401, 0, 60, 91)
          ),
          7: new PIXI.Texture(
            numberTexture,
            new PIXI.Rectangle(471, 0, 60, 91)
          ),
          8: new PIXI.Texture(
            numberTexture,
            new PIXI.Rectangle(541, 0, 60, 91)
          ),
          9: new PIXI.Texture(
            numberTexture,
            new PIXI.Rectangle(611, 0, 60, 91)
          ),
        };
      });
    }

    // 加载
    load() {
      this.loader.load();
    }

    // 监听加载事件
    on(name, handle) {
      const callback = handle.bind(this);
      if (name === "start") this.loader.onStart.add(callback);
      if (name === "progress") this.loader.onProgress.add(callback);
      if (name === "error") this.loader.onError.add(callback);
      if (name === "complete") this.loader.onComplete.add(callback);
    }
  };
})(window.game);
