import Vue from 'vue';

import modals from './modals';
import Modal from './Components/Modal.vue';
import Modals from './Components/Modals.vue';

import spinners from './spinners';
import Spinner from './Components/Spinner.vue';
import Spinners from './Components/Spinners.vue';

Vue.component('modal', Modal);
Vue.component('modals', Modals);

Vue.component('spinner', Spinner);
Vue.component('spinners', Spinners);