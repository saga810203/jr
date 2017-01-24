;

function($) {
	'use strict';
	var FORM_ITEM_CSS = ".form-item",
		FORM_ITEM_VALUE_CSS = ".form-item-val",
		FORM_ITEM_VALUE_CACHE_KEY = "form_item_value",
		READONLY_CSS = "readOnly",
		SHOWONLY_CSS = "showOnly",
		TRIMED_CSS = "trimed",

		EMPTY_STR = "",
		FORM_ITEM_DATA_TYPE_STRING = 0,
		FORM_ITEM_DATA_TYPE_INT = 1,
		FORM_ITEM_DATA_TYPE_FLOAT = 2,
		FORM_ITEM_DATA_TYPE_BOOL = 3,
		FORM_TIME_DATA_TYPE_OBJ = 4,
		FROM_ITEM_DATA_TYPE_ARRAY_STRING = 5,
		//FROM_ITEM_DATA_TYPE_ARRAY_INT  = 6,
		//FROM_ITEM_DATA_TYPE_ARRAY_FLOAT  = 7,
		//FROM_ITEM_DATA_TYPE_ARRAY_BOOL  = 8,	    
		FORM_TIME_DATA_TYPE_ARRAY_OBJ = 9,

		returnTrue: function() {
			return true;
		},
		returnFalse: function() {
			return false;
		},
		noop: function() {};

	var Util = {};

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

	Util.loadScript = function(url) {};

	var _dictCache = {};
	var _dictHandleCache = {};
	var _dictGuid = 1;
	var handerArray = "handlers";
	var Dict = {};
	Dict.baseUri = "";
	Dict.apply = function(dictCode, handler, dynamic) {
			if(dynamic) {
				var pt = Math.random().replace(/\D/g, "") + (++_dictGuid);
				_dictHandleCache[pt] = [handler];
				Util.loadScript(dictCode+"?dictFlag="+pt);
			} else {
				var dict = _dictCache[dictCode];
				if(!dict) {
					var hs = _dictHandleCache[dictCode];
					if(!hs){
						_dictHandleCache[dictCode]=hs=[];
					}
					hs.push(handler);					
					Util.loadScript(Dict.baseUri + dictCode + ".js");
				}else{
					handler(dict);
				}
			}
		}
	Dict.ref
		/*
		 * content:[{code:"12345",caption:"",shortCode:"",enabled:true,children:[{code:"",catpion:"",enabled:true,children:[]]}},....]
		 * 
		 */
	Dict.define = function(dictCode, content,dynamic) {
		if(dynamic){
			for(var i=0 ; i < length)
			
			
		}
		
		var dict = _dictCache[dictCode];
		if(!dict) {
			_dictCache[dictCode] = dict = content;
			dict.loaded = true;
		} else {
			if(dict.loaded) {
				if(force) {
					_dictCache[dictCode] = dict = content;
					dict.loaded = true;
				}
			} else {
				var hs = dict[handerArray];
				_dictCache[dictCode] = dict = content;
				dict.loaded = true;
				if(hs) {
					for(var i = 0; i < hs.length; ++i) {
						hs[i](dict);
					}
					delete dict[handerArray];
				}
			}
		}
	}
	Dict.get = function(dict, code) {
		for(var i = 0; i < dict.length; ++i) {
			var item = dict[i];
			if(code === item.code) {
				return item.caption;
			} else if(item.children && item.children.length) {

			}
		}
	}

	/*
	 * 
	 * 
	 */

	var jinit = function(itemEle, formItemObj) {
			itemEle.data(FORM_ITEM_VALUE_CACHE_KEY, formItemObj);
			var tmp;
			formItemObj.name = itemEle.attr("name") || itemEle.attr("id");
			if(!formItemObj.name) {
				throw "Attribute[name] is invalid";
			}
			formItemObj.readOnly = itemEle.hasClass(READONLY_CSS);
			formItemObj.showOnly = itemEle.hasClass(SHOWONLY_CSS);
			try {
				tmp = itemEle.attr("data");
				formItemObj.dataType = parseInt(tmp);
				if(isNan(formItemObj.dataType)) formItemObj.dataType = 0;
			} catch {
				formItemObj.dataType = 0;
			}
			formItemObj.ele = itemEle;

		},
		Jhidden = function(ele) {
			jinit(ele, this);
		};
	Jhidden.build = function(ele) {
		return ele.hasClass("hidden") ? new Jhidden(ele) : false;
	}
	$.extend(Jhidden.prototype, {
		setValue: function(val) {
			this.value = val;
		},
		getValue: function() {
			return this.value;
		},
		render: noop,
		validate(): returnTrue,

	});
	var Jtext = function(ele) {
		jinit(ele, this);
		this.trimed = this.dataType === FORM_ITEM_DATA_TYPE_INT || this.dataType === FORM_ITEM_DATA_TYPE_FLOAT || this.hasClass("trimed");
		var dv = ele.attr("defaultVal");
		this.defVal = dv || EMPTY_STR;
	};
	Jtext.build(ele) {
		return ele.hasClass("text") ? new Jtext(ele) : false;
	}
	$.extend(Jtext.prototype, {
		render: function() {
			if(this.showOnly) {
				this.ele.html(this.dv);
			} else {
				this.valEle = $("<input type='text'/>");
				var tmp = this.ele.attr("placeholder");
				if(tmp) this.valEle.attr("placeholder", tmp);
				this.valEle.appendTo(this.ele);
			}
		},
		setValue: function(val) {
			if(this.showOnly) {
				this.ele.html(val);
			} else {
				if(val) {
					this.valEle.val(val);
				} else {
					this.valEle.val(EMPTY_STR);
				}
			}
		},
		getValue: function() {
			if(this.showOnly) {
				return this.ele.html();
			} else {
				var vtext = this.valEle.val();
				if(this.trimed && vtext) vtext = $.trim(vtext);
				if(vtext) {
					//support data type : String ,int,float
					if(this.dataType === FORM_ITEM_DATA_TYPE_STRING) {
						return vtext;
					} else if(this.dataType === FORM_ITEM_DATA_TYPE_INT) {
						return parseInt(vtext);
					} else if(this.dataType === FORM_ITEM_DATA_TYPE_FLOAT) {
						return parseFloat(vtext);
					}
				} else {
					if(this.dataType === FORM_ITEM_DATA_TYPE_STRING) {
						return EMPTY_STR;
					}
				}
			}
		},
		validate: function() {
			var vtext = this.valEle.val();
			if(this.trimed && vtext) vtext = $.trim(vtext);
			if(this.ele.attr("required")) {
				if(!vtext) return "required";
			}
		}
	});

	var Jselect = function(ele) {
		jinit(ele, this);
		var dv = ele.attr("defaultVal");
		this.defVal = dv || EMPTY_STR;
		this.dictCode = ele.attr("dictCode");
	}
	Jselect.build = function(ele) {
		return ele.hasClass("select") ? new Jselect(ele) : false;
	}
	$.extend(Jselect.prototype, {
		render: function() {
			this.codeEle = $("<input type='hidden'>");
			this.captionEle = $("<div class='select-caption'></div>");
			if(this.showOnly) {
				if(this.defVal) {
					Dict.apply(this.dictCode, (function(that) {
						return function(dict) {

						};
					})(this));
				}
			} else {
				this.valEle = $("<input type='text'/>");
				var tmp = ctn.attr("placeholder");
				if(tmp) this.valEle.attr("placeholder", tmp);
				this.valEle.appendTo(this.ele);
			}
		},
	});

}(jQuery);