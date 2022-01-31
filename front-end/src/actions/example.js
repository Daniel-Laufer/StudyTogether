export const EXAMPLE_ACTION_CONSTANT = 'HELLOWORLD';

export function exampleAction(someArgument) {
  return { type: EXAMPLE_ACTION_CONSTANT, name: someArgument };
}
