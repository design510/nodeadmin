var Vue = require('lib/vue');

// var VueValidator = require('lib/vue-validator');
// Vue.use(VueValidator);

module.exports = Vue.extend({
    template: __inline('main.html'),
    data: function() {
        return {
            isShow: false,
            type: 'danger', //danger,info,success,warning
            msg: '' //必填
        }
    },
    props: [
        /**
         *是否使用icon，非必须，在输入框前面显示图标，会自动生成类似<i class="fa fa-user"></i>，其中的icon就是user
         * user: 用户名
         */
        'icon',

        /**
         * 字段的解释，非必须，会自动生成类似<label class="control-label">用户名</label>
         */
        'title',

        /**
         * 是否显示title，非必须，默认显示，即显示<lable>
         */
        'notitle',

        /**
         * input 的name 值，必须
         */
        'name'
    ],
    methods: {
        check: function(obj) {
            /**
             * required
             */
        },
        hide: function(event) {
            // this.isShow = false;

            // 这里非常重要，因为如果在表单里面，它会触发submit提交，必须要阻止
            event.preventDefault();
        }
    },
    // ready: function() {
    //     var self = this;

    //     // setTimeout(function() {
    //         // console.log(this.$el );
    //         var $input = $('input', $(self.$el));
    //         // console.log($input);
    //         $input.rules("add", {
    //             required: true,
    //             minlength: 2
    //         });
    //     // }, 1000);
    // }
});
