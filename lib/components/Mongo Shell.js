'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactJsonView = require('react-json-view');

var _reactJsonView2 = _interopRequireDefault(_reactJsonView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var MongoShellActions = require('../actions');
var ToggleButton = require('./toggle-button');
var ReactDOM = require('react-dom');

var ExtJSON = require('mongodb-extjson');

// Keys
var TABKEY = 9;
var RETURN = 13;
var BACKSPACE = 8;
var DELETE = 46;
var extJSON = new ExtJSON();

var MongoShellComponent = function (_React$Component) {
  _inherits(MongoShellComponent, _React$Component);

  function MongoShellComponent() {
    _classCallCheck(this, MongoShellComponent);

    return _possibleConstructorReturn(this, (MongoShellComponent.__proto__ || Object.getPrototypeOf(MongoShellComponent)).apply(this, arguments));
  }

  _createClass(MongoShellComponent, [{
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      // Special handling for TAB and RETURN key
      if (e.keyCode == TABKEY) {
        if (e.preventDefault) e.preventDefault();
        return false;
      } else if (e.keyCode == RETURN) {
        if (e.preventDefault) e.preventDefault();

        // Unpack the state
        var text = this.state.text;

        // Execute the statement

        this.props.actions.execute(text);
        // Reset the input value
        this.setState({ text: '' });
        // Stop propegating
        return false;
      }

      // Skip if we have backspace
      if (e.keyCode == BACKSPACE || e.keyCode == DELETE) {
        return true;
      }

      // Ignore any meta-keys
      if (e.which !== 0 && !e.ctrlKey && !e.metaKey && !e.altKey) {}
    }
  }, {
    key: 'onChange',
    value: function onChange(e) {
      this.setState({
        text: e.target.value
      });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.actions.initialize();
      global.a = this;
      // Set empty state of component
      this.setState({
        text: ''
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.divEl.scrollTop = this.divEl.scrollHeight;
      // const output = ReactDOM.findDOMNode(this.refs.output);
      // output.scrollTop = output.scrollHeight;
    }

    /**
     * Render MongoShell component.
     *
     * @returns {React.Component} The rendered component.
     */

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var results = this.props.results;
      var text = this.state.text;


      var elementRender = results.map(function (e, i) {
        if (e != null && (typeof e === 'undefined' ? 'undefined' : _typeof(e)) == 'object') {
          // return (<span><ReactJson key={i.toString()} src={JSON.parse(extJSON.stringify(e))} /></span>)
          return React.createElement(
            'span',
            null,
            extJSON.stringify(e, null, 2)
          );
        } else {
          return React.createElement('span', { key: i.toString(), dangerouslySetInnerHTML: { __html: e } });
        }
      });

      return React.createElement(
        'div',
        { className: 'mongo-shell' },
        React.createElement(
          'div',
          { className: 'output' },
          React.createElement(
            'pre',
            { ref: function ref(r) {
                _this2.divEl = r;
              } },
            elementRender
          )
        ),
        React.createElement(
          'div',
          { className: 'input' },
          React.createElement('input', {
            onChange: this.onChange.bind(this),
            onKeyDown: this.onKeyDown.bind(this),
            value: text
          })
        )
      );
    }
  }]);

  return MongoShellComponent;
}(React.Component);

MongoShellComponent.propTypes = {
  status: PropTypes.oneOf(['enabled', 'disabled'])
};

MongoShellComponent.defaultProps = {
  status: 'enabled'
};

MongoShellComponent.displayName = 'MongoShellComponent';

module.exports = MongoShellComponent;