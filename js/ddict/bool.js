;
(function($) {
	$.dictDefine("bool", [{
		code: "0",
		caption: "否",
		shortCode: "N",
		enabled: true,
		children: [{
			code: "0",
			caption: "否",
			shortCode: "N",
			enabled: true,
		}, {
			code: "1",
			caption: "是",
			shortCode: "Y",
			enabled: true
		}]
	}, {
		code: "1",
		caption: "是",
		shortCode: "Y",
		enabled: true
	}]);
})(jQuery);