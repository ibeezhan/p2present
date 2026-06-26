// schema-validate.js — a tiny, dependency-free JSON Schema validator.
//
// Supports just the draft-07 keywords p2present.schema.json actually uses:
//   type, required, properties, items, enum, minimum, maximum, minItems,
//   oneOf, additionalProperties (permissive — extra keys are always allowed).
// It is intentionally small (no $ref, no format, no allOf/anyOf) — enough to
// give authors honest, located feedback in the Builder without a build step.
//
// validate(value, schema) → { valid, errors:[{path, message}] }

export function validate(value, schema) {
  const errors = [];
  walk(value, schema, '', errors);
  return { valid: errors.length === 0, errors };
}

function walk(value, schema, path, errors) {
  if (!schema || typeof schema !== 'object') return;

  // oneOf: exactly one subschema must match (we accept "at least one" — good
  // enough for the timing array|string and thumbnails cases).
  if (Array.isArray(schema.oneOf)) {
    const matched = schema.oneOf.some((sub) => validate(value, sub).valid);
    if (!matched) errors.push({ path: path || '/', message: 'does not match any allowed shape (oneOf)' });
    return;
  }

  if (schema.type && !typeMatches(value, schema.type)) {
    errors.push({ path: path || '/', message: `expected ${Array.isArray(schema.type) ? schema.type.join('|') : schema.type}, got ${typeName(value)}` });
    return; // further checks assume the type held
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push({ path: path || '/', message: `must be one of ${schema.enum.map((e) => JSON.stringify(e)).join(', ')}` });
  }

  if (typeof value === 'number') {
    if (schema.minimum != null && value < schema.minimum) errors.push({ path, message: `must be >= ${schema.minimum}` });
    if (schema.maximum != null && value > schema.maximum) errors.push({ path, message: `must be <= ${schema.maximum}` });
  }

  if (typeName(value) === 'object') {
    for (const key of schema.required || []) {
      if (!(key in value)) errors.push({ path: `${path}/${key}`, message: 'is required' });
    }
    if (schema.properties) {
      for (const [key, sub] of Object.entries(schema.properties)) {
        if (key in value) walk(value[key], sub, `${path}/${key}`, errors);
      }
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems != null && value.length < schema.minItems) {
      errors.push({ path: path || '/', message: `must have at least ${schema.minItems} item(s)` });
    }
    if (schema.items) {
      value.forEach((item, i) => walk(item, schema.items, `${path}/${i}`, errors));
    }
  }
}

function typeName(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (Number.isInteger(v)) return 'integer';
  return typeof v; // 'number','string','boolean','object'
}

function typeMatches(v, type) {
  const types = Array.isArray(type) ? type : [type];
  const actual = typeName(v);
  return types.some((t) =>
    t === actual ||
    (t === 'number' && actual === 'integer') ||
    (t === 'integer' && actual === 'integer'));
}
