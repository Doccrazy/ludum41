import CommandRegistry from './CommandRegistry'

it('runs simple commands', () => {
  const registry = new CommandRegistry();
  const mock = jest.fn();
  registry.register('test', mock);
  registry.handle('test 123');
  expect(mock).toHaveBeenCalledWith('123');
});

it('runs nested commands', () => {
  const registry = new CommandRegistry();
  const sub = registry.register('test');
  const mock = jest.fn();
  sub.register('foo', mock);
  registry.handle('test foo 1 2');
  expect(mock).toHaveBeenCalledWith('1 2');
});

it('passes along arguments', () => {
  const registry = new CommandRegistry();
  const sub = registry.register('test');
  const mock = jest.fn();
  sub.register('foo', mock);
  registry.handle('test foo 1 2', 'arg1', 'arg2');
  expect(mock).toHaveBeenCalledWith('1 2', 'arg1', 'arg2');
});

it('returns results', () => {
  const registry = new CommandRegistry();
  const sub = registry.register('test');
  const mock = jest.fn();
  mock.mockReturnValue(42);
  sub.register('foo', mock);
  const result = registry.handle('test foo');
  expect(result).toBe(42);
});

it('allows shortened commands', () => {
  const registry = new CommandRegistry();
  const sub = registry.register('test');
  const mock = jest.fn();
  sub.register('foo', mock);
  registry.handle('t f');
  expect(mock).toHaveBeenCalled();
});

it('should still accept fuzzy matches to the same alias', () => {
  const registry = new CommandRegistry();
  const sub = registry.register('test');
  const mock = jest.fn();
  sub.register('foo', mock);
  sub.register('fuu', mock);
  registry.handle('t f');
  expect(mock).toHaveBeenCalled();
});

it('ignores excess whitespace', () => {
  const registry = new CommandRegistry();
  const sub = registry.register('test');
  const mock = jest.fn();
  sub.register('foo', mock);
  registry.handle('  test     foo   ');
  expect(mock).toHaveBeenCalled();
});

it('reports errors', () => {
  const registry = new CommandRegistry();
  const sub = registry.register('test');
  const mock = jest.fn();
  sub.register('foo', mock);
  expect(registry.handle('bar')).toBeInstanceOf(Error);
  expect(registry.handle('test')).toBeInstanceOf(Error);
  expect(registry.handle('test bar')).toBeInstanceOf(Error);
  expect(mock).not.toHaveBeenCalled();
});
