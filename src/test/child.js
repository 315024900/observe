import Vue from '../core/Vue';

const template = `<div>
<div>
我是子元素
</div>
<input >
父元素的值  {{ message }}
</div>`;
/* eslint-disable-next-line no-unused-vars */
const app = new Vue({

    template,
    data: {
        message: 'Hello Vue!',
        red: '#999',
    },
    methods: {
        setColor($event) {
            if ($event) {
                this.red = $event.target.value
            } else {
                this.red = '#4044f7';
            }
        },
        setMessage(info) {
            this.message = info;
        },
    },
});
