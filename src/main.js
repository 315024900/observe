import Vue from './core/Vue';

const template = `<div style="color:{{red}}" @mouseover="setColor()" @click="setMessage('变了哦')">
<div>点击一下  看效果，滑动一下看效果</div>
<input @input="setMessage($event.target.value)">
  {{ message }}
</div>`;
/* eslint-disable-next-line no-unused-vars */
const app = new Vue({
  el: 'body',
  template,
  data: {
    message: 'Hello Vue!',
    red: '#999',
  },
  methods: {
    setColor($event) {
      if ($event) {
        this.red = $event.target.value;
      } else {
        this.red = '#4044f7';
      }
    },
    setMessage(info) {
      this.message = info;
    },
  },
});
