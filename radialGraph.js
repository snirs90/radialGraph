'use strict';
(function(window) {

    var radialGraph = function() {

        var OUTER_ARC_COLOR    = '#FB6000',
            COMPLETE_ARC_COLOR = '#f4f4f4',
            INNER_ARC_COLOR    = '#58595B',
            OUTER_ARC_WIDTH    = 8,
            INNER_ARC_WIDTH    = 6,
            NEGATIVE_COLOR     = 'red';

        /**
         * Check if the value is valid.
         *
         * @param value
         * @returns {boolean}
         */
        function isValidValue(value) {
            return !(value > 100 || value < -100);
        }

        this.create = function create(container, options) {

            if (!isValidValue(options.outer.value) || !isValidValue(options.inner.value)) {
                console.error('radialGraph error:', 'inner/outer values should be between -100 to 100 only.');
                return false;
            }

            var defaultOptions = {
                circle: {
                    diameter: 50,
                    color: '#ffffff'
                },
                outer: {
                    text: options.outer.text || options.outer.value,
                    textStyle: options.outer.textStyle || {'font-size': 12},
                    value: options.outer.value || 0,
                    width: options.outer.width || OUTER_ARC_WIDTH,
                    color: options.outer.color || OUTER_ARC_COLOR,
                    negativeColor: options.outer.negativeColor || NEGATIVE_COLOR,
                    completeColor: options.outer.completeColor || COMPLETE_ARC_COLOR
                },
                inner: {
                    text: options.inner.text || options.inner.value,
                    textStyle: options.inner.textStyle || {'font-size': 12},
                    value: options.inner.value || 0,
                    width: options.inner.width || INNER_ARC_WIDTH,
                    color: options.inner.color || INNER_ARC_COLOR,
                    negativeColor: options.inner.negativeColor || NEGATIVE_COLOR
                }
            };

            var _options = _.merge(defaultOptions, options);

            _options.outer.color = _options.outer.value > 0 ? _options.outer.color : _options.outer.negativeColor;
            _options.inner.color = _options.inner.value > 0 ? _options.inner.color : _options.inner.negativeColor;

            var CANVAS_WIDTH  = 110,
                CANVAS_HEIGHT = 110;

            var archType = Raphael(container, CANVAS_WIDTH, CANVAS_HEIGHT);

            archType.customAttributes.arc = function (centerX, centerY, value, total, radius) {
                var
                    angle = value / total * 359.99,
                    absAngle = Math.abs(angle),
                    a = Math.PI / 180 * (90 - angle),
                    x = centerX + radius * Math.cos(a),
                    y = centerY - radius * Math.sin(a),
                    sweep = +(value >= 0),
                    path;

                path = [
                    ['M', centerX, centerY - radius],
                    ['A', radius, radius, 0, +(absAngle > 180), sweep, x, y]
                ];

                return {'path': path};
            };

            // complete arc (outer)
            archType.circle(55, 55, 50).attr({
                'fill': _options.circle.color,
                'stroke': _options.outer.completeColor,
                'stroke-width': _options.outer.width
            });

            // Outer Arc
            //make an arc at 50,50 with a radius of 30 that grows from 0 to 40 of 100 with a bounce
            var my_arc = archType.path().attr({
                'stroke': _options.outer.color,
                'stroke-width': _options.outer.width,
                arc: [55, 55, 0, 100, _options.circle.diameter]
            });
            my_arc.animate({
                // 3rd param is percentage. Round up to 100 if greater
                arc: [55, 55, _options.outer.value, 100, _options.circle.diameter]
            }, 1000);

            // Inner Arc
            var my_arc2 = archType.path().attr({
                'stroke': _options.inner.color,
                'stroke-width': _options.inner.width,
                arc: [55, 55, 0, 100, _options.circle.diameter - 6.5]
            });

            my_arc2.animate({
                // 3rd param is percentage.
                arc: [55, 55, _options.inner.value, 100, _options.circle.diameter - 6.5]
            }, 1000);

            // (X,Y,text)
            archType.text(55, 45, _options.outer.text).attr(_options.outer.textStyle);
            archType.text(55, 60, _options.inner.text).attr(_options.inner.textStyle);
        }

    };

    // Expose globally.
    window.radialGraph = new radialGraph();

})(window);