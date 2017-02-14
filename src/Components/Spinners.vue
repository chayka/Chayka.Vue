<template>
    <div class="surge-spinners" v-if="spinners.length">
        <div class="spinners">
            <spinner v-for="spinner of spinners" :message="spinner.message" :visible="true"></spinner>
        </div>
    </div>
</template>

<script>
import spinners from '../spinners'
import Spinner from './Spinner.vue'

export default{
    name: 'Spinners',
    components: {
        Spinner
    },
    data () {
        return {
            spinners: []
        }
    },

    methods: {
        /**
         * Adds message to a queue, returns spinner id.
         * When queue is non empty, the top item is shown.
         * On mouse over, whole stack is shown.
         *
         * @param spinner
         * @return {string}
         */
        show (spinner = {message: 'Loading...', id: ''}) {
            this.spinners.push(spinner);
            return spinner.id;
        },

        /**
         * Removes message from stack.
         * When stack is empty, general spinner is hidden
         * @param id
         */
        hide (id) {
            let index = this.spinners.findIndex(value => id === value.id);
            if (index >= 0) {
                this.spinners.splice(index, 1)
            }
        }

    },

    created () {
        spinners.$on('show', this.show);
        spinners.$on('hide', this.hide);
    }
}
</script>

<style src="./Spinners.less"></style>