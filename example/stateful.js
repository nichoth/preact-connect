var { h, render } = require('preact')
var State = require('@nichoth/state')
var Stateful = require('../')

var DemoStore = State.extend({
    _state: {
        hello: 'world'
    },

    hello: function (ev) {
        this._state.hello = ev.target.value
        return this.publish()
    }
})

function myComponent ({ state, call }) {
    return h('div', {}, [
        h('p', {}, 'hello ' + state.hello),
        h('input', { type: 'text', onInput: call('hello') }, [])
    ])
}

var app = h(Stateful, { store: DemoStore, render: myComponent }, ['aaaaaaa'])
render(app, document.body)

