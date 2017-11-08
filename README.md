# preact connect

Observe view events and subscribe to state changes

## install

    $ npm install @nichoth/preact-connect

## example

```js
var { h, render } = require('preact')
var connect = require('../')
var Bus = require('events').EventEmitter
var bus = new Bus()
var state = State({ hello: 'world' })

var view = connect.subscribe(state, connect.observe(bus, MyView))

bus.on('hello', console.log.bind(console, 'hello event'))
bus.on('hello', function (ev) {
    ev.preventDefault()
    state.set({ hello: ev.target.elements.hello.value })
})

render(h(view, {}, []), document.body)


// ------------------------------

function MyView (props) {
    return h('form', { onSubmit: props.emit('hello') }, [
        h('h1', {}, ['hello ' + props.hello]),
        h('input', { type: 'text', name: 'hello' }, []),
        h('br', {}, []),
        h('button', { type: 'submit' }, ['hello'])
    ])
}

function State (data) {
    var listener
    function state (_listener) {
        if (!_listener) return data
        listener = _listener
    }
    state.set = function (_data) {
        data = _data
        if (listener) listener(data)
    }
    return state
}
```
