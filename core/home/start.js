(function() {

    var _requestAnimationFrame = (function() {
        return function(callback) {
            window.setTimeout(callback, 1000 / 25);
        };
    })();

    var M = Math,
        U = M.PI * 2,
        MC = M.cos,
        MS = M.sin,
        random = M.random,
        winWidth,
        winHeight;

    var Start = window.Start = function() {
        this.canvas = null;
        this._canvas = document.createElement("canvas");
        this._ctx = this._canvas.getContext("2d");
        this.globalAlpha = 1;
        (function bindThis(fn, target, argThis) {
            Object.keys(fn).forEach(function(key) {
                target[key] = fn[key].bind(argThis);
                if (Object.keys(fn[key]).length > 0) {
                    bindThis(fn[key], target[key], argThis);
                }
            });
        })(Start.prototype, this, this);
    }

    Start.prototype = {
        init: function(config) {
            if (!config.canvas) {
                throw new Error("canvas required !")
            }
            this.setConfig(config);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.particles = [];
            window.addEventListener('resize', this.resize, false);
            _requestAnimationFrame(this.animate.bind(this));
            return this;
        }
    }

    /**
     * 控制粒子运动的方式
     */
    var controller = {
        way: 0
    }

    Start.prototype.updateController = function(config) {
        var _this = this;
        for (var key in config) {
            controller[key] = config[key];
        }
    }


    Start.prototype.setConfig = function(config) {
        var _this = this;
        for (var key in config) {
            _this[key] = config[key];
        }
        return _this;
    }

    /**
     * resize 之后会调用 reset 重新生成
     */
    Start.prototype.resize = function() {
        var _this = this;
        if (_this.resizeId) {
            clearTimeout(_this.resizeId);
        }
        _this.resizeId = setTimeout(function() {
            _this.canvas.width = winWidth = document.body.offsetWidth;
            _this.canvas.height = winHeight = document.body.offsetHeight;
            _this.ctx.globalAlpha = _this.globalAlpha;
            _this._canvas.width = winWidth = document.body.offsetWidth;
            _this._canvas.height = winHeight = document.body.offsetHeight;
            _this.reset();
        }, 100);
    }

    /**
     * 重新绘制
     */
    Start.prototype.reset = function() {
        this.particles = [];
        this.createParticle();
        /**
         * 两个起点坐标 默认0.7开始
         * wave 修正波动起点
         */
    }

    Start.prototype.animate = function() {
        this._ctx.clearRect(0, 0, winWidth, winHeight);
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].nextFps();
            this.particles[i].draw(this._ctx);
        }
        this.ctx.clearRect(0, 0, winWidth, winHeight);
        this.ctx.drawImage(this._canvas, 0, 0);
        _requestAnimationFrame(Start.prototype.animate.bind(this));
    }

    Start.prototype.createParticle = function() {
        var p = [],
            _this = this;
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 5; j++) {
                p = _this.createPoints(i, j, 6);
                for (var k = 0; k < p.length; k++) {
                    if (p[k].x != 0 && p[k].y != 0) {
                        _this.particles.push(new particle(p[k]))
                    }

                }
            }
        }
    }

    /**
     *   随机生成n个点，坐标系为中心点
     *   第四象限为 正
     */
    Start.prototype.createPoints = function(i, j, n) {
        var x1 = -0.5 * winWidth + i * 0.1 * winWidth,
            y1 = -0.5 * winHeight + j * 0.2 * winHeight,
            x2 = -0.5 * winWidth + (i + 1) * 0.1 * winWidth,
            y2 = -0.5 * winHeight + (j + 1) * 0.2 * winHeight;
        var p = [];
        for (var i = 0; i < n; i++) {
            p.push({ x: x1 + random() * (x2 - x1), y: y1 + random() * (y2 - y1) })
        }
        return p;
    }


    function particle(point) {
        this.point = point || { x: 0, y: 0 };
        this.rad = random();
        if (random() > .9)
            this.rad = 2;
        this.speed = random() * 1 + .1;
        this.opc = random() / 2 + .3;
        this.R = M.sqrt(this.point.x * this.point.x + this.point.y * this.point.y);
    }

    particle.prototype.nextFps = function() {
        if (controller.way == 0) {
            this.retate.call(this)
        } else if (controller.way == 1) {
            this.emanate.call(this)
        } else if (controller.way == 2) {
            //3d散发

        }
    }

    /**
     * 旋转
     */
    particle.prototype._retate = function() {
        var speed = (this.R - M.abs(this.point.x)) / this.R * (this.speed + 1 + M.random() * 3);
        speed = speed <= .05 ? .05 : speed;
        speed = speed >= 1 ? 1 : speed;
        if (this.point.y > 0) {
            if (this.point.x + speed <= this.R) {
                this.point.x += speed;
                this.point.y = M.sqrt(this.R * this.R - this.point.x * this.point.x)
            } else {
                this.point.x = this.R;
                this.point.y = 0;
            }
        } else {
            if (this.point.x - speed >= this.R * -1) {
                this.point.x -= speed;
                this.point.y = M.sqrt(this.R * this.R - this.point.x * this.point.x) * -1;
            } else {
                this.point.y *= -1;
            }
        }
    }

    /**
     * 旋转
     */
    particle.prototype.retate = function() {
        var speed = this.speed;
        var deg = this.speed / this.R;
        this.point.x += this.R * MS(deg);
        this.point.y += this.R - this.R * MC(deg);
        // var _s = this.R * this.R - speed * speed / 2
        // if (this.point.y > 0) {
        //     if (this.point.x + speed <= this.R) {
        //         this.point.x += speed;
        //         this.point.y = M.sqrt(this.R * this.R - this.point.x * this.point.x)
        //     } else {
        //         this.point.x = this.R;
        //         this.point.y = 0;
        //     }
        // } else {
        //     if (this.point.x - speed >= this.R * -1) {
        //         this.point.x -= speed;
        //         this.point.y = M.sqrt(this.R * this.R - this.point.x * this.point.x) * -1;
        //     } else {
        //         this.point.y *= -1;
        //     }
        // }

    }

    /**
     * 散发
     */
    particle.prototype.emanate = function() {
        this.point.x = (M.abs(this.point.x) + this.speed * (M.abs(this.point.x) / (M.abs(this.point.x) + M.abs(this.point.y)))) * (this.point.x / M.abs(this.point.x));
        this.point.y = (M.abs(this.point.y) + this.speed * (M.abs(this.point.y) / (M.abs(this.point.x) + M.abs(this.point.y)))) * (this.point.y / M.abs(this.point.y));
        if (this.point.x < winWidth * -.5 || this.point.x > winWidth * .5 || this.point.y < winHeight * -.5 || this.point.y > winHeight * .5) {
            var m = M.min(M.abs(this.point.x), M.abs(this.point.y)) / 40;
            this.point.x /= m;
            this.point.y /= m;
        }
    }

    particle.prototype.draw = function(context) {
        context.save();
        context.globalAlpha = this.opc;
        context.translate(winWidth / 2, winHeight / 2);
        context.fillStyle = "#fff";
        context.beginPath();
        context.arc(this.point.x, this.point.y, this.rad, 0, U * 2);
        context.fill();
        context.restore();
    }

})();
