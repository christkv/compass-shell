const MongoShellComponent = require('./lib/components');
const MongoShellActions = require('./lib/actions');
const MongoShellStore = require('./lib/stores');

/**
 * A sample role for the component.
 */
const ROLE = {
  name: 'MongoShell',
  component: MongoShellComponent
};

/**
 * Activate all the components in the Mongo Shell package.
 */
function activate() {
  // Register the MongoShellComponent as a role in Compass
  //
  // Available roles are:
  //   - Instance.Tab
  //   - Database.Tab
  //   - Collection.Tab
  //   - CollectionHUD.Item
  //   - Header.Item

  global.hadronApp.appRegistry.registerRole('Instance.Tab', ROLE);
  global.hadronApp.appRegistry.registerAction('MongoShell.Actions', MongoShellActions);
  global.hadronApp.appRegistry.registerStore('MongoShell.Store', MongoShellStore);
}

/**
 * Deactivate all the components in the Mongo Shell package.
 */
function deactivate() {
  global.hadronApp.appRegistry.deregisterRole('Instance.Tab', ROLE);
  global.hadronApp.appRegistry.deregisterAction('MongoShell.Actions');
  global.hadronApp.appRegistry.deregisterStore('MongoShell.Store');
}

module.exports = MongoShellComponent;
module.exports.activate = activate;
module.exports.deactivate = deactivate;
