(function (game) {
  game.ReadyScene = class extends PIXI.Container {
    constructor(options) {
      super();
      this.init(options);
    }
    init(options) {
      const readySceneTexture = options.resource.texture;
      // mask
      const mask = new PIXI.Graphics();
      mask.beginFill();
      mask.alpha = 0;
      mask.drawRect(0, 0, options.width, options.height);
      mask.endFill();
      this.addChild(mask);
      // tagTip
      let frame = new PIXI.Rectangle(0, 150, 287, 260);
      const tabTipTexture = new PIXI.Texture(readySceneTexture, frame);
      const tapTip = new PIXI.Sprite(tabTipTexture);
      tapTip.position.set((this.width - tapTip.width) >> 1, 500);
      // ready
      frame = new PIXI.Rectangle(0, 0, 490, 150);
      const readyTexture = new PIXI.Texture(readySceneTexture, frame);
      const ready = new PIXI.Sprite(readyTexture);
      ready.position.set(
        (this.width - ready.width) >> 1,
        tapTip.y - ready.height
      );
      this.addChild(ready, tapTip);
    }
  };
})(window.game);
