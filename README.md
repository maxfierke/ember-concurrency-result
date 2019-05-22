# ember-concurrency-result

Proof-of-concept of a Rust-ish `Result` return modifier for ember-concurrency
tasks, based on an idea Alex Machtneer floated in the Ember Community Discord.

Some of this will probably changed.

## Compatibility

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above
* ember-concurrency 0.7.19 or above

## Installation

```
ember install ember-concurrency-result
```

## Usage

### via wrapping of `task`
`ember-concurrency-result` adds a `result` function which can wrap an
ember-concurrency `TaskProperty`. You can use the addon via this wrapping
strategy like below:

```javascript
// components/flaky-component.js
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { result } from 'ember-concurrency-result';
import getWidgetsFromFlakyApi from '../utils/get-widgets';
import UnavailableError from '../utils/errors/unavailable';

export default Component.extend({
  myTask: result(task(function*() {
    return yield getWidgetsFromFlakyApi();
  })),

  someMethod() {
    const lastValue = this.myTask.last.value;

    if (lastValue.ok) {
      const widgets = lastValue.value;

      alert(`There are ${widgets.length} widgets in the widgetry.`);
    } else if (lastValue.error instanceof UnavailableError) {
      alert("Those darn flaky APIs! They're at it again!");
    } else {
      alert('wtf.');
    }
  }
});
```

### via `task` property modifier

The wrapping method above may not look as aesthetically pleasing, so instead, you
may also add a `.result` modifier to ember-concurrency tasks through the
magic of reaching into private APIs! `ember-concurrency-result` provides a
`defineModifier` function that can be used somewhere early in the boot process,
such as `app.js` or in an initializer, which will add a `result` modifier
method to the `TaskProperty` prototype.

```javascript
// app.js
import defineModifier from 'ember-concurrency-result/define-modifier';

defineModifier();

// remainder of app.js...
```

```javascript
// components/flaky-component.js
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { result } from 'ember-concurrency-result';
import getWidgetsFromFlakyApi from '../utils/get-widgets';
import UnavailableError from '../utils/errors/unavailable';

export default Component.extend({
  myTask: task(function*() {
    return yield getWidgetsFromFlakyApi();
  }).result(),

  someMethod() {
    const lastValue = this.myTask.last.value;

    if (lastValue.ok) {
      const widgets = lastValue.value;

      alert(`There are ${widgets.length} widgets in the widgetry.`);
    } else if (lastValue.error instanceof UnavailableError) {
      alert("Those darn flaky APIs! They're at it again!");
    } else {
      alert('wtf.');
    }
  }
});
```

Because this relies on accessing `ember-concurrency`'s `TaskProperty` intimate
API and modifying the prototype for that object, it's *not strictly recommended*,
but should be relatively safe to do, as the chances of that API changing
drastically without a suitable replacement is unlikely.


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
