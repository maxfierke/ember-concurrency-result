import { result } from './result';
import { TaskProperty } from 'ember-concurrency/-task-property';

/*
 * Define a .result() modifier on TaskProperty
 * Woohoo extending private object prototypes!
 */
export default function defineModifier() {
  TaskProperty.prototype.result = function () {
    return result(this);
  };
}
