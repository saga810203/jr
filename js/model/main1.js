;
spa_define(function(spa) {

	return {
		main: function() {
			var pdg = spa.mainEle.children(".main1").pdg();
			pdg.codeRef.addValueListener($.util.dictDisplay);
			spa.mainEle.find(".query").on("click", function() {
				console.log("dt load")
				pdg.load();
			});
			spa.mainEle.find(".reset").on("click", function() {
				console.log("dt reset")
				pdg.formRef.reset();
			});
			console.log(pdg.formRef.val());
			pdg.load();
		},
		modal: function(data) {
			//console.log(spa.getLastModalCtn())
			//spa.getLastModalCtn().html(" in modal:"+(new Date()).toString());	
			spa.getLastModalCtn().children(".main1").html(" in modal:" + (new Date()).toString());
		},
		mainDestory: function() {

		},
		modalDestory: function() {

		}
	};

});