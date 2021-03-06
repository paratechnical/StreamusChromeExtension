﻿define([
    'foreground/view/contextMenu/contextMenuItemView'
], function (ContextMenuItemView) {
    'use strict';

    var ContextMenuView = Marionette.CompositeView.extend({
        id: 'context-menu',
        tagName: 'ul',
        className: 'menu panel',
        childView: ContextMenuItemView,
        template: _.template(),
        //  Used to determine whether context-menu display should flip as to not overflow container
        containerHeight: 0,
        containerWidth: 0,
        
        initialize: function(options) {
            this.containerHeight = options.containerHeight;
            this.containerWidth = options.containerWidth;
        },

        onShow: function () {
            var offsetTop = this._ensureOffset(this.model.get('top'), this.$el.outerHeight(), this.containerHeight);
            var offsetLeft = this._ensureOffset(this.model.get('left'), this.$el.outerWidth(), this.containerWidth);

            this.$el.offset({
                top: offsetTop,
                left: offsetLeft
            });
            
            this.$el.addClass('is-visible');
        },
        //  TODO: Move this logic to the ContextMenuRegion and use the same logic as in NotificationRegion.
        hide: function () {
            this.$el.off('webkitTransitionEnd').one('webkitTransitionEnd', this._onTransitionOutComplete.bind(this));
            this.$el.removeClass('is-visible');
        },
        
        _onTransitionOutComplete: function () {
            this.model.get('items').reset();
            this.destroy();
        },
        
        //  Prevent displaying ContextMenu outside of viewport by ensuring its offsets are valid.
        _ensureOffset: function(offset, elementDimension, containerDimension) {
            var ensuredOffset = offset;
            var needsFlip = offset + elementDimension > containerDimension;

            if (needsFlip) {
                ensuredOffset -= elementDimension;
            }

            return ensuredOffset;
        }
    });

    return ContextMenuView;
});