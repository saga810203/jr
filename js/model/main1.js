;spa_define(function(spa){
	
	
	return {main:function(){
		spa.mainEle.html("in main :"+(new Date()).toString());		
	},modal:function(data){
		//console.log(spa.getLastModalCtn())
		//spa.getLastModalCtn().html(" in modal:"+(new Date()).toString());	
		spa.getLastModalCtn().children(".main1").html(" in modal:"+(new Date()).toString());
	},mainDestory:function(){
		
	},modalDestory:function(){
		
	}};
	
});