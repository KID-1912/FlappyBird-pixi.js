(function () {
  gsap.registerPlugin(PixiPlugin);
  gsap.defaults({
    ease: "linear",
    duration: 1,
  });
  window.addEventListener("load", () => {
    game.assets = new game.Assets();
    // game.assets.on("progress", (loader, resource) =>
    //   console.log(parseInt(loader.progress))
    // );
    game.assets.on("complete", () => {
      console.log("资源加载完成");
      console.log(game);
      game.init();
    });
    game.assets.load();
  });

  // 游戏game
  let game = (window.game = {
    width: 750,
    height: 1600,
    ratio: 1,
    stage: null, // 舞台
    ticker: null,
    assets: null, // 资源管理

    state: "", // 游戏状态：ready playing over
    readyScene: null,
    gameOverScene: null,
    ground: null,
    bird: null,
    score: null,

    // 初始化
    init() {
      // 2倍画布(stage) view
      const app = new PIXI.Application({
        width: this.width,
        height: this.height,
        resolution: this.ratio,
      });
      app.stage.sortableChildren = true;
      this.stage = app.stage;
      this.ticker = new PIXI.Ticker();
      document.body.appendChild(app.view);

      game.initBackground();
      game.initHoldbacks();
      game.initBird();
      game.initScore();
      game.initScene();

      // 绑定交互
      app.stage.on("touchend", this.onUserInput.bind(this));
      // 游戏循环
      this.ticker.add(this.gameLoop.bind(this));
      game.ready();
    },

    // 准备
    ready() {
      console.log("游戏准备");
      this.state = "ready";
      this.stage.interactive = true;
      this.readyScene.visible = true;
      this.gameOverScene.hide();
      this.bird.ready();
      this.holdbacks.reset();
    },

    // 开始
    start() {
      console.log("游戏开始");
      this.state = "playing";
      this.readyScene.visible = false;
      this.holdbacks.startMove();
      this.ticker.start();
    },

    // 暂停游戏
    pause() {
      this.ticker.stop();
      this.stage.interactive = false;
      this.holdbacks.stopMove();
      this.bird.stop();
    },

    // 结束
    over() {
      console.log("游戏结束");
      this.state = "over";
      this.pause();
      this.bird.alpha = 0.6;
      this.score.visible = false;
      this.gameOverScene.show(this.score.value);
    },

    // 初始化背景地面
    initBackground() {
      //背景
      const bgTexture = this.assets.bg.texture;
      const bgSprite = new PIXI.Sprite(bgTexture);
      bgSprite.width = this.width;
      // 地面
      const groundTexture = this.assets.ground.texture;
      const groundBaseTexture = groundTexture.baseTexture;
      const groundTilingSprite = new PIXI.TilingSprite(
        groundTexture,
        this.width,
        this.height - 1036
      );
      groundTilingSprite.y = 1036;
      // 地面背景色
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0xded895);
      graphics.drawRect(
        0,
        groundBaseTexture.height,
        this.width,
        groundTilingSprite.height - groundBaseTexture.height
      );
      graphics.endFill();
      groundTilingSprite.addChild(graphics);

      this.stage.addChild(bgSprite, groundTilingSprite);
      const scroll = () => {
        let tileX = groundTilingSprite.tilePosition.x - 4;
        if (tileX === -groundTilingSprite.width) tileX = 0;
        groundTilingSprite.tilePosition.x = tileX;
      };
      groundTilingSprite.zIndex = 1;
      this.ground = groundTilingSprite;
      this.ticker.add(scroll);
    },

    // 初始化场景
    initScene() {
      this.readyScene = new game.ReadyScene({
        width: this.width,
        height: this.height,
        resource: this.assets.ready,
      });
      this.gameOverScene = new game.OverScene({
        width: this.width,
        height: this.height,
        visible: false,
        resource: this.assets.over,
      });
      this.stage.addChild(this.readyScene);
      this.stage.addChild(this.gameOverScene);
    },

    // 初始化障碍
    initHoldbacks() {
      this.holdbacks = new game.Holdbacks({
        startX: this.width + 120,
        y: 0,
        resource: this.assets.holdback,
        groundY: this.ground.y,
      });
      this.stage.addChild(this.holdbacks);
    },

    // 初始化小鸟
    initBird() {
      this.bird = new game.Bird({
        x: 150,
        y: 650,
        groundY: this.ground.y,
        altas: this.assets.birdAtlas,
      });
      this.stage.addChild(this.bird);
    },

    // 初始化分数
    initScore() {
      this.score = new game.Score({
        x: this.width >> 1,
        y: 150,
        glyphs: this.assets.numberGlyphs,
      });
      this.stage.addChild(this.score);
    },

    // 用户输入控制
    onUserInput() {
      this.bird.flyUp();
      if (this.state === "ready") this.start();
    },

    // 游戏循环
    gameLoop() {
      // 游戏失败
      if (this.bird.isDead || this.holdbacks.checkCollision(this.bird)) {
        this.over();
        return;
      }

      // 更新分数
      const score = this.holdbacks.calThroughHoseNum(this.score.value);
      if (score !== this.score.value) this.score.setValue(score);
    },
  });
})();
