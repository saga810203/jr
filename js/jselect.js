;
jr.define(["jQuery", "dict"], function($, dict) {
	var DROP_DOWN_CONTAINER_CSS = ".dd-ctn",
		DROP_DOWN_BACKGROUP_CSS = ".dd-bg",

		Jselect = function(ele) {
			this.name = ele.attr("name") || ele.attr("id");
			if(!this.name) {
				throw "Attribute[name] is invalid";
			}
			this.readOnly = ele.hasClass(READONLY_CSS);
			this.showOnly = ele.hasClass(SHOWONLY_CSS);
			this.dictCode = ele.attr("dictCode");
			this.ele = ele;
			this.dv = ele.attr("defaultValue") || "";
			this.isBool = ele.attr("bool");
		},		
		changeDisplay = function(select, code, caption) {
			select.codeEle.val(code ? code : "");
			select.captionEle.html(code ? caption : "");
		},changeValue=function(select,code){
			dict.apply(select.dictCode,function(dc){
				var cap = dict.get(select.dictCode,code);
				changeDisplay(select,cap?code:null,cap);
			})
			
		};

	$.extend(Jselect.prototype, {
		render: function() {
			if(!this.ele.hasClass(DROP_DOWN_CONTAINER_CSS)) this.ele.addClass(DROP_DOWN_CONTAINER_CSS);
			this.codeEle = $("<input type='hidden'>");
			this.captionEle = $("<a class='select-caption' href='javascript:void(0)'></a>");
			this.ele.append(this.codeEle).append(this.captionEle);
			if(this.dv) {
				changeValue(this,this.dv)
			} 
			if((!this.readOnly) && (!this.showOnly)) {
				this.selectItemEle = $("<div class='select-drop'><div class='select-loading'></div></div>");
				this.selectItemEle.appendTo(this.ele);
				dict.apply(this.dictCode, (function(that) {
					return function(dd) {
						that.seelctItemEle.empty();
						if(that.dropItem) {
							that.dropItem.call(that, dd);
						} else {
							dict.buildSelectDrop.call(that, dd);
						}
					}
				})(this));
			}
		},
		val: function(val) {
			if(arguments.length){
				changeValue(this,this.isBool?(val?"1":"0"):(val?val:""));
			}else{
				
			}
			
			
				
			if(this.isBool){
				
				
				
				
			}else{
				
				
				
			}
			
			if(val) {
				if(this.showOnly) {
					this.ele.html(val);
				} else {
					dict.apply(this.dictCode, (function(that, pv) {
						return function(dict) {
							var caption = dict.get(that.dictCode, pv);
							changeValue(that, caption ? pv : null, caption);
						};
					})(this, val));
				}
				return this;
			} else if("null" == $.type(val) || "string" == $.type(val)) {
				if(this.showOnly) {
					this.ele.html("");
				} else {
					this.valEle.val("");
				}
				return this;
			}
			else if(!this.showOnly) {
				var vtext = this.valEle.val();
				if(this.trimed && vtext) vtext = $.trim(vtext);
				return vtext;
			}
		},
		reset: function() {
			if(this.showOnly) {
				this.ele.html(this.dv);
			} else {
				this.valEle.val(dv);
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
	return {
		build: function(ele) {
			return ele.hasClass("select") ? new Jselect(ele) : false;
		},
	};
});