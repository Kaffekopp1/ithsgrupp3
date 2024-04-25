import { createRouter, createWebHistory } from 'vue-router';

import StartPageView from './views/StartPageView.vue';
import MoviePageView from './views/MoviePageView.vue';
import PersonPageView from './views/PersonPageView.vue';
import SearchPageView from './views/SearchPageView.vue';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: StartPageView
    },
    {
      path: '/movie/:movieId',
      component: MoviePageView,
    },
    {
      path: '/person/:personId',
      component: PersonPageView,
    },
    {
      path: '/search/:searchType/:keyword',
      component: SearchPageView,
    }
  ],
});

export default router;