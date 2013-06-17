/*global jQuery, window*/
jQuery.fn.mapStatusWidget = function (mapController) {
	'use strict';
	var element = this,
		oldIdea,
		updateSharable = function (sharable) {
			if (sharable) {
				element.removeClass('map-not-sharable').addClass('map-sharable');
			} else {
				element.removeClass('map-sharable').addClass('map-not-sharable');
			}
		},
		rebindIfChanged = function (idea, autoSave) {
			if (oldIdea !== idea) {
				oldIdea = idea;
				if (!autoSave) {
					idea.addEventListener('changed', function () {
						if (element.hasClass('map-unchanged')) {
							element.removeClass('map-unchanged').addClass('map-changed');
							element.removeClass('map-sharable').addClass('map-not-sharable');
						}

					});
				}
			}
		};
	mapController.addEventListener('mapSaved mapLoaded', function (mapId, idea, properties) {
		if (!properties.editable) { /* imported, no repository ID */
			jQuery('body').removeClass('map-unchanged').addClass('map-changed');
		} else {
			element.removeClass('map-changed').addClass('map-unchanged');
		}
		element.removeClass('map-overwritable');
		if (properties.overwritable) {
			element.addClass('map-overwritable');
		}
		rebindIfChanged(idea, properties.autoSave);
		updateSharable(properties.sharable);
	});
	jQuery(window).bind('beforeunload', function () {
		if (mapController.isMapLoadingConfirmationRequired()) {
			return 'There are unsaved changes.';
		}
	});
};
