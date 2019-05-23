import { assert } from '@ember/debug';
import Result from 'true-myth/result';

export function result(taskProperty) {
  assert("result() will only work with ember-concurrency >=0.7.19 -- please upgrade", taskProperty.taskFn);

  const baseTaskFn = taskProperty.taskFn;

  taskProperty.taskFn = function* (...args) {
    try {
      const fnResult = yield* baseTaskFn.apply(this, args);

      if (fnResult instanceof Result.Ok || fnResult instanceof Result.Err) {
        return fnResult;
      } else {
        return Result.ok(fnResult);
      }
    } catch (e) {
      return Result.err(e);
    }
  }

  return taskProperty;
}

export default Result;
export { default as Result } from 'true-myth/result';
