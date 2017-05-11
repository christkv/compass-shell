const React = require('react');
const PropTypes = require('prop-types');
const MongoShellActions = require('../actions');
const ToggleButton = require('./toggle-button');
const ReactDOM = require('react-dom');
import ReactJson from 'react-json-view';
const ExtJSON = require('mongodb-extjson');

// Keys
const TABKEY = 9;
const RETURN = 13;
const BACKSPACE = 8;
const DELETE = 46;
const extJSON = new ExtJSON();

class MongoShellComponent extends React.Component {
  onKeyDown(e) {
    // Special handling for TAB and RETURN key
    if(e.keyCode == TABKEY) {
      if(e.preventDefault) e.preventDefault();
      return false;
    } else if(e.keyCode == RETURN) {
      if(e.preventDefault) e.preventDefault();

      // Unpack the state
      const {
        text
      } = this.state;

      // Execute the statement
      this.props.actions.execute(text);
      // Reset the input value
      this.setState({ text: '', });
      // Stop propegating
      return false;      
    }

    // Skip if we have backspace
    if(e.keyCode == BACKSPACE || e.keyCode == DELETE) {
      return true;
    }

    // Ignore any meta-keys
    if (e.which !== 0 &&
      !e.ctrlKey && !e.metaKey && !e.altKey
    ) {
    }
  }
  
  onChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  componentWillMount() {
    this.props.actions.initialize();
    global.a = this;
    // Set empty state of component
    this.setState({
      text: '',
    });
  }

  componentDidUpdate() {
    this.divEl.scrollTop = this.divEl.scrollHeight;
    // const output = ReactDOM.findDOMNode(this.refs.output);
    // output.scrollTop = output.scrollHeight;
  }

  /**
   * Render MongoShell component.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    let {
      results
    } = this.props;

    let {
      text
    } = this.state;

    var elementRender = results.map((e, i) => {
      if(e != null && typeof e == 'object') {
        // return (<span><ReactJson key={i.toString()} src={JSON.parse(extJSON.stringify(e))} /></span>)
        return (<span>{extJSON.stringify(e, null, 2)}</span>);
      } else {
        return (<span key={i.toString()} dangerouslySetInnerHTML={{__html: e}}/>);
      }
    });

    return (
      <div className="mongo-shell">
        <div className="output">
          <pre ref={r => { this.divEl = r }}>
            {elementRender}
          </pre>
        </div>
        <div className="input">
          <input    
            onChange={this.onChange.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
            value={text}
          />
        </div>
      </div>
    );
  }
}

MongoShellComponent.propTypes = {
  status: PropTypes.oneOf(['enabled', 'disabled'])
};

MongoShellComponent.defaultProps = {
  status: 'enabled'
};

MongoShellComponent.displayName = 'MongoShellComponent';

module.exports = MongoShellComponent;
