;
jr.define(["jQuery"], function($) {
	var DROP_DOWN_CONTAINER_CSS = ".dd-ctn",
		DROP_DOWN_BACKGROUP_CSS = ".dd-bg",
		DROP_DOWN_HAND_CSS=".dd-hand",
		clearMenus = function(e) {
			if(e && e.which === 3) return
			$(DROP_DOWN_BACKGROUP_CSS).remove()
			$(DROP_DOWN_CONTAINER_CSS).each(function() {
				var $this = $(this)
				var relatedTarget = {
					relatedTarget: this
				}
				if(!$this.hasClass('open')) return
				$this.trigger(e = $.Event('hide.jr.dropdown', relatedTarget))
				if(e.isDefaultPrevented()) return
				$this.removeClass('open').trigger('hidden.jr.dropdown', relatedTarget)
			});
		},
		toggle = function(e) {
			var $this = $(this);
			var $ddc = $this.parents(DROP_DOWN_CONTAINER_CSS);
			if(!$ddc.length) return;
			if($ddc.is('.disabled, :disabled')) return;
			var isActive = $ddc.hasClass(OPEN_CSS);
			clearMenus();
			if(!isActive) {
				var relatedTarget = {relatedTarget: this}
				$ddc.trigger(e = $.Event('show.jr.dropdown', relatedTarget))
				if(e.isDefaultPrevented()) return
				$ddc.toggleClass('open').trigger('shown.jr.dropdown', relatedTarget)
			}
			return false
		};
		$(document).on("click.jr_dropdown_api",clearMenus);
		$(document).on("click.jr_dropdown_api",DROP_DOWN_HAND_CSS,toggle);
});