(function (game) {
  game.Holdbacks = class extends PIXI.Container {
    numHoses = 4; // 同时存在管道组数 上下为一组
    numOffScreenNum = 2; // 最多移出屏幕左侧管道组数
    hoseWidth = 130;
    hoseHeight = 800;
    startX = 0; // 起始x值
    hoseSpacingX = 300; // 左右管道间距
    hoseSpacingY = 300; // 上下管道间距
    groundY = 0; // 地面Y值
    moveTween = null; // 动画
    throughHoseNum = 0; // 通过管子数
    constructor(options) {
      super();
      this.groundY = options.groundY;
      this.startX = options.startX;
      this.position.set(options.startX, options.y);
      this.createHoldbacks(options.resource);
    }

    // 创建管道们
    createHoldbacks(resource) {
      for (let count = 0; count < this.numHoses; count++) {
        // 下管道
        let frame = new PIXI.Rectangle(9, 0, this.hoseWidth, this.hoseHeight);
        const downHoseTexture = new PIXI.Texture(resource.texture, frame);
        const downHose = new PIXI.Sprite(downHoseTexture);

        // 上管道
        frame = new PIXI.Rectangle(159, 19, this.hoseWidth, this.hoseHeight);
        const upHoseTexture = new PIXI.Texture(resource.texture, frame);
        const upHose = new PIXI.Sprite(upHoseTexture);

        this.placeHoses(downHose, upHose, count);

        this.addChild(downHose, upHose);
      }
    }

    // 按索引计算一组管道XY
    placeHoses(downHose, upHose, index) {
      // 下管道最小Y值
      const downMinY = this.groundY - this.hoseHeight + this.hoseSpacingY;
      // 下管道最大Y值
      const downMaxY = this.groundY - 100;
      downHose.y = downMinY + (downMaxY - downMinY) * Math.random();
      // 下管道X值
      downHose.x = (this.hoseWidth + this.hoseSpacingX) * index;
      // 上管道Y值
      upHose.y = -this.hoseHeight + downHose.y - this.hoseSpacingY;
      // 上管道X值
      upHose.x = downHose.x;
    }

    // 移动管道们
    startMove() {
      // 目标X值：numOffScreenNum个管道移出
      const targetX =
        -1 * (this.hoseWidth + this.hoseSpacingX) * this.numOffScreenNum;
      this.moveTween = gsap.to(this, {
        x: targetX,
        duration: (this.x - targetX) / 240,
        ease: Linear.easeNone,
        onComplete: this.resetHose.bind(this),
      });
    }

    // 停止移动管道
    stopMove() {
      this.moveTween?.kill();
    }

    // 重设管道
    resetHose() {
      // 回收移出管道
      for (let count = 0; count < this.numOffScreenNum; count++) {
        const downHose = this.removeChildAt(0);
        const upHose = this.removeChildAt(0);
        // 计算回收管道XY
        this.placeHoses(downHose, upHose, this.numOffScreenNum + count);
        this.addChild(downHose, upHose);
      }
      // 容器位置
      this.x = 0;
      this.throughHoseNum = 0;
      // 计算屏幕管道X
      for (let count = 0; count < this.numOffScreenNum; count++) {
        const downHose = this.children[count * 2];
        const upHose = this.children[count * 2 + 1];
        downHose.x = (this.hoseWidth + this.hoseSpacingX) * count;
        upHose.x = downHose.x;
      }
      // 开始下轮移动
      this.startMove();
    }

    // 计算通过管子数
    calThroughHoseNum(score) {
      const num = this.throughHoseNum + 1;
      const targetX = num * this.hoseWidth + (num - 1) * this.hoseSpacingX;
      if (-targetX > this.x) {
        this.throughHoseNum += 1;
        score += 1;
      }
      return score;
    }

    // 检测碰撞
    checkCollision(bird) {
      const birdBound = bird.getBounds();
      return this.children.some((hose) =>
        hose.getBounds().intersects(birdBound)
      );
    }

    // 重置
    reset() {
      this.x = this.startX;
      this.throughHoseNum = 0;
      this.stopMove();
    }
  };
})(window.game);
