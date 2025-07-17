function actualizaCacheDinamico( dynamicCache, req, res ){
   if( res.ok ){
      return caches.open( dynamicCache )
                  .then( cache => {
                     cache.put( req, res.clone() );

                     return res.clone();
                  })
   } else {
      // aquí ya no hay mucho q hacer xq ya falló la request y el cache =>
      return res;
   }
}
