import Vue from 'vue';

export default new Vue({
    data(){
        return {
            counter: 0
        }
    },

    methods: {
        /**
         * Adds message to a queue, returns spinner id.
         * When queue is non empty, the top item is shown.
         * On mouse over, whole stack is shown.
         *
         * @param {string} message
         * @param {string} id
         * @return {string}
         */
        show(message = 'Loading...', id = '') {
            let spinner = {
                id: id || `spinners_${++this.counter}`,
                message
            };
            this.$emit('show', spinner);
            return spinner.id;
        },

        /**
         * Removes message from stack.
         * When stack is empty, general spinner is hidden
         * @param id
         */
        hide(id) {
            this.$emit('hide', id);
        }

    }
});