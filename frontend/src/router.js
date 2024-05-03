import { createRouter, createWebHistory } from "vue-router";

import StartPageView from "./views/StartPageView.vue";
import MoviePageView from "./views/MoviePageView.vue";
import AdminPPageView from "./views/admin/AdminPPageView.vue";
import PersonPageView from "./views/PersonPageView.vue";
import SearchPageView from "./views/SearchPageView.vue";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			name: "Home",
			path: "/",
			component: StartPageView
		},
		{
			name: "movie",
			path: "/movie/:movieId",
			component: MoviePageView
		},
		{
			name: "adminperson",
			path: "/adminperson/:personId",
			component: AdminPPageView
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
