;(function () {

	var _requestAnimationFrame = (function () {
		return function (callback) {
			window.setTimeout(callback, 1000 / 25);
		};
	})();

	var M      = Math,
		U      = M.PI * 2,
		MC     = M.cos,
		MS     = M.sin,
		random = M.random,
		winWidth,
		winHeight;

	var Start = window.Start = function (config) {
		this.canvas      = null;
		this._canvas     = document.createElement("canvas");
		this._ctx        = this._canvas.getContext("2d");
		this.globalAlpha = 1;
		(function bindThis(fn, target, argThis) {
			Object.keys(fn).forEach(function (key) {
				target[key] = fn[key].bind(argThis);
				if (Object.keys(fn[key]).length > 0) {
					bindThis(fn[key], target[key], argThis);
				}
			});
		})(Start.prototype, this, this);
		this.init(config);
	}

	Start.prototype = {
		init: function (config) {
			if (!config.canvas) {
				throw new Error("canvas is required !")
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
		type: 0
	}

	Start.prototype.updateController = function (config) {
		var _this = this;
		for (var key in config) {
			controller[key] = config[key];
		}
	}


	Start.prototype.setConfig = function (config) {
		var _this = this;
		for (var key in config) {
			_this[key] = config[key];
		}
		return _this;
	}

	/**
	 * resize 之后会调用 reset 重新生成
	 */
	Start.prototype.resize = function () {
		var _this = this;
		if (_this.resizeId) {
			clearTimeout(_this.resizeId);
		}
		_this.resizeId = setTimeout(function () {
			_this.canvas.width = winWidth = document.body.offsetWidth;
			_this.canvas.height = winHeight = document.body.offsetHeight;
			_this.ctx.globalAlpha = _this.globalAlpha;
			_this._canvas.width   = winWidth = document.body.offsetWidth;
			_this._canvas.height = winHeight = document.body.offsetHeight;
			_this.reset();
		}, 100);
	}

	/**
	 * 重新绘制
	 */
	Start.prototype.reset = function () {
		this.particles = [];
		this.createParticle();
		/**
		 * 两个起点坐标 默认0.7开始
		 * wave 修正波动起点
		 */
	}

	Start.prototype.animate = function () {
		this._ctx.clearRect(0, 0, winWidth, winHeight);
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].nextFps();
			this.particles[i].draw(this._ctx);
		}
		this.ctx.clearRect(0, 0, winWidth, winHeight);
		this.ctx.drawImage(this._canvas, 0, 0);
		_requestAnimationFrame(Start.prototype.animate.bind(this));
	}

	Start.prototype.createParticle = function () {
		var p     = [],
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
	Start.prototype.createPoints = function (i, j, n) {
		var x1 = -0.5 * winWidth + i * 0.1 * winWidth,
			y1 = -0.5 * winHeight + j * 0.2 * winHeight,
			x2 = -0.5 * winWidth + (i + 1) * 0.1 * winWidth,
			y2 = -0.5 * winHeight + (j + 1) * 0.2 * winHeight;
		var p  = [];
		for (var i = 0; i < n; i++) {
			p.push({ x: x1 + random() * (x2 - x1), y: y1 + random() * (y2 - y1) })
		}
		return p;
	}


	function particle(point) {
		this.point = point || { x: 0, y: 0 };
		this.R     = M.sqrt(this.point.x * this.point.x + this.point.y * this.point.y);
		/* 圆点半径 */
		this.rad = 4 * this.R / winWidth + 0.5;
		/* 速度 */
		this.speed = random() * 1 + .1;
		/* 透明度 */
		this.opc = random() / 2 + .3;
		/* 起点弧度 */
		this.radian = M.atan(M.abs(this.point.x) / M.abs(this.point.y));
		/* 弧度修正 */
		if (this.point.y < 0 && this.point.x < 0) {
			this.radian += M.PI;
		} else if (this.point.x < 0) {
			this.radian += (M.PI / 2 - this.radian) * 2;
		} else if (this.point.y < 0) {
			this.radian = -this.radian;
		}
		/* 弧度增值 */
		this.radian_inc = M.PI * random() * random() * random() * 0.5 * 0.02 + .002;
	}

	particle.prototype.nextFps = function () {
		if (controller.type == 0) {
			this.retate.call(this)
		} else if (controller.type == 1) {
			this.emanate.call(this)
		}
	}


	/**
	 * 旋转
	 */
	particle.prototype.retate = function () {
		this.radian += this.radian_inc;
		this.point.x = this.R * MS(this.radian);
		this.point.y = this.R * MC(this.radian);
	}


	/**
	 * 散发
	 */
	particle.prototype.emanate = function () {
		this.point.x = (M.abs(this.point.x) + this.speed * (M.abs(this.point.x) / (M.abs(this.point.x) + M.abs(this.point.y)))) * (this.point.x / M.abs(this.point.x));
		this.point.y = (M.abs(this.point.y) + this.speed * (M.abs(this.point.y) / (M.abs(this.point.x) + M.abs(this.point.y)))) * (this.point.y / M.abs(this.point.y));
		if (this.point.x < winWidth * -.5 || this.point.x > winWidth * .5 || this.point.y < winHeight * -.5 || this.point.y > winHeight * .5) {
			var p        = Start.prototype.createPoints(this.point.x > winWidth * .5 ? 6 : 5, 3, 1);
			this.point.x = p[0].x * (this.point.x / M.abs(this.point.x));
			this.point.y = this.point.x / M.tan(this.radian);
		}
		this.R   = M.sqrt(this.point.x * this.point.x + this.point.y * this.point.y);
		this.rad = 4 * this.R / winWidth + 0.5;
	}

	particle.prototype.draw = function (context) {
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
