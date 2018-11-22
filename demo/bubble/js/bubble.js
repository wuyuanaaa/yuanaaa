var bobbles = (function () {
    var defaults = {
        width: [4, 60],
        delay: [0, 40],
        duration: 0.5
    };

    class Bobbles {
        constructor(num, options) {
            this.num = num;
            this.$parent = $(options.parent);
            this.width = options.width;
            this.delay = options.delay;
            this.duration = options.duration;
            this.count = 0;
        }

        static getRandom(min, max) {
            return Math.round(min + (max - min) * Math.random());
        }

        // 创建父元素
        addWrapper() {
            this.$Wrapper = $('<ul id="bubbles_bg"> </ul>');
            $('body').append(this.$Wrapper);
        }
        // 生成一个随机的子元素属性对象
        createBobbleData() {
            var data = {},
                width,
                getRandom = Bobbles.getRandom;

            width = getRandom(...this.width);

            data['width'] = width + 'px';
            data['height'] = width + 'px';
            data['animation-delay'] = getRandom(...this.delay) + 's';
            data['animation-duration'] = 10 + width * this.duration + 's';
            data['left'] = (100 / this.num) * this.count + '%';

            this.count++;
            return data;
        }
        // 创建子元素
        createBobble() {
            var li = document.createElement('li'),
                $li = $(li);

            $li.addClass('bubble');
            $li.css(this.createBobbleData());
            return $li;
        }
        // 添加子元素到父元素
        addBobble(num) {
            var $parent = this.$Wrapper;
            for (let i = 0; i < num; i++) {
                let $li = this.createBobble();
                $parent.append($li);
            }
        }

        init() {
            this.addWrapper();
            this.addBobble(this.num);
        }
    }

    var init = function (num, options) {
        options = $.extend({}, defaults, options);
        new Bobbles(num, options).init();
    };

    return {
        init: init
    }

})();

bobbles.init(12);

