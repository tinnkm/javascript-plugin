/**
 * *******************************************************
 * *******使用原则：能力检测>怪癖检测>客户端检测**********
 * *******************************************************
 */
/** 
 * @author [tinnkm]
 * @return {[返回呈现引擎，浏览器，平台]}
 * @description [用于检测当前浏览器类型(客户端检测)]
 * 
 */
var client = function() {
	//呈现引擎
	var engine = {
		ie: 0,
		gecko: 0,
		webkit: 0,
		khtml: 0,
		opera: 0,
		//完整的版本号
		ver: null
	};

	//浏览器
	var browser = {
		ie: 0,
		firefox: 0,
		safari: 0,
		konq: 0,
		opera: 0,
		chrome: 0,
		//具体的版本号
		ver: null
	};
	//平台、设备和操作系统
	var system = {
		win: false,
		mac: false,
		//以linux为内核的系统
		x11: false,

		//移动设备
		iphone: false,
		ipod: false,
		ipad: false,
		ios: false,
		android: false,
		nokiaN: false,
		winMobile: false,

		//游戏系统
		wii: false,
		ps: false
	}

	//检测呈现引擎和浏览器
	//获取用户单利代理信息
	var ua = navigator.userAgent;
	//根据opera浏览器特有的变量检测浏览器
	if (window.opera) {
		engine.ver = browser.ver = window.opera.version();
		engine.opera = browser.opera = parseFloat(engine.ver);
	} else if (/AppleWibkit\/(\S+)/.test(ua)) {
		//获取第一组
		engine.ver = RegExp["$1"];
		engine.webkit = parseFloat(engine.ver);

		//确定是chrome合还是afari
		if (/Chrome\/(\S+)/.test(ua)) {
			browser.ver = RegExp["$1"];
			browser.chrome = parseFloat(browser.ver);
		} else if (/Version\/(\S+)/.test(ua)) {
			browser.ver = RegExp["$1"];
			browser.safari = parseFloat(browser.ver);
		} else {
			//近似的取版本号
			var safariVersion = 1;
			if (engine.webkit < 100) {
				safariVersion = 1;
			} else if (engine.webkit < 312) {
				safariVersion = 1.2
			} else if (engine.webkit < 412) {
				safariVersion = 1.3;
			} else {
				safariVersion = 2;
			}
			browser.safari = browser.ver = safariVersion;
		}
	} else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/(\S+)/.test(ua)) {
		engine.ver = browser.ver = RegExp["$1"];
		engine.khtml = browser.konq = parseFloat(engine.ver);
	} else if (/rv:([^\)]+)\) Geocko\/\d{8}/.test(ua)) {
		engine.ver = RegExp["$1"];
		engine.gecko = parseFloat(engine.ver);
		//确定是不是火狐
		if (/Firefox\/(\S+)/.test(ua)) {
			browser.ver = RegExp["$1"];
			browser.firefox = parseFloat(browser.ver);
		}
		//[^;]表示匹配任意未包含;的字符
	} else if (/MSIE ([^;]+)/.test(ua)) {
		engine.ver = browser.ver = RegExp["$1"];
		engine.ie = browser.ie = parseFloat(engine.ver);
	}

	//检测浏览器
	browser.ie = engine.ie;
	browser.opera = engine.opera;

	//检测平台
	var p = navigator.platform;
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11" || (p.indexOf("Linux") == 0));

	//检测windows系统
	if (system.win) {
		//？表示匹配前面子表达式一次或零次；(?:pattern)表示非获取匹配，Win(?:dows )类似与Win|Windows 
		//([^do]{2})表示匹配不包含do的两个字符
		if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
			if (RegExp["$1"] == "NT") {
				switch(RegExp["$2"]) {
					case "5.0":
						system.win = "2000";
						break;
					case "5.1":
						system.win = "xp";
						break;
					case "6.0":
						system.win = "Vista";
						break;
					case "6.1":
						system.win = "7";
						break;
					default:
						system.win = "NT";
						break;

				}
			} else if (RegExp["$1"] == "9x") {
				system.win = "ME";
			} else {
				system.win = RegExp["$1"];
			}
		}
	}

	//移动设备
	system.iphone = ua.indexOf("iPhone") > -1;
	system.ipod = ua.indexOf("iPod") > -1;
	system.ipad = ua.indexOf("iPad") > -1;

	//windows mobile
	if (system.win == "CE") {
		system.winMobile = system.win;
	} else if (system.win == "Ph") {
		if (/Windows phone OS (\d+.\d+)/.test(ua)) {
			system.win = "Phone";
			system.winMobile = parseFloat(RegExp["$1"]);
		}
	}

	//检测ios版本
	if (system.mac && ua.indexOf("Mobile") > -1) {
		if (/CPU (?:iphone)?OS (\d+_\d+)/.test(ua)) {
			system.ios = parseFloat(RegExp.$1.replace("_", "."));
		} else {
			//不能真正检测出来，做猜测
			system.ios = "10.1.3";
		}
	}

	//检测Android版本
	if (/Android (\d+\.\d+)/.test(ua)) {
		system.android = parseFloat(RegExp.$1);
	}

	//游戏系统
	system.wii = ua.indexOf("Wii") > -1;
	system.ps = /playstation/i.test(ua);

	return {
		engine: engine,
		browser: browser,
		system: system
	}

}();