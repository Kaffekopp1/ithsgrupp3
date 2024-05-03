import { createRouter, createWebHistory } from "vue-router";

import StartPageView from "./views/StartPageView.vue";
import MoviePageView from "./views/MoviePageView.vue";
import AdminPPageView from "./views/admin/AdminPPageView.vue";
import AdminStartView from "./views/admin/AdminStartView.vue";
import PersonPageView from "./views/PersonPageView.vue";
import SearchPageView from "./views/SearchPageView.vue";
import LoginPageView from "./views/LoginView.vue";
import LogoutPageView from "./views/LogoutView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "Home",
      path: "/",
      component: StartPageView
    },
    {
      path: "/adminstart",
      component: AdminStartView,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: "login",
      path: "/login",
      component: LoginPageView
    },
    {
      name: "logout",
      path: "/logout",
      component: LogoutPageView
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
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    const checkToken = await fetch('http://localhost:3000/auth', {
      headers: {
        Authorization: `${token}`,
      }
    });
    const response = await checkToken.json();
    if (response.message) {
      // User is authenticated, proceed to the route
      next();
    } else {
      // User is not authenticated, redirect to login
      next("/login");
    }
  } else {
    // Non-protected route, allow access
    next();
  }
});

export default router;
