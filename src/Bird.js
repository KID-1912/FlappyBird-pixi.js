(function (game) {
  game.Bird = class extends PIXI.AnimatedSprite {
    isDead = false;
    flyHeight = 60; // 单次飞行高度
    startY = 0; // 初始高度
    startFlyY = 0; // 最近一次飞翔起点高度
    gravity = (10 / 1000) * 0.2; // 重力速度 3px/1000ms
    initVelocity = 0; // 飞行高度初始速度
    tween = null; // 准备状态动画
    groundY = 0; // 地面位置
    constructor(options) {
      super(options.altas);
      this.startY = options.y;
      this.animationSpeed = 0.2;
      this.pivot.set(43 * 2, 30 * 2);
      this.position.set(options.x, options.y);

      this.initVelocity = Math.sqrt(2 * this.flyHeight * this.gravity);
      this.ticker = new PIXI.Ticker().add(this.onUpdate.bind(this));
      this.groundY = options.groundY;
    }

    // 准备状态
    ready() {
      this.alpha = 1;
      this.isDead = false;
      this.y = this.startY;
      this.startFlyY = 0;
      this.tween = gsap.to(this, {
        y: this.y + 10,
        angle: -8,
        duration: 0.6,
        yoyo: true,
        repeat: -1,
        ease: Linear.easeNone,
      });
      this.play();
    }

    // 向上飞行
    flyUp() {
      if (this.tween) {
        this.angle = 0;
        this.tween.pause();
      }
      if (!this.ticker.started) this.ticker.start();
      this.startFlyY = this.y;
      this.startFlyTime = +Date.now();
    }

    // 更新位置
    onUpdate() {
      if (this.isDead) {
        this.ticker.stop();
        return;
      }
      // 时间差值
      const time = +Date.now() - this.startFlyTime;
      // 飞行距离 向上为正，向下为负
      const distance =
        this.initVelocity * time - (this.gravity * time * time) / 2;
      this.y = this.startFlyY - distance; // 结果值

      if (this.y >= this.groundY) {
        this.isDead = true;
        this.y = this.groundY;
      }
    }
  };
})(window.game);
