var { h, render } = require('preact')
var test = require('tape')
var Bus = require('events').EventEmitter
var bus = new Bus()
var connect = require('../index')

test('momoize the event emitters', function (t) {
    var state = State({ hello: 'world' })
    var connectedView = connect({ view: MyView, state: state, bus: bus })

    render(h(connectedView, {}, []), document.body)

    t.plan(3)
    // gross async sets to trigger re-rendering because preact will
    // batch the renders into animation frames
    process.nextTick(function () {
        state.set({ hello: 1 })

        setTimeout(function () {
            state.set({ hello: 2 })
        }, 100)
    })

    var _emit
    function MyView (props) {
        if (!_emit) _emit = props.emit('hello')
        t.equal(_emit, props.emit('hello'),
            'should return the same function')

        return h('form', { onSubmit: _emit }, [
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
            if (listener) listener(_data)
        }
        return state
    }

})

