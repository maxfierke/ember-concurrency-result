import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit: function context binding', function() {
  test("ember-concurrency-result will preserve taskFn binding & args", function(assert) {
    assert.expect(2);

    const done = assert.async(1);

    const queryRecordStub = sinon.stub();

    let Obj = EmberObject.extend({
      init() {
        this._super(...arguments);

        this.set('store', {
          queryRecord: queryRecordStub
        })
      },
      getAThing: task(function* (value) {
        yield this.store.queryRecord('blahh', value);
      }).result()
    });

    let obj;

    run(() => {
      obj = Obj.create();

      obj.get('getAThing').perform(123);

      assert.ok(queryRecordStub.calledOnce, "expected queryRecord to have been called");
      assert.ok(queryRecordStub.calledWith('blahh', 123), "expected arguments to make their way through");
      done();
    });
  });
});
