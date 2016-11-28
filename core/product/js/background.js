/**
 * Created by zeev on 2016/4/2 0002.
 */

!(function(window) {
    var M = Math,
        U = M.PI * 2,
        MC = M.cos,
        MS = M.sin,
        random = M.random,
        winWidth,
        winHeight;

    var Particle = window.Particle = function(config) {
        this.increas = 0; //-- 递增值
        this.globalAlpha = 0.5; //-- 透明度，影响效果叠加
        this.amplitude = 1.5; //-- 增幅
        this.wave = 100; //-- 波动，影响生成第三个点到两个点的距离
        this.canvas = null;
        this.resizeId = null; //-- window resize时
        /**
         * get 开头，可固定值，可随机函数
         */
        this.getSideLength = function() {
            return M.floor(random() * 10) + 3;
        };
        this.getInitialAngle = function() {
            return random() * U;
        };
        this.getRadius = function() {
            return random() * 50
        };

        /**
         * prototype 函数绑定 Particle
         */
        (function bindThis(fn, target, argThis) {
            Object.keys(fn).forEach(function(key) {
                target[key] = fn[key].bind(argThis);
                if (Object.keys(fn[key]).length > 0) {
                    bindThis(fn[key], target[key], argThis);
                }
            });
        })(Particle.prototype, this, this);
        this.init(config)
    }

    Particle.prototype = {
        init: function(config) {
            if (!config.canvas) {
                throw new Error("canvas required !")
            }
            this.setConfig(config);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', this.resize, false);
            return this;
        }
    }

    Particle.prototype.setConfig = function(config) {
        var _this = this;

        for (var key in config) {
            if (/^get/i.test(key) && typeof config[key] !== "function") {
                /**
                 *  把get方法赋值到对应的属性
                 */
                // Object.defineProperty(this, "sideLength", {
                //     get: function() {
                //         return _this.getSideLength();
                //     },
                //     configurable: true
                // })
                _this[key] = (function() {
                    var _value = config[key];
                    return function() {
                        return _value;
                    }
                })();
            } else {
                if (key == "drawType") {
                    if (typeof config["drawType"] == "string") {
                        var _drawType = [];
                        _drawType.push(config["drawType"]);
                        config["drawType"] = _drawType;
                    }

                    config["drawType"] = config["drawType"].map(function(type) {
                        return "draw" + type.substring(0, 1).toUpperCase() + type.substring(1);
                    })
                }
                _this[key] = config[key];
            }
        }
        return _this;
    }

    /**
     * resize 之后会调用 reset 重新生成
     */
    Particle.prototype.resize = function() {
        var _this = this;
        if (_this.resizeId) {
            clearTimeout(_this.resizeId);
        }
        _this.resizeId = setTimeout(function() {
            _this.canvas.width = winWidth = document.body.offsetWidth;;
            _this.canvas.height = winHeight = document.body.offsetHeight;;
            _this.ctx.globalAlpha = _this.globalAlpha;
            _this.reset();
        }, 100);
    }


    /**
     * 重新绘制
     */
    Particle.prototype.reset = function() {
        this.ctx.clearRect(0, 0, winWidth, winHeight);
        /**
         * 两个起点坐标 默认0.7开始
         * wave 修正波动起点
         */
        this.point = [
            { x: 0, y: winHeight * .7 + this.wave },
            { x: 0, y: winHeight * .7 - this.wave }
        ];
        while (this.point[1].x < winWidth + this.wave)
            this.draw(this.point[0], this.point[1])
    }

    Particle.prototype.draw = function(_1, _2) {
        /**
         * 第三个点
         */
        var _3 = {},
            _this = this;
        _3.x = _2.x + (random() * this.amplitude - 0.25) * this.wave;
        _3.y = this.getNext(_2.y);
        var color = this.getFillColor();

        this.drawType.forEach(function(key) {
            _this["" + key].apply(_this, [_1, _2, _3, color])
        })

        this.point[0] = this.point[1];
        this.point[1] = _3;
    }

    /**
     * 获取下一个点
     * @param target  点的y轴
     */
    Particle.prototype.getNext = function(target) {
        var next = target + (random() * 2 - 1.1) * this.wave;
        return (next > winHeight || next < 0) ? this.getNext(target) : next
    }

    /**
     *    获取填充颜色
     */
    Particle.prototype.getFillColor = function() {
        this.increas -= U / -50;
        return '#' + (MC(this.increas) * 127 + 128 << 16 | MC(this.increas + U / 3) * 127 + 128 << 8 | MC(this.increas + U / 3 * 2) * 127 + 128).toString(16);
    }

    /**
     * 绘制线条 构成一个三角形
     */
    Particle.prototype.drawLine = function(_1, _2, _3, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(_1.x, _1.y);
        this.ctx.lineTo(_2.x, _2.y);
        this.ctx.lineTo(_3.x, _3.y);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    /**
     * 绘制圆形
     */
    Particle.prototype.drawCircle = function(_1, _2, _3, color) {
        this.ctx.beginPath();
        /* 圆心 */
        var _r = {};
        _r.x = (_1.x + _2.x + _3.x) / 3 + (random() * this.amplitude - 0.25) * this.wave;
        _r.y = (_1.y + _2.y + _3.y) / 3 + (random() * this.amplitude - 0.25) * this.wave;
        this.ctx.arc(_r.x, _r.y, random() * random() * 50 / this.amplitude, 0, U, false);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }


    /**
     * 绘制多边形
     */
    Particle.prototype.drawPolygon = function(_1, _2, _3, color) {
        this.ctx.beginPath();
        /* 圆心 */
        var _r = {};
        _r.x = (_1.x + _2.x + _3.x) / 3 + (random() * this.amplitude - 0.25) * this.wave;
        _r.y = (_1.y + _2.y + _3.y) / 3 + (random() * this.amplitude - 0.25) * this.wave;

        var sideLength = this.getSideLength(); //-- 边数
        var initialAngle = this.getInitialAngle(); //-- 角度
        var radius = this.getRadius() / this.amplitude; //-- 半径

        var angle = U / sideLength;
        var x = radius * MC(initialAngle) + _r.x;
        var y = radius * MS(initialAngle) + _r.y;
        this.ctx.moveTo(x, y);
        for (var i = 1; i < sideLength; i++) {
            x = radius * MC(initialAngle + i * angle) + _r.x;
            y = radius * MS(initialAngle + i * angle) + _r.y;
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
})(window);
