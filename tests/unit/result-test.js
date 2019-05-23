import Result from 'ember-concurrency-result/result';
import { module, test } from 'qunit';

module('Unit: Result', function() {
  test('success value', function(assert) {
    const obj = Result.ok('blahhhh');

    assert.equal(obj.isOk(), true, 'expected #isOk to be true');
    assert.equal(obj.value, 'blahhhh', 'expected #value to return the value passed in');
  })

  test('error value', function(assert) {
    const error = new Error('a sad happened');
    const obj = Result.err(error);

    assert.equal(obj.isErr(), true, 'expected #isErr to be true');
    assert.equal(obj.error, error, 'expected #error to return the error passed in');
  })
});
