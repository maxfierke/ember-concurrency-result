import Result from 'ember-concurrency-result/result';
import { module, test } from 'qunit';

module('Unit: Result', function() {
  test('success value', function(assert) {
    const obj = new Result(true, 'blahhhh');

    assert.equal(obj.ok, true, 'expected #ok to be false');
    assert.equal(obj.value, 'blahhhh', 'expected #value to return the value passed in');
    assert.equal(obj.error, null, 'expected #error to be null');
  })

  test('error value', function(assert) {
    const error = new Error('a sad happened');
    const obj = new Result(false, error);

    assert.equal(obj.ok, false, 'expected #ok to be false');
    assert.equal(obj.value, null, 'expected #value to be null');
    assert.equal(obj.error, error, 'expected #error to return the error passed in');
  })
});
