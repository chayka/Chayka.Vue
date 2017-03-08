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
            getFields () {
                return this.$children.filter(child => child.validate && child.getName && child.setState);
            },

            validateFields (silent = false) {
                let valid = true;

                this.getFields().forEach(field => valid = field.validate(silent) && valid);

                return valid;
            },

            getField (name) {
                return this.getFields().find(field => field.getName() === name);
            },

            validateField (name, silent = false){
                let field = this.getField(name);
                return field && field.validate(silent);
            },

            setFieldState (name, state, message){
                let field = this.getField(name);
                if (field) {
                    field.setState(state, message);
                }
            },

            showError (name, error) {
                this.setFieldState(name, 'error', error);
            },

            showErrors (errors) {
                Object.keys(errors || {}).forEach(name => this.showError(name, errors[name]));
            },

            getValue (name) {
                return this.getField(name).getValue();
            },

            getValues () {
                return this.getFields().reduce((values, field) => {
                    values[field.getName()] = field.getValue();
                    return values;
                }, {})
            },

            getError (name) {
                let field = this.getField(name);
                return field.state === 'error' && field.msg || '';
            },

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