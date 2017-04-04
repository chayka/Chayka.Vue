<template>
    <div class="chayka-form-validator">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'FormValidator',
        data () {
            return {
                fields: {},
            }
        },
        beforeCreate () {
            this.$on('FormField.register', this.registerField);
        },
        mounted () {
        },
        methods: {

            /**
             * Get the list of validator field components
             *
             * @return {T[]|Array.<T>}
             */
            getFields () {
                return this.$children.filter(child => child.validate && child.getName && child.setState);
            },

            /**
             * Validate all the fields, optionally do it silently
             *
             * @param {boolean} silent
             * @return {boolean}
             */
            validateFields (silent = false) {
                let valid = true;

                this.getFields().forEach(field => valid = field.validate(silent) && valid);

                return valid;
            },

            /**
             * Get field instance
             *
             * @param {string} name
             * @return {T}
             */
            getField (name) {
                return this.getFields().find(field => field.getName() === name);
            },

            /**
             * Validate field, optionally do it silently
             * @param {string} name
             * @param {boolean}silent
             * @return {boolean}
             */
            validateField (name, silent = false){
                let field = this.getField(name);
                return field && field.validate(silent);
            },

            /**
             * Set field validation state
             *
             * @param name
             * @param state
             * @param message
             */
            setFieldState (name, state, message){
                let field = this.getField(name);
                if (field) {
                    field.setState(state, message);
                }
            },

            /**
             * Show field validation error
             *
             * @param name
             * @param error
             */
            showError (name, error) {
                this.setFieldState(name, 'error', error);
            },

            /**
             * Show fields validation errors
             * @param {{}} errors
             */
            showErrors (errors) {
                Object.keys(errors || {}).forEach(name => this.showError(name, errors[name]));
            },

            /**
             * Get field value
             *
             * @param name
             * @return {*|string|number}
             */
            getValue (name) {
                return this.getField(name).getValue();
            },

            /**
             * Get field values
             *
             * @return {{}}
             */
            getValues () {
                return this.getFields().reduce((values, field) => {
                    values[field.getName()] = field.getValue();
                    return values;
                }, {})
            },

            /**
             * Get field validation error
             *
             * @param {string} name
             * @return {boolean|*|string|string}
             */
            getError (name) {
                let field = this.getField(name);
                return field.state === 'error' && field.msg || '';
            },

            /**
             * Get field validation errors
             *
             * @return {{}}
             */
            getErrors () {
                return this.getFields().reduce((errors, field) => {
                    if (field.state === 'error'){
                        errors[field.getName()] = field.msg;
                    }
                    return errors;
                }, {})
            },

        }
    }
</script>

<style rel="stylesheet/less" lang="less">

</style>