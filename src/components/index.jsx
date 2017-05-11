const React = require('react');
const { StoreConnector } = require('hadron-react-components');
const MongoShellComponent = require('./Mongo Shell');
const Store = require('../stores');
const Actions = require('../actions');

// const debug = require('debug')('mongodb-compass:mongo-shell:index');

class ConnectedMongoShellComponent extends React.Component {
  /**
   * Connect MongoShellComponent to store and render.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <StoreConnector store={Store}>
        <MongoShellComponent actions={Actions} {...this.props} />
      </StoreConnector>
    );
  }
}

ConnectedMongoShellComponent.displayName = 'ConnectedMongoShellComponent';

module.exports = ConnectedMongoShellComponent;
