(function (game) {
  game.Score = class extends PIXI.Container {
    value = 0;
    glyphs = [];
    constructor(options) {
      super();
      this.position.set(options.x, options.y);
      this.glyphs = options.glyphs;
      this.setValue(options.value || 0);
    }
    setValue(number) {
      this.value = number;
      const text = number.toString();
      this.removeChildren(); //清除上次文字
      text.split("").forEach((index, i) => {
        const number = new PIXI.Sprite(this.glyphs[index]);
        number.x = this.getLocalBounds().width + 6 * i;
        this.addChild(number);
      });
      this.pivot.x = this.getLocalBounds().width / 2;
    }
  };
})(window.game);
