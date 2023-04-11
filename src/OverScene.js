(function (game) {
  game.OverScene = class extends PIXI.Container {
    constructor(options) {
      super();
      this.visible = options.visible;
      this.glyphs = options.glyphs;
      this.init(options);
    }
    // 初始化
    init(options) {
      const OverSceneTexture = options.resource.texture;
      // mask
      const mask = new PIXI.Graphics();
      mask.beginFill();
      mask.alpha = 0;
      mask.drawRect(0, 0, options.width, options.height);
      mask.endFill();
      this.addChild(mask);

      // over
      let frame = new PIXI.Rectangle(0, 300, 510, 150);
      const overTexture = new PIXI.Texture(OverSceneTexture, frame);
      const over = new PIXI.Sprite(overTexture);
      over.position.set((this.width - over.width) >> 1, 320);

      // board
      frame = new PIXI.Rectangle(0, 0, 600, 300);
      const boardTexture = new PIXI.Texture(OverSceneTexture, frame);
      const board = new PIXI.Sprite(boardTexture);
      board.position.set(
        (this.width - board.width) >> 1,
        over.y + over.height + 10
      );
      // 分数
      this.score = new game.Score({
        x: 470,
        y: 90,
        glyphs: game.assets.numberGlyphs,
      });
      // best分数
      this.bestScore = new game.Score({
        x: 470,
        y: 200,
        value: localStorage.getItem("bestScore") || 0,
        glyphs: game.assets.numberGlyphs,
      });
      this.score.scale.set(0.5, 0.5);
      this.bestScore.scale.set(0.5, 0.5);
      board.addChild(this.score, this.bestScore);

      // startBtn
      frame = new PIXI.Rectangle(600, 0, 280, 155);
      const startBtnTexture = new PIXI.Texture(OverSceneTexture, frame);
      const startBtn = new PIXI.Sprite(startBtnTexture);
      startBtn.position.set(board.x, board.y + board.height + 10);
      startBtn.on("touchend", () => window.game.ready());
      this.startBtn = startBtn;

      // rankBtn
      frame = new PIXI.Rectangle(600, 175, 280, 150);
      const rankBtnTexture = new PIXI.Texture(OverSceneTexture, frame);
      const rankBtn = new PIXI.Sprite(rankBtnTexture);
      rankBtn.position.set(board.x + board.width - startBtn.width, startBtn.y);

      this.addChild(over, board, startBtn, rankBtn);
    }

    // 显示
    show(score) {
      this.visible = true;
      this.score.setValue(score);
      const bestScore = localStorage.getItem("bestScore");
      if (!bestScore || Number(bestScore) < score) {
        this.bestScore.setValue(score);
        localStorage.setItem("bestScore", score);
      }
      gsap.fromTo(
        this,
        { alpha: 0 },
        {
          alpha: 1,
          delay: 0.6,
          duration: 0.3,
          onComplete: () => (this.startBtn.interactive = true),
        }
      );
    }

    // 隐藏
    hide() {
      this.visible = false;
      this.startBtn.interactive = false;
    }
  };
})(window.game);
