if(typeof jQuery === 'undefined') {
	throw new Error('this JavaScript requires jQuery')
} +

function($) {
	/*common css define 
	 * QF = query flag   
	 * CC = css class
	 */
	var
		CC_BRANCH_ITEM = "branch-item",
		QF_BRANCH_ITEM = ".branch-item > a",
		CC_TREE = "tree",
		QF_SELECT = ".select",
		CC_SELECT = "select",
		QF_HIDDEN = ".hidden",
		CC_HIDDEN = "hidden",
		QF_TEXT = ".text",
		CC_TEXT = "text",
		CC_FORM_ITEM = "form-item",
		QF_FORM_ITEM = ".form-item",
		CC_TRIM = "trim",
		CC_STRING = "string",
		CC_INT = "int",
		CC_BOOL = "bool",
		CC_FLOAT = "float",
		CC_SELECT_ITEM = "select-item",
		QF_SELECT_ITEM = ".select-item",
		CC_SELECT_CAPTION = "select-caption",
		QF_SELECT_CAPTION = ".select-caption",
		CC_READONLY = "readOnly",
		CC_SHOWONLY = "showOnly",
		QF_DROP_DOWN_CONTAINER = ".dd-ctn",
		CC_DROP_DOWN_CONTAINER = "dd-ctn",
		CC_DROP_DOWN_BACKGROUP = "dd-bg",
		QF_DROP_DOWN_BACKGROUP = ".dd-bg",
		CC_DROP_DOWN_HAND = "dd-hand",
		QF_DROP_DOWN_HAND = ".dd-hand",
		QF_OPEN = ".open",
		CC_OPEN = "open",
		CC_DISABLED = "disabled",
		QF_DISABLED = ".disabled :disabled";

	/*
	 * AK = attribate key
	 * DK = data key
	 * EN = element name
	 * TN = type name
	 * CK = const data key  
	 * 
	 */
	var
		AK_DEF_VAL = "defVal",
		AK_PLACEHOLDER = "placeholder",
		AK_ID = "id",
		AK_NAME = "name",
		AK_DICT_CODE = "dictCode",
		AK_CODE = "code",
		AK_READONLY = "readonly",
		AK_REQUIRED = "required",

		EN_HEAD, EN_BASE = "base",
		EN_SCRIPT = "script",
		EN_INPUT = "input",

		TN_STRING = CC_STRING,
		TN_NUMBER = "number",
		TN_ARRAY = "array",
		TN_OBJ = "object",
		TN_FNC = "function",
		TN_BOOL = "boolean",

		CK_TRUE = true,
		CK_FALSE = false,
		CK_UNDEF = undefined,

		DK_FORM_VALUE = "form_value";

	/**
	 * TK = template key
	 */
	var TK_TEXT_INPUT = "<input type='text' />",
		TK_HIDDEN_INPUT = "<input type='hidden' />";

	var doc = document,
		head = doc.head || doc.getElementsByTagName(EN_HEAD)[0] || doc.documentElement,
		baseElement = head.getElementsByTagName(EN_BASE)[0],
		noop = function() {},
		returnFalse = function() {
			return CK_FALSE
		},
		returnTrue = function() {
			return CK_TRUE
		},
		util = {

			// parent is body z-index = 9999999
			// *弹出错误信息，会自动消失
			//cnt String or jquery obj
			//msg container is div
			//$(msg container).text(String)  or $(msg container).append(jquery obj); 
			error: function(cnt) {},
			//弹出警告信息，会自动消失  ref  Util.error
			warn: function(cnt) {},
			//弹出提示信息，会自动消失 ref  Util.error
			msg: function(cnt) {},

			//弹出加载信息遮罩    parent  is  body     z-index =  9999998; 
			showLoading: function() {},
			//隐藏加载信息遮罩    parent  is  body     z-index =  9999998; 
			hideLoading: function() {},
			/*
			 * 弹出提示信息，不会自动消失    parent is body z - index 5000000 - 9999997
			 */
			alertMsg: function(cnt) {},
			/*
			 *弹出确认信息，不会自动消失    parent is body z - index 1000000 - 4999999 
			 * btns is Array 
			 * btns like [{catpion:"button caption",handler:function(){}},...]
			 */
			boxMsg: function(cnt, btns) {},

			/*
			 *弹出确认信息，不会自动消失    parent is body z - index 1000000 - 4999999 
			 * == Util.boxMsg(cnt,[{caption:"确定"，handler:yesHandler},{caption:"取消",handler:noHandler}]);
			 */
			confirmMsg: function(cnt, yesHandler, noHandler) {},

			loadScript: function(url) {
				var node = doc.createElement(EN_SCRIPT);
				node.async = CK_TRUE;
				node.src = url;
				node.charset = "UTF-8";
				var supportOnload = "onload" in node;
				if(supportOnload) {
					//todo:dddd
					node.onload = noop;
					//todo:dddd
					node.onerror = noop;
				} else {
					//todo:dddd
					node.onreadystatechange = noop;
				}
				baseElement ?
					head.insertBefore(node, baseElement) :
					head.appendChild(node);
			}
		},

		//begin dropdown
		//QF == query flag
		//CC == css class 

		dd_clearMenus = function(e) {
			if(e && e.which === 3) return
			$(QF_DROP_DOWN_BACKGROUP).remove()
			$(QF_DROP_DOWN_CONTAINER).each(function() {
				var $this = $(this)
				var relatedTarget = {
					relatedTarget: this
				}
				if(!$this.hasClass(CC_OPEN)) return
				$this.trigger(evt = $.Event('hide.jr.dropdown', relatedTarget))
				if(evt.isDefaultPrevented()) return
				$this.removeClass(CC_OPEN).trigger('hidden.jr.dropdown', relatedTarget)
			});
		},
		dd_toggle = function(e) {
			var $this = $(this);
			var $ddc = $this.parents(QF_DROP_DOWN_CONTAINER);
			if(!$ddc.length) return;
			if($ddc.is(QF_DISABLED)) return;
			var isActive = $ddc.hasClass(CC_OPEN);
			dd_clearMenus();
			if(!isActive) {
				var relatedTarget = {
					relatedTarget: this
				}
				$ddc.trigger(e = $.Event('show.jr.dropdown', relatedTarget))
				if(e.isDefaultPrevented()) return
				$ddc.toggleClass(CC_OPEN).trigger('shown.jr.dropdown', relatedTarget)
			}
			return CK_FALSE
		},

		//end dropdown

		//begin dict
		dict_dictCache = {},
		dict_dictHandleCache = {},
		dict_dictGuid = 1,
		dict_handerArray = "handlers",
		dict_baseUri = "/jr/js/ddict/",
		dict_apply = function(dictCode, handler, dynamic) {
			if(dynamic) {
				var pt = Math.random().replace(/\D/g, "") + (++dict_dictGuid);
				dict_dictHandleCache[pt] = [handler];
				util.loadScript(dictCode + "?dictFlag=" + pt);
			} else {
				var dict = dict_dictCache[dictCode];
				if(!dict) {
					var hs = dict_dictHandleCache[dictCode];
					if(!hs) {
						dict_dictHandleCache[dictCode] = hs = [];
						util.loadScript(dict_baseUri + dictCode + ".js");
					}
					hs.push(handler);
				} else {
					handler(dict);
				}
			}
		},
		dict_refresh = function(dictCode, handler) {
			if(handler) {
				var hs = dict_dictHandleCache[dictCode];
				if(!hs) {
					dict_dictHandlerCache[dictCode] = hs = [];
				}
				hs.push(handler);
			}
			var dict = dict_dictCache[dictCode];
			if(dict) {
				delete dict_dictCache[dictCode];
				util.loadScript(dict_baseUri + dictCode + ".js");
			}
		},
		/*
		 * content:[{code:"12345",caption:"",shortCode:"",enabled:true,children:[{code:"",catpion:"",enabled:true,children:[]]}},....]
		 * 
		 */
		dict_define = function(dictCode, content, dynamic) {
			if(!dynamic) {
				dict_dictCache[dictCode] = dict_dictCache[dictCode] || content;
			}
			var handlers = dict_dictHandleCache[dictCode];
			if(handlers && handlers.length) {
				for(var i = 0; i < handlers.length; ++i) {
					handlers[i](content);
				}
				delete dict_dictHandleCache[dictCode];
			}
		},
		dict_get = function(dict, code) {
			if(code) {
				for(var i = 0; i < dict.length; ++i) {
					var item = dict[i];
					if(code === item.code) {
						return item.caption;
					} else if(item.children && item.children.length) {
						var ret = dict_get(item.children, code);
						if(ret) return ret;
					}
				}
			}
			return CK_FALSE;
		},

		//end dict

		Jhidden = function(ele) {
			if($.type(ele) == CC_STRING) {
				this.name = ele;
			} else {
				this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
				if(!this.name) {
					throw "Attribute[name] is invalid";
				}
				ele.data(DK_FORM_VALUE, this);
			}
		},

		Jtext = function(ele) {
			this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
			if(!this.name) {
				throw "Attribute[name] is invalid";
			}
			this.trimed = ele.hasClass(CC_TRIM);
			this.readOnly = ele.hasClass(CC_READONLY);
			this.showOnly = ele.hasClass(CC_SHOWONLY);
			this.ele = ele;
			this.dv = ele.attr(AK_DEF_VAL) || "";
			this.dt = 0;
			if(ele.hasClass(CC_INT)) {
				this.dt = 1;
			} else if(ele.hasClass(CC_FLOAT)) {
				this.dt = 2;
			}
			ele.data(DK_FORM_VALUE, this);
		},

		Jselect = function(ele) {
			this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
			if(!this.name) {
				throw "Attribute[name] is invalid";
			}
			this.readOnly = ele.hasClass(CC_READONLY);
			this.showOnly = ele.hasClass(CC_SHOWONLY);
			this.dictCode = ele.attr(AK_DICT_CODE);
			this.ele = ele;
			this.dv = ele.attr(AK_DEF_VAL) || "";
			this.isBool = ele.hasClass(CC_BOOL);
			this.isTree = ele.hasClass(CC_TREE);
			ele.data(DK_FORM_VALUE, this);
		},
		select_display = function(select, code, caption) {
			select.codeEle.val(code ? code : "");
			select.captionEle.html(code ? caption : "");
		},
		select_change = function(select, code) {
			if(select.codeEle.val() !== code) {
				dict_apply(select.dictCode, function(dc) {
					var cap = code ? dict_get(dc, code) : "";
					select_display(select, cap ? code : null, cap);
				});
			}
		},
		Jmselect = function(ele) {
			this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
			if(!this.name) {
				throw "Attribute[name] is invalid";
			}
			this.readOnly = ele.hasClass(CC_READONLY);
			this.showOnly = ele.hasClass(CC_SHOWONLY);
			this.dictCode = ele.attr(AK_DICT_CODE);
			this.ele = ele;
			this.dv = [];
			var defV = ele.attr(AK_DEF_VAL);
			if(defV) {
				var strs = defV.split(",");
				for(var i = 0; i < strs.length; ++i) {
					var item = $.trim(strs[i]);
					if(item) this.dv.push(item);
				}
			}
			this.isTree = ele.hasClass(CC_TREE);
			ele.data(DK_FORM_VALUE, this);
		},
		mselect_add = function(mselect, code, init_add) {
			var found = false;
			if(!init_add) {
				mselect.captionEle.find(QF_SELECT_CAPTION).each(function() {
					if($(this).find(EN_INPUT).val() == code) {
						found = true;
						return false;
					}
				});
			}
			if(!found) {
				var $li = $("<li><div>x</div></li>");
				$li.addClass(CC_SELECT_CAPTION).append($(TK_HIDDEN_INPUT).val(code)).appendTo(mselect.captionEle);
				dict_apply(mselect.dictCode, function(dict) {
					var cp = dict_get(dict, code);
					if(cp) {
						$li.append($("<span></span>").html(cp));
					} else {
						$li.addClass("error-dict");
					}
				});
				return true;
			}
		},
		mselect_change = function(mselect, value) {
			mselect.captionEle.empty();
			if(value && value.length) {
				for(var i = 0; i < value.length; ++i) {
					var cv = value[i];
					if(cv) {
						mselect_add(mselect, cv, true);
					}
				}
			}
		},
		select_buildListDrop = function(dict) {
			var $ul = $("<ul></ul>");
			for(var i = 0; i < dict.length; ++i) {
				var item = dict[i];
				if(item.enabled) {
					var $li = $("<li class='select-item'></li>");
					$li.attr(AK_CODE, item.code);
					$li.html(item.caption);
					$li.appendTo($ul);
				}
			}
			return $ul;
		},
		select_buildTreeDrop = function(dict) {
			var $ul = $("<ul></ul>");
			for(var i = 0; i < dict.length; ++i) {
				var item = dict[i];
				if(item.enabled) {
					var $li = $("<li></li>");
					if(item.children && item.children.length) {
						var $ti = $("<a href='javascript:void(0)'></a>");
						$ti.attr(AK_CODE, item.code).html(item.caption);
						$li.addClass(CC_BRANCH_ITEM).append($ti).append(select_buildTreeDrop.call(this, item.children));
					} else {
						$li.addClass(CC_SELECT_ITEM).attr(AK_CODE, item.code).html(item.caption);
					}
					$li.appendTo($ul);
				}
			}
			return $ul;
		},
		select_selectItem = function(e) {
			var $this = $(this);
			var select = $this.parents(QF_FORM_ITEM);
			if(select && select.length) {
				select = $(select).data(DK_FORM_VALUE);
				if(select && select.selectItem) {
					select.selectItem($this, e);
				}
			}
		},
		select_branceItem = function(evt) {
			$(this).toggleClass(CC_OPEN);
			evt.stopPropagation();
		},
		FORM_ITEM_CREATER = [Jhidden, Jtext, Jselect, Jmselect],

		serialize = function(obj, name, val, r) {
			var ret = r || "";
			var tn = $.type(val);
			if(tn == TN_BOOL) {
				ret = ret + name + "=" + (val ? "1" : "0") + "&";
			} else if(tn == TN_NUMBER) {
				ret = ret + name + "=" + val + "&";
			} else if(tn == TN_STRING) {
				if(val)
					ret = ret + name + "=" + encodeURIComponent(val) + "&";
			} else if(tn == TN_FNC) {
				ret = serialize(obj, name, val.call(obj), ret)
			} else if(tn == TN_ARRAY) {
				for(var i = 0; i < val.length; ++i) {
					ret = serialize(obj, name, val[i], ret);
				}
			} else if(tn == TN_OBJ) {
				ret = ret + name + "=" + encodeURIComponent(JSON.stringify(val)) + "&";
			}
			return ret;
		},
		Jform = function(ele) {
			this.items = {};
			var that = this;
			ele.find(QF_FORM_ITEM).each(function() {
				var $this = $(this);
				for(var i = 0; i < FORM_ITEM_CREATER.length; ++i) {
					var item = FORM_ITEM_CREATER[i].build($this);
					if(item) {
						that.items[item.name] = item;
						break;
					}
				}
			});
		},
		FormPlugin = function(val) {
			if(this.length) {
				var form = $(this[0]);
				var ret = form.data(DK_FORM_VALUE);
				if(!ret) {
					ret = new Jform(form);
					for(var key in ret.items) {
						ret.items[key].render();
					}
					if(val) {
						ret.init(val);
					}
					form.data(DK_FORM_VALUE, ret);
				}
				return ret;
			}
		},

		_version = "1.1";

	Jhidden.build = function(ele) {
		return ele.hasClass(CC_HIDDEN) ? new Jhidden(ele) : CK_FALSE;
	};
	Jtext.build = function(ele) {
		return ele.hasClass(CC_TEXT) ? new Jtext(ele) : CK_FALSE;
	};
	Jselect.build = function(ele) {
		return ele.hasClass(CC_SELECT) ? new Jselect(ele) : CK_FALSE;
	};
	Jmselect.build = function(ele) {
		return ele.hasClass("mselect") ? new Jmselect(ele) : CK_FALSE;
	};
	$.extend(Jhidden.prototype, {
		val: function(val) {
			if(val) {
				this.value = val;
			} else {
				return this.value;
			}
		},
		reset: function() {
			return this.value = this.dv;
		},
		render: function() {},
		validate: function() {
			return CK_TRUE
		},
		setDefaultValue: function(value) {
			this.dv = value;
		},
	});
	$.extend(Jtext.prototype, {
		render: function() {
			if(this.showOnly) {
				this.ele.html("");
			} else {
				this.valEle = $(TK_TEXT_INPUT);
				var tmp = this.ele.attr(AK_PLACEHOLDER);
				if(tmp) this.valEle.attr(AK_PLACEHOLDER, tmp);
				if(this.readOnly) this.valEle.prop(AK_READONLY, AK_READONLY);
				this.valEle.appendTo(this.ele);
			}
			this.val(this.dv);
		},
		val: function(val) {
			if(arguments.length) {
				var ct = (val === null ? "" : ("" + val));
				this.showOnly ? this.ele.html(ct) : this.valEle.html(ct);
			} else if(!this.isShowOnly) {
				var v = this.codeEle.val();
				v = this.trimed ? $.trim(v) : v;
				return this.dt == 0 ? v : (v ? (this.dt == 1 ? parseInt(v) : parseFloat(v)) : 0);
			}
		},
		reset: function() {
			this.val(this.dv);
		},
		validate: function() {
			var vtext = this.valEle.val();
			if(this.trimed && vtext) vtext = $.trim(vtext);
			if(this.ele.attr(AK_REQUIRED)) {
				if(!vtext) return "required";
			}
		}
	});
	$.extend(Jselect.prototype, {
		render: function() {
			if(!this.ele.hasClass(CC_DROP_DOWN_CONTAINER)) this.ele.addClass(CC_DROP_DOWN_CONTAINER);
			this.codeEle = $(TK_HIDDEN_INPUT).appendTo(this.ele);
			this.captionEle = $("<a class='dd-hand' href='javascript:void(0)'><span></span><i class='icon'></i></a>").appendTo(this.ele).find("span");
			//this.ele.append(this.codeEle).append(this.captionEle);
			select_change(this, this.dv)
			if((!this.readOnly) && (!this.showOnly)) {
				this.selectItemEle = $("<div class='dd-drop'><div class='select-loading'></div></div>");
				this.selectItemEle.appendTo(this.ele);
				dict_apply(this.dictCode, (function(that) {
					return function(dd) {
						that.selectItemEle.empty();
						if(that.dropItem) {
							that.dropItem.call(that, dd);
						} else {
							that.selectItemEle.append((that.isTree ? select_buildTreeDrop : select_buildListDrop).call(that, dd));
						}
					}
				})(this));
			}
		},
		val: function(val) {
			if(arguments.length) {
				select_change(this, this.isBool ? (val ? "1" : "0") : (val ? val : ""));
			} else if(!this.isShowOnly) {
				var v = this.codeEle.val();
				return this.isBool ? (v ? CK_TRUE : CK_FALSE) : (v ? v : CK_UNDEF);
			}
		},
		reset: function() {
			select_change(this, this.dv);
		},
		validate: function() {
			var vtext = this.codeEle.val();
			if(this.ele.attr(AK_REQUIRED)) {
				if(!vtext) return "required";
			}
		},

		selectItem: function($item, evt) {
			var val = $item.attr(AK_CODE);
			select_change(this, val ? val : "");
		}
	});
	$.extend(Jmselect.prototype, {
		render: function() {
			if(!this.ele.hasClass(CC_DROP_DOWN_CONTAINER)) this.ele.addClass(CC_DROP_DOWN_CONTAINER);
			this.captionEle = $("<ul></ul>").appendTo($("<a class='dd-hand' href='javascript:void(0)'><i></i></a>").appendTo(this.ele));
			mselect_change(this, this.dv);

			if((!this.readOnly) && (!this.showOnly)) {
				this.selectItemEle = $("<div class='dd-drop'><div class='select-loading'></div></div>");
				this.selectItemEle.appendTo(this.ele);
				dict_apply(this.dictCode, (function(that) {
					return function(dd) {
						that.selectItemEle.empty();
						if(that.dropItem) {
							that.dropItem.call(that, dd);
						} else {
							that.selectItemEle.append((that.isTree ? select_buildTreeDrop : select_buildListDrop).call(that, dd));
						}
					}
				})(this));
			}
		},
		val: function(val) {
			if(arguments.length) {
				mselect_change(this, val);
				return this;
			} else if(!this.isShowOnly) {
				var ret = [];
				this.captionEle.find(EN_INPUT).each(function() {
					ret.push($(this).val);
				})
				return ret;
			}
		},
		reset: function() {
			mselect_change(this, this.dv);
		},
		validate: returnTrue,
		selectItem: function($item, evt) {
			if(!mselect_add(this, $item.attr(AK_CODE)))
				evt.stopPropagation();
		}
	});
	$.extend(Jform.prototype, {
		init: function(options) {
			if($.type(options) == TN_FNC) {
				options.call(this);
			} else {
				for(var key in options) {
					var io = this.items[key] || (this.items[key] = new Jhidden(key));
					io.val(options[key]);
				}
			}
		},
		item: function(name) {
			return this.items[name];
		},
		validate: function() {
			for(var key in this.items) {
				if(!this.items[key].validate()) return CK_FALSE;
			}
			return CK_TRUE;
		},
		reset: function() {
			for(var key in this.items) {
				this.items[key].reset();
			}
			return this;
		},
		val: function(data) {
			if(!data) {
				if(!this.validate()) return CK_FALSE;
				var ret = {};
				for(var key in this.items) {
					var val = this.items[key].val();
					if(val !== CK_UNDEF) {
						ret[key] = val;
					}
				}
				return ret;
			}
			for(var key in data) {
				var obj = this.items[key];
				if(obj) {
					obj.val(data[key]);
				}
			}
			return this;
		},
		queryString: function() {
			if(!this.validate()) return CK_FALSE;
			var qs = "";
			for(var key in this.items) {
				var obj = this.items[key];
				var val = obj.val();
				qs = serialize(obj, key, val, qs);
			}
			if(qs.length > 1) {
				qs.substr(0, qs.length - 1);
			}
			return qs;
		}
	});

	$.fn.form = FormPlugin;
	$.fn.form.Constructor = Jform;
	$.dictDefine = dict_define;

	$(doc).on("click.jr_dropdown_api", dd_clearMenus);
	$(doc).on("click.jr_dropdown_api", QF_DROP_DOWN_HAND, dd_toggle);
	$(doc).on("click.jr_select_api", QF_BRANCH_ITEM, select_branceItem);
	$(doc).on("click.jr_select_api", QF_SELECT_ITEM, select_selectItem);
	$(doc).on("click.jr_mselect_remove_api",".form-item.mselect .select-caption div",function(e){
		$(this).parents(QF_SELECT_CAPTION).remove();
		e.stopPropagation();
	});

}(jQuery);