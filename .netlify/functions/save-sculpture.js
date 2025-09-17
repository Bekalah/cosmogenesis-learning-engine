export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'POST only' }) };
  }
  let manifest = {};
  try {
    manifest = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }
  const author = {
    name: 'Rebecca Respawn',
    orcid: '0009-0002-2834-3956',
    affiliation: 'Cathedral of Circuits - Circuitum99 / Codex 144:99'
  };
  const stamped = { ...manifest, author };
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stamped)
  };
}
