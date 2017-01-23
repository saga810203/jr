;

function($) {
	'use strict';
	var FORM_ITEM_CSS = ".form-item",
		FORM_ITEM_VALUE_CSS = ".form-item-val",
		FORM_ITEM_VALUE_CACHE_KEY = "form_item_value",
		READONLY_CSS = "readOnly",
		SHOWONLY_CSS = "showOnly",
		TRIMED_CSS="trimed",

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
		
		
		noop:function(){};
		
		var Util={};
		
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
		Util.error=function(cnt){};
		//弹出警告信息，会自动消失  ref  Util.error
		Util.warn=function(cnt){};
		//弹出提示信息，会自动消失 ref  Util.error
		Util.msg=function(cnt){};
		
		//弹出加载信息遮罩    parent  is  body     z-index =  9999998; 
		Util.showLoading=function(){};
		//隐藏加载信息遮罩    parent  is  body     z-index =  9999998; 
		Util.hideLoading=function(){};
		/*
		 * 弹出提示信息，不会自动消失    parent is body z - index 5000000 - 9999997
		 */
		Util.alertMsg=function(cnt){};
		/*
		 *弹出确认信息，不会自动消失    parent is body z - index 1000000 - 4999999 
		 * btns is Array 
		 * btns like [{catpion:"button caption",handler:function(){}},...]
		 */
		Util.boxMsg=function(cnt,btns){};
		
		/*
		 *弹出确认信息，不会自动消失    parent is body z - index 1000000 - 4999999 
		 * == Util.boxMsg(cnt,[{caption:"确定"，handler:yesHandler},{caption:"取消",handler:noHandler}]);
		 */
		Util.confirmMsg=function(cnt,yesHandler,noHandler){};
		
		
		/*
		 * 
		 * 
		 */
		
		

		var jinit = function(itemEle, formItemObj) {
			itemEle.data(FORM_ITEM_VALUE_CACHE_KEY,formItemObj);	
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
			
			
		},
		Jhidden = function(ele) {
			jinit(ele, this);
		};
	Jhidden.bulid(ele) {
		return ele.hasClass("hidden") ? new Jhidden(ele) : false;
	}
	$.extend(Jhidden.prototype, {
		setValue: function(val) {
			this.value = val;
		},
		getValue:function() {
			return this.value;
		},
		render:noop,
		
	});
	var Jtext = function(ele) {
		jinit(ele, this);
		this.trimed =this.hasClass("trimed");		
	};
	$.extend(Jtext.prototype, {
		render:function(ctn){
			this.valEle = $("<input type='text'/>");
			var tmp = ctn.attr("placeholder");
			if(tmp) this.valEle.attr("placeholder",tmp);
		}
		
		setValue: function(val) {
			if(val){
				this.valEle.val(val);
			}else{
				this.valEle.val(EMPTY_STR);
			}
		},
		getValue() {
			var vtext = this.valEle
		}
	});

	

}(jQuery);