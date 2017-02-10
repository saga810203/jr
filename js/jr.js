(function(global, undefined) {
	if(global.jr) {
		return;
	}
	var jr = global.jr = {
		version: "1.0.0"
	}

	function isType(type) {
		return function(obj) {
			return {}.toString.call(obj) == "[object " + type + "]"
		}
	}
	var ABS_JS_RE = /^(http|https):\/\//i,
		ENDSWITH_JS_RE = /\.js$/i,
		DIRNAME_RE = /[^?#]*\//,
		DOT_RE = /\/\.\//g,
		DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//,
		MULTI_SLASH_RE = /([^:/])\/+\//g,
		URI_RE = /[^?#]*/,
		JM_ST = {
			INITED: 0,
			LOADING: 1,
			LOADED: 2,
			EXECUTING: 3,
			EXECUTED: 4,
			TIMEOUT: 5,
			LOADERROR: 6,
			EXECERROR: 7
		},
		doc = document,
		head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement,
		baseElement = head.getElementsByTagName("base")[0],

		isObject = isType("Object"),
		isString = isType("String"),
		isArray = Array.isArray || isType("Array"),
		isFunction = isType("Function"),
		interactiveScript,
		currentlyAddingScript,
		_baseScriptPath,
		cacheModules = [];

	// Extract the directory portion of a path
	// dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
	// ref: http://jsperf.com/regex-vs-split/2
	function dirname(path) {
		return path.match(DIRNAME_RE)[0]
	}

	function realpath(path) {
		// /a/b/./c/./d ==> /a/b/c/d
		path = path.replace(DOT_RE, "/")

		/*
		  @author wh1100717
		  a//b/c ==> a/b/c
		  a///b/////c ==> a/b/c
		  DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
		*/
		path = path.replace(MULTI_SLASH_RE, "$1/")

		// a/b/c/../../d  ==>  a/b/../d  ==>  a/d
		while(path.match(DOUBLE_DOT_RE)) {
			path = path.replace(DOUBLE_DOT_RE, "/")
		}
		return path
	}

	function log(s) {
		if(console && console.log) {
			console.log(s);
		}
	}

	function onload(evt) {
		if(!evt) evt = global.event;
		var node = evt.currentTarget || evt.srcElement;
		node.onload = node.onerror = node.onreadystatechange = null;
		if(jr.debug) {
			log("load script[" + node.src + "] over with onload");
		}
	}

	function onerror(evt) {
		if(!evt) evt = global.event;
		var node = evt.currentTarget || evt.srcElement;
		node.onload = node.onerror = node.onreadystatechange = null;
		var mod = getModule(node.src);
		mod.statu = JM_ST.LOADERROR;
		jr.error(mod);
		if(jr.debug) {
			log("load script[" + node.src + "] error with onload:" + mod.statu);
		}
	}

	function onreadystatechange(evt) {
		if(!evt) evt = global.event;
		var node = evt.currentTarget || evt.srcElement;
		if(/loaded|complete/.test(node.readyState)) {
			var mod = getModule(node.src);
			setTimeout(function() {
				if(mod.statu <= JM_ST.LOADED) {
					mod.statu = JM_ST.TIMEOUT;
					jr.error(mod);
					if(jr.debug) {
						log("load script[" + node.src + "] error with onload:" + mod.statu);
					}
				}
			}, jr.timeout * 1000);
		}
	}

	function resolve(id, refUri) {
		if(ABS_JS_RE.test(id)) {
			id = realpath(id);
			return id;
		}
		return realpath(dirname(refUri) + id + ".js");
	}

	function loadScript(mod) {
		var node = doc.createElement("script");
		node.async = true;
		node.src = mod.uri;
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
	}

	function getCurrentScript2() {
		//取得正在解析的script节点
		if(doc.currentScript) { //firefox 4+
			return doc.currentScript;
		}
		// 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
		var stack;
		try {
			a.b.c.d.e.f.g(); //强制报错,以便捕获e.stack
		} catch(e) { //safari的错误对象只有line,sourceId,sourceURL
			stack = e.stack;
			if(!stack && window.opera) {
				//opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
				stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
			}
		}
		if(stack) {
			/**e.stack最后一行在所有支持的浏览器大致如下:
			 *chrome23:
			 * at http://113.93.50.63/data.js:4:1
			 *firefox17:
			 *@http://113.93.50.63/query.js:4
			 *opera12:
			 *@http://113.93.50.63/data.js:4
			 *IE10:
			 *  at Global code (http://113.93.50.63/data.js:4:1)
			 */
			stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
			stack = stack[0] == "(" ? stack.slice(1, -1) : stack;
			return stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
		}
		var nodes = head.getElementsByTagName("script"); //只在head标签中寻找
		for(var i = 0, node; node = nodes[i++];) {
			if(node.readyState === "interactive") {
				return node;
			}
		}
	}

	function getCurrentScript() {
		if(currentlyAddingScript) {
			return currentlyAddingScript
		}
		if(doc.currentScript) { //firefox 4+
			return doc.currentScript;
		}
		// For IE6-9 browsers, the script onload event may not fire right
		// after the script is evaluated. Kris Zyp found that it
		// could query the script nodes and the one that is in "interactive"
		// mode indicates the current script
		// ref: http://goo.gl/JHfFW
		if(interactiveScript && interactiveScript.readyState === "interactive") {
			return interactiveScript
		}

		var scripts = head.getElementsByTagName("script")

		for(var i = scripts.length - 1; i >= 0; i--) {
			var script = scripts[i]
			if(script.readyState === "interactive") {
				interactiveScript = script
				return interactiveScript
			}
		}
		throw new Error("getCurrentScript was no supported in this Broser")
	}

	function getModule(puri) {
		var mod;
		for(var i = 0; i < cacheModules.length; ++i) {
			if(cacheModules[i].uri == puri) {
				mod = cacheModules[i];
				break;
			}
		}
		return mod ? mod : (cacheModules[cacheModules.length] = {
			uri: puri,
			statu: JM_ST.INITED,
			remain: 0,
			refs: [],
			deps: []
		});
	}

	function buildModule(mod) {
		var reqs = [];
		for(var i = 0; i < mod.deps.length; ++i) {
			reqs.push(mod.deps[i].eObj);
		}
		try {
			mod.eObj = isFunction(mod.factory) ? mod.factory.apply(global, reqs) : mod.factory;
		} catch(error) {
			if(jr.debug) {
				log("build module[" + mod.uri + "] error: " + error)
			}
			mod.statu = JM_ST.EXECERROR;
			mod.err = error;
			jr.error(mod);
			return;
		}
		mod.statu = JM_ST.EXECUTED;
		for(var i = 0; i < mod.refs.length; ++i) {
			var rmod = mod.refs[i];
			--rmod.remain;
			if(rmod.remain == 0) {
				buildModule(rmod);
			}
			delete mod.refs;
			delete mod.deps;
			delete mod.factory;
		}
	}

	function define(depIds, factory) {
		var script = getCurrentScript();
		var mod = getModule(realpath(script.src).match(URI_RE)[0]);
		mod.statu = JM_ST.EXECUTING;
		var argsLen = arguments.length;
		var loads = [];
		if(argsLen === 1) {
			factory = depIds,
				depIds = [];
		}
		if(!isArray(depIds)) {
			depIds = [depIds];
		}

		for(var i = 0; i < depIds.length; ++i) {
			var depId = depIds[i];
			var dmod;
			if(isString(depId)) {
				dmod = getModule(resolve(depId, mod.uri));
				if(dmod.statu < JM_ST.EXECUTED) {
					dmod.refs.push(mod);
					++mod.remain;
					if(dmod.statu == JM_ST.INITED) loads.push(dmod);
				}
			} else {
				dmod = {
					eObj: depId
				};
			}
			mod.deps.push(dmod);
		}
		mod.factory = factory;
		if(mod.remain == 0) {
			buildModule(mod);
		}
		for(var i = 0; i < loads.length; ++i) {
			loadScript(loads[i]);
		}
	}

	function config(obj) {
		if(obj.debug) {
			this.debug = true;
		}
		if(obj.error && isFunction(obj.error)) {
			this.error = obj.error;
		}
		if(obj.timeout) this.timeout = obj.timeout;
		return this;
	}

	function use(depIds, callback) {
		var mod = getModule(realpath(global.location.href).match(URI_RE)[0]);
		mod.statu = JM_ST.EXECUTING;
		var argsLen = arguments.length;
		var loads = [];
		if(argsLen === 1) {
			factory = depIds,
				depIds = [];
		}
		if(!isArray(depIds)) {
			depIds = [depIds];
		}

		for(var i = 0; i < depIds.length; ++i) {
			var depId = depIds[i];
			var dmod;
			if(isString(depId)) {
				dmod = getModule(resolve(depId, _baseScriptPath));
				if(dmod.statu < JM_ST.EXECUTED) {
					dmod.refs.push(mod);
					++mod.remain;
					if(dmod.statu == JM_ST.INITED) loads.push(dmod);
				}
			} else {
				dmod = {
					eObj: depId
				};
			}
			mod.deps.push(dmod);
		}
		mod.factory = callback;
		if(mod.remain == 0) {
			buildModule(mod);
		}
		for(var i = 0; i < loads.length; ++i) {
			loadScript(loads[i]);
		}
	}
	jr.config = config;
	jr.define = define;
	jr.use = use;
	jr.timeout = 1;
	(function() {
		var sc = getCurrentScript();
		if(sc) {
			_baseScriptPath = sc.src;
			if(ABS_JS_RE.test(_baseScriptPath)) {
				_baseScriptPath = realpath(_baseScriptPath);
			} else if(/^\//.test(_baseScriptPath)) {
				_baseScriptPath = realpath(global.location.protocol + "://" + global.location.host + (80 == global.location.port ? "" : global.location.port) + _baseScriptPath);
			} else {
				_baseScriptPath = dirname(global.location.href) + _baseScriptPath;
			}
			_baseScriptPath = _baseScriptPath.match(URI_RE)[0];
		}

	})();
	
	(function(){
		if(global.jQuery){
			var script = getCurrentScript();
			var jqUri = resolve("jQuery",realpath(script.src).match(URI_RE)[0]);
			var mod = getModule(jqUri);
			try {
			mod.eObj = global.jQuery;
			mod.statu = JM_ST.EXECUTED;
			delete mod.refs;
			delete mod.deps;
		}
	})();
	
	return jr;
})(this);