/* ============================================================
   chat-proxy.js — Cloudflare Worker
   Atech Multimedia Entertainment

   WHAT THIS DOES:
   This Worker sits between your website and the Anthropic API.
   Your API key lives here (server-side) — never in the browser.

   HOW TO DEPLOY (free, 5 minutes):
   1. Go to https://workers.cloudflare.com and sign up free
   2. Create a new Worker named "atech-chat-proxy"
   3. Paste this entire file as the Worker code
   4. Go to Settings → Variables → Add variable:
        Name:  ANTHROPIC_API_KEY
        Value: your sk-ant-... key  (tick "Encrypt")
   5. Deploy the Worker
   6. Copy the Worker URL (e.g. https://atech-chat-proxy.yourname.workers.dev)
   7. In js/main.js, update:
        var CHAT_PROXY_URL = 'https://atech-chat-proxy.yourname.workers.dev';
   8. Done — the API key is now secure.

   CORS:
   The Worker allows requests only from your domain.
   Update ALLOWED_ORIGIN below to match your live domain.
============================================================ */

var ALLOWED_ORIGIN = 'https://atechmultimedia.com'; // ← update to your domain
var ANTHROPIC_API  = 'https://api.anthropic.com/v1/messages';
var MODEL          = 'claude-sonnet-4-20250514';
var MAX_TOKENS     = 1000;

addEventListener('fetch', function (event) {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }

  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders() });
  }

  var body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders())
    });
  }

  // Validate required fields
  if (!body.messages || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: 'Missing messages array' }), {
      status: 400,
      headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders())
    });
  }

  // Limit conversation history to last 20 messages to control costs
  var messages = body.messages.slice(-20);

  // Forward to Anthropic — API key is read from Worker environment variable
  var anthropicResponse = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         ANTHROPIC_API_KEY,  // set in Cloudflare Worker env vars
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: MAX_TOKENS,
      system:     body.system || '',
      messages:   messages
    })
  });

  var data = await anthropicResponse.json();

  return new Response(JSON.stringify(data), {
    status:  anthropicResponse.status,
    headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders())
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
