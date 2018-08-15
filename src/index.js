import {Vue} from "./Vue";

const template = `<div style="color:{{red}}" @mouseover="setColor()" @click="setMessage()">
<span>点击一下  看效果，滑动一下看效果</span>
  {{ message }}
</div>`

var app = new Vue({
    el: 'body',
    template,
    data: {
        message: 'Hello Vue!',
        red: '#999'
    },
    methods: {
        setColor() {
            this.red = '#de64f7'
        },
        setMessage() {
            this.message = 'nihao'
        }
    }
})
