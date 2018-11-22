var { h, render } = require('preact')
var test = require('tape')
var Bus = require('events').EventEmitter
var bus = new Bus()
var connect = require('../index')

test('preact connect', function (t) {
    t.plan(2)
    var state = State({ hello: 'world' })
    var connectedView = connect({ view: MyView, state: state, bus: bus })

    render(h(connectedView, {}, []), document.body)

    function MyView (props) {
        t.equal(props.hello, 'world', "doesn't blow up")
        t.equal(typeof props.emit, 'function', 'should pass down emitter')

        return h('form', {}, [
            h('h1', {}, ['hello ' + props.hello]),
            h('input', { type: 'text', name: 'hello' }, []),
            h('br', {}, []),
            h('button', { type: 'submit' }, ['hello'])
        ])
    }
})

function State (data) {
    var listener

    function state (_listener) {
        if (!_listener) return data
        listener = _listener
    }

    state.set = function (_data) {
        if (listener) listener(_data)
    }
    return state
}


