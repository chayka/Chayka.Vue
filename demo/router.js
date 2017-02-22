import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import HomePage from './components/HomePage.vue';
import AjaxPage from './components/AjaxPage.vue';
import FormsPage from './components/FormsPage.vue';
import ModalsPage from './components/ModalsPage.vue';
import SpinnersPage from './components/SpinnersPage.vue';

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', name: 'home', component: HomePage },
        { path: '/ajax', name: 'ajax', component: AjaxPage },
        { path: '/forms', name: 'forms', component: FormsPage },
        { path: '/modals', name: 'modals', component: ModalsPage },
        { path: '/spinners', name: 'spinners', component: SpinnersPage },
    ]
});

export default router;