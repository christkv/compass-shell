'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Reflux = require('reflux');
var MongoShellActions = require('../actions');
var StateMixin = require('reflux-state-mixin');
var Readable = require('stream').Readable;
var streams = require('memory-streams');
var stdin = require('mock-stdin').stdin();

var _require = require('mongo-shell'),
    REPL = _require.REPL,
    ExtJSON = _require.ExtJSON,
    Db = _require.Db,
    CursorResult = _require.CursorResult;

var vm = require('vm');
var debug = require('debug')('mongodb-compass:stores:mongo-shell');

function renderUseDbs(object) {
  return '<table>\n<thead>\n  <tr><th>Name</th><th>Size on Disk</th><th>Empty</th></tr>\n</thead>\n<tbody>\n  ' + object.databases.map(function (db) {
    return '<tr><td>' + db.name + '</td><td>' + db.sizeOnDisk + '</td><td>' + db.empty + '</td></tr>';
  }).join('\n') + '\n</tbody>\n</table>';
}

function renderCommand(string) {
  return '<strong>' + string + '</string>';
}

function renderJSONArrayFlat(array) {
  return '' + array.map(function (item) {
    return item + '<br/>';
  });

  // return array.join('</p>');
  //   return `<ul>
  //   ${array.map(item => {
  //     return `<li>${item}</li>`
  //   })}
  // </ul>`
}

function renderJSONObject(object) {}

/**
 * Mongo Shell store.
 */
var MongoShellStore = Reflux.createStore({
  /**
   * adds a state to the store, similar to React.Component's state
   * @see https://github.com/yonatanmn/Super-Simple-Flux#reflux-state-mixin
   *
   * If you call `this.setState({...})` this will cause the store to trigger
   * and push down its state as props to connected components.
   */
  mixins: [StateMixin.store],

  /**
   * listen to all actions defined in ../actions/index.jsx
   */
  listenables: MongoShellActions,

  /**
   * Initialize everything that is not part of the store's state.
   */
  init: function init() {},


  /**
   * This method is called when all plugins are activated. You can register
   * listeners to other plugins' stores here, e.g.
   *
   * appRegistry.getStore('OtherPlugin.Store').listen(this.otherStoreChanged.bind(this));
   *
   * If this plugin does not depend on other stores, you can delete the method.
   *
   * @param {Object} appRegistry   app registry containing all stores and components
   */
  onActivated: function onActivated(appRegistry) {},


  /**
   * This method is called when the data service is finished connecting. You
   * receive either an error or the connected data service object, and if the
   * connection was successful you can now make calls to the database, e.g.
   *
   * dataService.command('admin', {connectionStatus: 1}, this.handleStatus.bind(this));
   *
   * If this plugin does not need to talk to the database, you can delete this
   * method.
   *
   * @param {Object} error         the error object if connection was unsuccessful
   * @param {Object} dataService   the dataService object if connection was successful
   *
   */
  onConnected: function onConnected(error, dataService) {},


  /**
   * Initialize the Mongo Shell store state. The returned object must
   * contain all keys that you might want to modify with this.setState().
   *
   * @return {Object} initial store state.
   */
  getInitialState: function getInitialState() {
    return {
      text: '', results: []
    };
  },
  execute: function execute(text) {
    var self = this;

    var _state = this.state,
        repl = _state.repl,
        results = _state.results;

    // Special commands

    if (text.trim() === 'clear') {
      return self.setState({
        results: []
      });
    }

    // Eval code
    repl.__eval(text, null, '', function (err, r) {
      var result = [renderCommand(text), r];

      // Render the use dbs
      if (text.indexOf('show dbs') != -1) {
        result = [renderCommand(text), renderUseDbs(r)];
      } else if (text.indexOf('show collections') != -1) {
        result = [renderCommand(text), renderJSONArrayFlat(r)];
      } else if (r instanceof CursorResult) {
        result = [renderCommand(text), r.documents];
        if (r.hasMore) {
          result.push('<strong>Type "it" for more</strong>');
        }
      } else if (result != null && (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {}

      // Set the state
      self.setState({
        results: results.concat(result)
      });
    });
  },
  initialize: function initialize() {
    var self = this;

    var execute = async function execute() {
      // Init context
      var initContext = Object.assign({}, global, {});

      // Create a context for execution
      var context = vm.createContext(initContext);

      // Get the current MongoClient
      var client = global.hadronApp.dataService.client.database;

      // Make a direct connection
      var state = {
        client: client, context: context, connectionOptions: null, configuration: null,
        plugins: []
      };

      // Add the db proxy
      context.db = Db.proxy(client.s.databaseName, state);

      // Create a repl
      var replServer = new REPL(state, {
        plugins: [], log: console.log, render: 'json'
      });

      // Set the repl on the state
      self.setState({ repl: replServer });
    };

    execute().then(function () {
      // console.log("successful connect")
    }).catch(function (err) {
      // console.log("successful error")
      // console.log(err)
    });
  },


  /**
   * log changes to the store as debug messages.
   * @param  {Object} prevState   previous state.
   */
  storeDidUpdate: function storeDidUpdate(prevState) {
    debug('MongoShell store changed from', prevState, 'to', this.state);
  }
});

module.exports = MongoShellStore;