export function calculate(expression) {
  if (!/^[\d\s()+\-*/%.]+$/.test(expression)) return null;
  const tokens = expression.match(/\d+(?:\.\d+)?|[()+\-*/%]/g) || [];
  let position = 0;
  const peek = () => tokens[position];
  const take = () => tokens[position++];

  function primary() {
    if (peek() === '(') {
      take();
      const value = addition();
      if (take() !== ')') throw new Error('parenthesis');
      return value;
    }
    if (peek() === '-') { take(); return -primary(); }
    const value = Number(take());
    if (!Number.isFinite(value)) throw new Error('number');
    return value;
  }

  function multiplication() {
    let value = primary();
    while (['*', '/', '%'].includes(peek())) {
      const operator = take();
      const right = primary();
      if ((operator === '/' || operator === '%') && right === 0) throw new Error('zero');
      value = operator === '*' ? value * right : operator === '/' ? value / right : value % right;
    }
    return value;
  }

  function addition() {
    let value = multiplication();
    while (['+', '-'].includes(peek())) value = take() === '+' ? value + multiplication() : value - multiplication();
    return value;
  }

  try {
    const result = addition();
    return position === tokens.length && Number.isFinite(result) ? Number(result.toFixed(10)) : null;
  } catch { return null; }
}
