const { test } = require("node:test");
const assert = require("node:assert/strict");
const { format } = require("../src/format.cjs");
test("normalizes text", () => assert.equal(format(" hi "), "HI"));
