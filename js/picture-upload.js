;
(function($, attr, cw, ch, lr, tb) {
	setTimeout(function() {
			var dataImg = $("#dataImg"),
				imgObj = $("#imgObj"),
				chooseObj = $("#chooseObj"),
				touchObj = $("#touchObj");

			var lrPx = cw * lr / 100,
				tbPx = ch * tb / 100;
			var comStyle = "width:" + cw + "px;height:" + ch + "px;";
			var choStyle = comStyle + " border-width:" + tbPx + "px " + lrPx + "px " + tbPx + "px " + lrPx + "px;";

			var tid, tx, ty, ol = 0,
				ot = 0
				touchId = 0;

			var touch = function(e) {
				var event = e || window.event;
				event.preventDefault();
				if(event.touches.length == 1) { //单指操作
					if(event.type == "touchstart") { //开始移动
						touchId = event.targetTouches[0].identifier;
						tx = event.targetTouches[0].clientX;
						ty = event.targetTouches[0].clientY;
						ol = parseInt(imgObj.style.left) || 0;
						ot = parseInt(imgObj.style.top) || 0;
					} else if(event.type == "touchmove") { //移动中
						var l = event.targetTouches[0].clientX - tx,
							t = event.targetTouches[0].clientY - ty;

						imgObj.style.left = "" + (ol+l)+ "px";
						imgObj.style.top = "" + (ot+t) + "px";
					}
				}
				if(event.type == "touchend") {
											ol = parseInt(imgObj.style.left) || 0;
						ot = parseInt(imgObj.style.top) || 0;
					
					if(ol > lrPx) {
						ol = lrPx;
					} else if(ol < (-lrPx)) {
						ol = -lrPx;
					}
					if(ot > tbPx) {
						ot = tbPx;
					} else if((ot + tbPx) < 0) {
						ot = -tbPx;
					}

					imgObj.style.left = "" + ol + "px";
					imgObj.style.top = "" + ot + "px";
					return;

				}

			};
			attr(imgObj, "style", comStyle);
			attr(touchObj, "style", comStyle);
			attr(chooseObj, "style", choStyle);

			touchObj.addEventListener('touchstart', touch, false);
			touchObj.addEventListener('touchmove', touch, false);
			touchObj.addEventListener('touchend', touch, false);

		},
		1000);
}(function(flag) {
		return document.querySelector(flag);
	}, function(e, n, v) {
		e.setAttribute(n, v);
	}, window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
	window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight, 5, 25));