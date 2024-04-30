import { createRouter, createWebHistory } from "vue-router";

import StartPageView from "./views/StartPageView.vue";
import MoviePageView from "./views/MoviePageView.vue";
import PersonPageView from "./views/PersonPageView.vue";
import SearchPageView from "./views/SearchPageView.vue";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
<<<<<<< HEAD
			name: "home",
=======
			name: 'Home',
>>>>>>> 0d48b19d50f17dd89d2d8efbf57a2f7c24237921
			path: "/",
			component: StartPageView
		},
		{
			name: "movie",
			path: "/movie/:movieId",
			component: MoviePageView
		},
		{
			name: "person",
			path: "/person/:personId",
			component: PersonPageView
		},
		{
			path: "/search/:searchType/:keyword",
			component: SearchPageView
		}
	]
});

export default router;
