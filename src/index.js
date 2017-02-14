import Vue from 'vue';

import modals from './modals';
import Modal from './Components/Modal.vue';
import Modals from './Components/Modals.vue';

Vue.component('modal', Modal);
Vue.component('modals', Modals);

import spinners from './spinners';
import Spinner from './Components/Spinner.vue';
import Spinners from './Components/Spinners.vue';

Vue.component('spinner', Spinner);
Vue.component('spinners', Spinners);

import FormField from './Components/FormField.vue';
Vue.component('form-field', FormField);

import ajax from './ajax';

export {
    Spinner, Spinners, spinners,
    Modal, Modals, modals,
    ajax
};