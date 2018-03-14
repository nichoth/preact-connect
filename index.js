var preact = require('preact')
var Component = preact.Component
var h = preact.h
var xtend = require('xtend')

function subscribe (state, View) {
    if (!View) return function (_view) {  // curry
        return subscribe(state, _view)
    }

    class Listener extends Component {
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

    return Listener
}

function observe (bus, View) {
    if (!View) return function (_view) {  // curry
        return observe(bus, _view)
    }
    return function Observed (props) {
        return h(View, xtend(props, {
            emit: bus.emit.bind(bus)
        }), props.children)
    }
}

function connect (opts) {
    return subscribe(opts.state, observe(opts.bus, opts.view))
}
connect.subscribe = subscribe
connect.observe = observe

module.exports = connect

