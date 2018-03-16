var Component = require('preact').Component
function id (ev) {
    return ev
}

class Stateful extends Component {
    constructor(props) {
        super(props)
        var store = this._store = props.store()
        this._cache = {}
        this.state = store.state()
    }

    componentDidMount() {
        var self = this
        this._unsub = this._store.state(function onChange (state) {
            self.setState.call(self, state)
        })
    }

    componentWillUnmount() {
        this._unsub()
    }

    _call(method, predicate) {
        predicate = predicate || id
        var self = this
        if (this._cache[method]) return this._cache[method]
        var fn = this._store[method]
        if (!fn) throw new Error(method + ' is not a function')
        this._cache[method] = function (ev) {
            self._store[method].call(self._store, predicate(ev))
        }
        return this._cache[method]
    }

    render(props, state) {
        console.log('here', props, state)
        var self = this
        return props.render({ state, call: function () {
            return self._call.apply(self, arguments)
        } })
    }
}

module.exports = Stateful

