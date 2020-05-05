const hijackedClientIds = {};
const hijackedIds = {};
self.addEventListener('message', e => {
  const {
    data
  } = e;
  // console.log('service worker got message', data);
  const {
    method
  } = data;
  if (method === 'hijack') {
    const {
      id,
      files
    } = data;
    hijackedIds[id] = files;
  } else {
    console.warn('unknown method', method);
  }
  /* const {method} = data;
  if (method === 'redirect') {
    const {src, dst} = data;
    let redirectsArray = redirects[src];
    if (!redirectsArray) {
      redirectsArray = [];
      redirects[src] = redirectsArray;
    }
    redirectsArray.push(dst);
  } */
  e.ports[0].postMessage({});
});
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  console.log('got fetch', event);
  const {
    clientId
  } = event;
  event.respondWith(
    clients.get(clientId)
    .then(client => {
      const u = new URL(event.request.url);
      const {pathname} = u;
      // console.log('got client', event.request.url, !!(client && client.frameType === 'nested'));
      if (client && client.frameType === 'nested') {
        // console.log('got client', u.pathname, client, event.request);
        if (event.request.method === 'POST' && pathname === '/xrpackage/register') {
          return event.request.json()
            .then(j => {
              const {id} = j;
              hijackedClientIds[clientId] = id;
            })
            .then(() =>
              new Response(JSON.stringify({
                ok: true,
              }))
            );
        } else {
          const id = hijackedClientIds[clientId];
          if (id) {
            const files = hijackedIds[id];
            // console.log('hijack file 2', client.url, files);
            if (files) {
              // console.log('hijack file 2', pathname, files);
              if (!/\/xrpackage\//.test(pathname)) {
                const file = files.find(f => f.pathname === pathname);
                // console.log('hijack file 3', pathname, file);
                if (file) {
                  return new Response(file.body);
                }
              }
            }
          }
        }
      }
      if (/\/xrpackage\//.test(pathname)) {
        return fetch('https://xrpackage.org' + pathname);
      } else {
        return fetch(event.request);
      }
    })
  );
});