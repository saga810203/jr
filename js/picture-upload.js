;
(function($,attr,cw, ch,lr,tb) {
setTimeout(function(){
	var dataImg = $("#dataImg"),
		imgObj = $("#imgObj"),
		chooseObj = $("#chooseObj"),`
		touchObj = $("#touchObj");
		ch = ch -50;
		
		var lrPx = cw*lr/100,tbPx = ch*tb/100;
		var comStyle="width:"+cw+"px;height:"+ch+"px;";
		var choStyle = comStyle+" border-width:"+tbPx+"px "+lrPx+"px "+tbPx+"px "+lrPx+"px;";
		
		var tid,tx,ty;
		
		var touch=function(e){
			var event = e || window.event;
			event.preventDefault();
			if(event.type=="")
			
			//阻止浏览器或body 其他冒泡事件
			var mv_x1 = event.changedTouches[0].clientX,
				mv_y1 = event.changedTouches[0].clientY; //手指坐标
			var img_left = img_obj.left,
				img_top = img_obj.top; //图片坐标
			if(event.touches.length == 1) { //单指操作
				if(event.type == "touchstart") { //开始移动
					posX = mv_x1 - img_obj.offsetLeft; //获取img相对坐标
					//posd = mv_x1 - img_obj.offsetRight; //获取img相对坐标
					posY = mv_y1 - img_obj.offsetTop;
				} else if(event.type == "touchmove") { //移动中
					var _x = mv_x1 - posX; //移动坐标
					var _y = mv_y1 - posY;
					img_obj.style.left = _x + "px";
					img_obj.style.top = _y + "px";
					ctx_img.clearRect(0, 0, can_obj.width, can_obj.height); //清除画布
					console.log(Orientation);
					if(Orientation == 6) {
						ctx_img.drawImage(img_obj, _y - parseFloat(can_obj.style.top) + left_y - 120 / 2, -(_x + left_x / 2 + 32), img_obj.width * sqrt, img_obj.height * sqrt); //画布内图片移动		
					} else {
						ctx_img.drawImage(img_obj, _x + left_x / 2 - 25, _y - parseFloat(can_obj.style.top) + left_y / 2, img_obj.width * sqrt, img_obj.height * sqrt); //画布内图片移动
					}
				}
		};
		attr(imgObj,"style",comStyle);
		attr(touchObj,"style",comStyle);
		attr(chooseObj,"style",choStyle);
		
		touchObj.addEventListener('touchstart', touch, false);
		touchObj.addEventListener('touchmove', touch, false);
		touchObj.addEventListener('touchend', touch, false);

	
		
},1000);
}(function(flag) {
	return document.querySelector(flag);
},function(e,n,v){
	e.setAttribute(n,v);
}, window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,5,25));