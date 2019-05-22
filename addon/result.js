import { assert } from '@ember/debug';

export class Result {
  constructor(success, value) {
    this._taskSuccess = success
    this._taskValue = value;
  }

  get ok() {
    return this._taskSuccess;
  }

  get error() {
    if (this.ok) {
      return null;
    } else {
      return this._taskValue;
    }
  }

  get value() {
    if (this.ok) {
      return this._taskValue;
    } else {
      return null;
    }
  }
}

export function result(taskProperty) {
  assert("result() will only work with ember-concurrency >=0.7.19 -- please upgrade", taskProperty.taskFn);

  const baseTaskFn = taskProperty.taskFn;

  taskProperty.taskFn = function* (...args) {
    try {
      const fnResult = yield* baseTaskFn.apply(this, args);

      if (fnResult instanceof Result) {
        return fnResult;
      } else {
        return new Result(true, fnResult);
      }
    } catch (e) {
      return new Result(false, e);
    }
  }

  return taskProperty;
}

export default Result;
