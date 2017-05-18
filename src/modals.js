import Vue from 'vue';

let buttonClassBindings = {
    regular: 'button',
    primary: 'button-primary',
    danger: 'button-danger',
}

export default new Vue({
    methods: {

        /**
         * Set button classes bindings. For example to adjust button styling to twitter bootstrap or WordPress
         * @param bindings
         */
        setButtonClasses (bindings) {
            Object.assign(buttonClassBindings, bindings);
        },

        /**
         * Get button classes bindings.
         */
        getButtonClasses () {
            return buttonClassBindings;
        },

        /**
         * Add an item to a queue and thus show a modal window.
         *
         * @param {object} modal
         */
        show (modal) {
            let defaults = {
                content: '',
                title: '',
                buttons: [],
                cls: [],
                width: '300px',
                height: 'auto',
            };
            this.$emit('show', {...defaults, ...modal});
        },

        /**
         * Alias to show
         *
         * @param modal
         */
        open (modal) {
            this.show(modal);
        },

        /**
         * Close current modal popup, by shifting queue
         */
        hide () {
            this.$emit('hide');
        },

        /**
         * Alias to hide
         */
        close () {
            this.hide();
        },

        /**
         * Show alert box - a message with 'Ok' button.
         * Callback is called when Ok is clicked.
         *
         * @param message
         * @param title
         * @param okCallback
         * @param options
         */
        alert (message, title = '', okCallback = null, options = {}) {
            this.show({
                content: message,
                title: title,
                cls: ['alert', 'pre-line'],
                buttons: [{
                    text: 'Ok',
                    click: okCallback,
                }],
                ...options
            });
        },

        /**
         * Show confirm box - a message with 'Yes' & 'No' buttons.
         * Callback is called when 'Yes' is clicked.
         *
         * @param message
         * @param title
         * @param yesCallback
         * @param options
         */
        confirm (message, title = '', yesCallback = null, options = {}) {
            this.show({
                content: message,
                title: title,
                cls: ['confirm', 'pre-line'],
                buttons: [
                    {
                        text: 'No',
                    }, {
                        text: 'Yes',
                        click: yesCallback,
                        cls: [buttonClassBindings.primary]
                    }
                ],
                ...options});
        }

    }
});