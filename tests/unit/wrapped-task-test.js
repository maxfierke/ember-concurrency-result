import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import { result, Result } from 'ember-concurrency-result';

module('Unit: wrapped task use', function() {
  test("`TaskProperty`s can be extended as result by wrapping the task: success", function(assert) {
    assert.expect(3);

    const done = assert.async(1);

    let Obj = EmberObject.extend({
      doStuff: result(task(function * () {
        return yield 'why do people use the term monad? it is confusing';
      }))
    });

    let obj, taskInstance;

    run(() => {
      obj = Obj.create();
      taskInstance = obj.get('doStuff').perform();
    });

    const ret = taskInstance.value;
    assert.ok(ret instanceof Result.Ok, 'expected return value to be a Result.Ok');
    assert.equal(ret.isOk(), true, 'expected Result#isOk to be true');
    assert.equal(
      ret.value,
      'why do people use the term monad? it is confusing',
      'expected task return as Return#value'
    );

    done();
  });

  test("`TaskProperty`s can be extended as result by wrapping the task: failure", function(assert) {
    assert.expect(3);

    const done = assert.async(1);

    const error = new Error("EVERYTHING IS ON FIREEEE!!!!");

    let Obj = EmberObject.extend({
      // eslint-disable-next-line require-yield
      doStuff: result(task(function * () {
        throw error;
      }))
    });

    let obj, taskInstance;

    run(() => {
      obj = Obj.create();
      taskInstance = obj.get('doStuff').perform();
    });

    const ret = taskInstance.value;
    assert.ok(ret instanceof Result.Err, 'expected return value to be a Result.Err');
    assert.equal(ret.isErr(), true, 'expected Result#isErr to be true');
    assert.equal(
      ret.error,
      error,
      'expected Return#error to be the task error'
    );

    done();
  });

  test("doesn't double wrap results", function(assert) {
    assert.expect(3);

    const done = assert.async(1);

    let Obj = EmberObject.extend({
      doStuff: result(task(function * () {
        return yield 'why do people use the term monad? it is confusing';
      })),

      doOtherStuff: result(task(function *() {
        return yield this.get('doStuff').perform();
      }))
    });

    let obj, taskInstance;

    run(() => {
      obj = Obj.create();
      taskInstance = obj.get('doOtherStuff').perform();
    });

    const ret = taskInstance.value;
    assert.ok(ret instanceof Result.Ok, 'expected return value to be a Result.Ok');
    assert.equal(ret.isOk(), true, 'expected Result#isOk to be true');
    assert.equal(
      ret.value,
      'why do people use the term monad? it is confusing',
      'expected task return as Return#value'
    );

    done();
  });
});
