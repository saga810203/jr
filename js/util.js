jr.define(["jQuery", "base"], function($, base) {
	var doc = document,
		head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement,
		baseElement = head.getElementsByTagName("base")[0],
		Util = {};

	/*
	 * parent is body z-index = 9999999
	 */
	/* 
	 *弹出错误信息，会自动消失
	 * cnt String or jquery obj
	 * 
	 * msg container is div
	 *  $(msg container).text(String)  or $(msg container).append(jquery obj); 
	 */
	Util.error = function(cnt) {};
	//弹出警告信息，会自动消失  ref  Util.error
	Util.warn = function(cnt) {};
	//弹出提示信息，会自动消失 ref  Util.error
	Util.msg = function(cnt) {};

	//弹出加载信息遮罩    parent  is  body     z-index =  9999998; 
	Util.showLoading = function() {};
	//隐藏加载信息遮罩    parent  is  body     z-index =  9999998; 
	Util.hideLoading = function() {};
	/*
	 * 弹出提示信息，不会自动消失    parent is body z - index 5000000 - 9999997
	 */
	Util.alertMsg = function(cnt) {};
	/*
	 *弹出确认信息，不会自动消失    parent is body z - index 1000000 - 4999999 
	 * btns is Array 
	 * btns like [{catpion:"button caption",handler:function(){}},...]
	 */
	Util.boxMsg = function(cnt, btns) {};

	/*
	 *弹出确认信息，不会自动消失    parent is body z - index 1000000 - 4999999 
	 * == Util.boxMsg(cnt,[{caption:"确定"，handler:yesHandler},{caption:"取消",handler:noHandler}]);
	 */
	Util.confirmMsg = function(cnt, yesHandler, noHandler) {};

	Util.loadScript = function(url) {
		var node = doc.createElement("script");
		node.async = true;
		node.src = url;
		node.charset = "UTF-8";
		var supportOnload = "onload" in node;
		if(supportOnload) {
			node.onload = onload;
			node.onerror = onerror;
		} else {
			node.onreadystatechange = onreadystatechange;
		}
		// For some cache cases in IE 6-8, the script executes IMMEDIATELY after
		// the end of the insert execution, so use `currentlyAddingScript` to
		// hold current node, for deriving url in `define` call
		currentlyAddingScript = node;
		baseElement ?
			head.insertBefore(node, baseElement) :
			head.appendChild(node);
		currentlyAddingScript = null;

	};

	return Util;
});