import printMid from './solution.js';
import assert from 'node:assert/strict';

assert.strictEqual(printMid(2), -1);
assert.strictEqual(printMid(3), '21');
assert.strictEqual(printMid(5), '12');
assert.strictEqual(printMid(8), '21');
assert.strictEqual(printMid(101), -1);
