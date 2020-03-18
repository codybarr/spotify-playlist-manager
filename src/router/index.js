import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import User from '@/views/User.vue'
import Playlist from '@/views/Playlist.vue'

Vue.use(VueRouter)

import store from '@/store'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: function() {
			return import(/* webpackChunkName: "about" */ '../views/About.vue')
		},
	},
	{
		path: '/user/playlist/:id',
		name: 'Playlist',
		component: Playlist,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/user',
		name: 'User',
		component: User,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/callback',
		name: 'Callback',
		component: Home,
	},
]

const router = new VueRouter({
	routes,
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (!store.state.user) {
			next({
				path: '/login',
			})
		} else {
			next()
		}
	} else {
		next()
	}
})

export default router
