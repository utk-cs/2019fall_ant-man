const callSql = require('./createDB');

test('does callSql work?', () => {
  expect(callSql("hello")).toBe("hello");
});