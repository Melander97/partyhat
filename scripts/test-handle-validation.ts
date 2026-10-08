/**
 * Verifies validateHandle: normalization, length limits, character rules,
 * and rejection of non-string input. Pure function, so no database or dev
 * server needed.
 *
 * Run: npx tsx scripts/test-handle-validation.ts
 */
import {
  validateHandle,
  HANDLE_MIN_LENGTH,
  HANDLE_MAX_LENGTH,
} from '../src/lib/leaderboard/handle';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  ✓ ${message}`);
}

function accepts(input: unknown, expected: string, label: string) {
  const result = validateHandle(input);
  assert(result.ok && result.handle === expected, `${label} → "${expected}"`);
}

function rejects(input: unknown, label: string) {
  const result = validateHandle(input);
  assert(!result.ok, `rejects ${label}`);
}

console.log('1. Valid handles and normalization');
accepts('Alex', 'Alex', 'plain name');
accepts('  Alex  ', 'Alex', 'surrounding whitespace is trimmed');
accepts('Iron   Man', 'Iron Man', 'runs of spaces collapse to one');
accepts('a_b-c 9', 'a_b-c 9', 'underscores, hyphens, digits and spaces are allowed');

console.log('\n2. Length limits');
accepts('a'.repeat(HANDLE_MIN_LENGTH), 'a'.repeat(HANDLE_MIN_LENGTH), 'exactly the minimum length');
accepts('a'.repeat(HANDLE_MAX_LENGTH), 'a'.repeat(HANDLE_MAX_LENGTH), 'exactly the maximum length');
rejects('a'.repeat(HANDLE_MIN_LENGTH - 1), 'one character under the minimum');
rejects('a'.repeat(HANDLE_MAX_LENGTH + 1), 'one character over the maximum');
rejects('  a ', 'a name that is too short only after trimming');
rejects('', 'an empty string');

console.log('\n3. Non-string input (raw request bodies can be anything)');
rejects(123, 'a number');
rejects(null, 'null');
rejects(undefined, 'undefined');
rejects({ handle: 'Alex' }, 'an object');
rejects(['Alex'], 'an array');

console.log('\n4. Disallowed characters');
rejects('<script>', 'HTML-looking input');
rejects('Alex!', 'punctuation');
rejects('café', 'non-ASCII letters');
rejects('Alex🎩', 'emoji');
rejects('tab\tname', 'an embedded tab');
rejects('line\nbreak', 'an embedded newline');

console.log('\n5. Must contain a letter or number');
rejects('___', 'underscores only');
rejects('---', 'hyphens only');
rejects('- - -', 'hyphens and spaces only');

console.log('\nAll checks passed.');
