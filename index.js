var xtend = require('xtend')
var inherits = require('inherits')
var preact = require('preact')
var Component = preact.Component
var h = preact.h

function subscribe (state, View) {
    function Listener () {
        Component.apply(this, arguments)
        this.state = state()
    }

    inherits(Listener, Component)

    Listener.prototype.componentDidMount = function () {
        var self = this
        this.stopListening = state(function onChange (data) {
            self.setState(data)
        })
    }

    Listener.prototype.componentWillUnmount = function () {
        this.stopListening()
    }

    Listener.prototype.render = function (props, state) {
        return h(View, xtend(props, state), props.children)
    }

    return Listener
}

function observe (bus, View) {
    function emit () {
        return bus.emit.apply(bus, arguments)
    }

    return function ObservedComponent (props) {
        return h(View, xtend(props, {
            emit: emit
        }), props.children)
    }
}

function connect (opts) {
    var _view = subscribe(opts.state, observe(opts.bus, opts.view))
    return _view
}

connect.subscribe = subscribe
connect.observe = observe
module.exports = connect

