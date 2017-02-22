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
            console.log({'validator.mounted': this});
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
                return this.getFields().find(field => field.getName === name);
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


        }
    }
</script>

<style rel="stylesheet/less" lang="less">

</style>