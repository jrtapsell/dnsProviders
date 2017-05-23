var version = 'v1::';
self.addEventListener("fetch", function(event) {
  var url = event.request.url;


  if (event.request.method !== 'GET') {

    return;
  }
  event.respondWith(
    caches
      .match(event.request)
      .then(function(cached) {
        var networked = fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);


        return cached || networked;

        function fetchedFromNetwork(response) {
          var cacheCopy = response.clone();



          caches
            .open(version + 'pages')
            .then(function add(cache) {
              cache.put(event.request, cacheCopy);
            })
            .then(function() {

            });
          return response;
        }
        function unableToResolve () {

          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});