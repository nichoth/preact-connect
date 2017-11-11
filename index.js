var preact = require('preact')
var Component = preact.Component
var h = preact.h
var xtend = require('xtend')

function subscribe (state, View) {
    if (!View) return function (_view) {  // curry
        return subscribe(state, _view)
    }

    return class extends Component {
        constructor (props) {
            super(props)
            this.state = state()
        }

        componentDidMount () {
            var self = this
            this.stopListening = state(function onChange (data) {
                self.setState(data)
            })
        }

        componentWillUnmount () {
            this.stopListening()
        }

        render (props, state) {
            return h(View, xtend(props, state), props.children)
        }
    }
}

function observe (bus, View) {
    if (!View) return function (_view) {  // curry
        return observe(bus, _view)
    }
    return function Observed (props) {
        return h(View, xtend(props, {
            emit: function _emit (eventName, data) {
                if (data === undefined) return function (_data) {
                    return _emit(eventName, _data)
                }
                return bus.emit(eventName, data)
            }
        }), props.children)
    }
}

function connect (state, bus, view) {
    return subscribe(state, observe(bus, view))
}
connect.subscribe = subscribe
connect.observe = observe

module.exports = connect

