// imports
importScripts("js/sw-utils.js");

const STATIC_CACHE = "static-v2";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";

// APP_SHELL y APP_SHELL_INMUTABLE los separa xlos q son de la app y los archivos q vienen de afuera
const APP_SHELL = [
	"/",
	"index.html",
	"css/style.css",
	"img/favicon.ico",
	"img/avatars/hulk.jpg",
	"img/avatars/ironman.jpg",
	"img/avatars/spiderman.jpg",
	"img/avatars/thor.jpg",
	"img/avatars/wolverine.jpg",
	"js/app.js",
	"js/sw-utils.js",
];

const APP_SHELL_INMUTABLE = [
	"https://fonts.googleapis.com/css?family=Quicksand:300,400",
	"https://fonts.googleapis.com/css?family=Lato:400,300",
	// "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
	"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
	"css/animate.css",
	"js/libs/jquery.js",
];

self.addEventListener("install", (e) => {
	const cacheStatic = caches
		.open(STATIC_CACHE)
		.then((cache) => cache.addAll(APP_SHELL));

	const cacheInmutable = caches
		.open(INMUTABLE_CACHE)
		.then((cache) => cache.addAll(APP_SHELL_INMUTABLE));

	e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

// borra caches antiguos
self.addEventListener("activate", (e) => {
	const respuesta = caches.keys().then((keys) => {
		keys.forEach((key) => {
			if (key !== STATIC_CACHE && key.includes("static")) {
				return caches.delete(key);
			}

			// if (key !== DYNAMIC_CACHE && key.includes("dynamic")) {
			//    return caches.delete(key);
			// }
		});
	});

	e.waitUntil(respuesta);
});

// estrategia de caché con network-fallback
self.addEventListener("fetch", (e) => {
	const respuesta = caches.match(e.request).then((res) => {
		if (res) {
			return res;
		} else {
			return fetch(e.request).then((newRes) => {
				return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
			});
		}
	});

	e.respondWith(respuesta);
});
