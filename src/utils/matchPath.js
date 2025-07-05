/**
 * Match a request path against a route pattern and extract params.
 * Supports dynamic segments (e.g., :id) and wildcard (*) at the end.
 *
 * Example:
 *   matchPath('/chat/123', '/chat/:room') => { match: true, params: { room: '123' } }
 *   matchPath('/chat/123/messages', '/chat/:room/*') => { match: true, params: { room: '123' } }
 */

function normalize(path) {
  return path.replace(/\/+$/, '') || '/';
}

function matchPath(path, pattern) {
  const params = {};
  const pathParts = normalize(path).split('/');
  const patternParts = normalize(pattern).split('/');

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    const actual = pathParts[i];

    if (p === '*') return { match: true, params };
    if (!actual) return { match: false };

    if (p.startsWith(':')) {
      params[p.slice(1)] = actual;
    } else if (p !== actual) {
      return { match: false };
    }
  }

  // Extra segments after last pattern segment (if not wildcard)
  if (pathParts.length > patternParts.length && patternParts.at(-1) !== '*') {
    return { match: false };
  }

  return { match: true, params };
}

module.exports = { matchPath };
