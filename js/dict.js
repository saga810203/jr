jr.define(["jQuery", "util"], function($, util) {
			var _dictCache = {};
			var _dictHandleCache = {};
			var _dictGuid = 1;
			var handerArray = "handlers";
			return {
				baseUri: "",
				apply: function(dictCode, handler, dynamic) {
					if(dynamic) {
						var pt = Math.random().replace(/\D/g, "") + (++_dictGuid);
						_dictHandleCache[pt] = [handler];
						Util.loadScript(dictCode + "?dictFlag=" + pt);
					} else {
						var dict = _dictCache[dictCode];
						if(!dict) {
							var hs = _dictHandleCache[dictCode];
							if(!hs) {
								_dictHandleCache[dictCode] = hs = [];
							}
							hs.push(handler);
							Util.loadScript(Dict.baseUri + dictCode + ".js");
						} else {
							handler(dict);
						}
					}
				},
				refresh: function(dictCode, handler) {
					if(handler) {
						var hs = _dictHandleCache[dictCode];
						if(!hs) {
							_dictHandlerCache[dictCode] = hs = [];
						}
						hs.push(handler);
					}
					var dict = _dictCache[dictCode];
					if(dict) {
						delete _dictCache[dictCode];
						Util.loadScript(Dict.baseUri + dictCode + ".js");
					}
				},
				/*
				 * content:[{code:"12345",caption:"",shortCode:"",enabled:true,children:[{code:"",catpion:"",enabled:true,children:[]]}},....]
				 * 
				 */
				define: function(dictCode, content, dynamic) {
					if(!dynamic) {
						_dictCache[dictCode] = dictCache[dictCode] || content;

					}
					var handlers = _dictHandleCache[dictCode];
					if(handlers && handlers.length) {
						for(var i = 0; i < handlers.length; ++i) {
							handlers[i](content);
						}
						delete _dictHandleCache[dictCode];
					}
				},
				get: function(dict, code) {
					for(var i = 0; i < dict.length; ++i) {
						var item = dict[i];
						if(code === item.code) {
							return item.caption;
						} else if(item.children && item.children.length) {
							var ret = Dict.get(item.children, code);
							if(ret) return ret;
						}
					}
					return false;
				},
				buildSelectDrop: function(dict) {
					var $ul = $("<ul class='select-ul'></ul>");
					for(var i = 0; i < dict.length; ++i) {
						var item = dict[i];
						if(this.filter) {
							if(this.filter(item)) {
								var $li = $("<li class='select-item'></li>");
								if(!item.enabled) $li.addClass(DISABLED);
								var $in = $("<input type='hidden'/>");
								$in.val(item.code);
								$li.html(item.caption);
								$li.append($in);
								$li.appendTo($ul);
							}
						} else {
							var $li = $("<li class='select-item'></li>");
							if(!item.enabled) $li.addClass(DISABLED);
							var $in = $("<input type='hidden'/>");
							$in.val(item.code);
							$li.html(item.caption);
							$li.append($in);
							$li.appendTo($ul);
						}
					}
					this.selectItemEle.append($ul);
				}

			})