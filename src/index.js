import {Vue} from "./Vue";

const Template = `<div style="color:red">
<span>23423</span>
  {{ message }}
</div>`

var app = new Vue({
    el: Template,
    data: {
        message: 'Hello Vue!'
    }
})
