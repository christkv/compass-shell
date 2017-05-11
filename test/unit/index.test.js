const expect = require('chai').expect;
const MongoShellStore = require('../../lib/stores');

describe('MongoShellStore', function() {
  beforeEach(function() {
    // reset the store to initial values
    MongoShellStore.setState(MongoShellStore.getInitialState());
  });

  it('should have an initial state of {status: \'enabled\'}', function() {
    expect(MongoShellStore.state.status).to.be.equal('enabled');
  });

  describe('toggleStatus()', function() {
    it('should switch the state to {status: \'disabled\'}', function() {
      MongoShellStore.toggleStatus();
      expect(MongoShellStore.state.status).to.be.equal('disabled');
    });

    it('should switch the state back to {status: \'enabled\'} when used a second time', function() {
      MongoShellStore.toggleStatus();
      MongoShellStore.toggleStatus();
      expect(MongoShellStore.state.status).to.be.equal('enabled');
    });
  });
});
