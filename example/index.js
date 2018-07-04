var { h, render } = require('preact')
var Bus = require('events').EventEmitter
var bus = new Bus()
var connect = require('../index')

var state = State({ hello: 'world' })
var _view = connect({ view: MyView, state: state, bus: bus })

bus.on('hello', console.log.bind(console, 'hello event'))
bus.on('hello', function (ev) {
    ev.preventDefault()
    state.set({ hello: ev.target.elements.hello.value })
})

render(h(_view, {}, []), document.body)


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

