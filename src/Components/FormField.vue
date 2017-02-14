<template>
    <div class="chayka-form-field">
        <label>{{label}} <slot name="lable"></slot></label>
        <div class="input">
            <slot></slot>
        </div>
        <div class="message">
            {{message}}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'FormField',
        props: {
            label: {
                type: String,
                default: ''
            },
            hint: {
                type: String,
                default: ''
            }
        },
        created () {

        },
        methods: {
            validate () {

            }
        },
        directives: {
            validate: {
                componentUpdated (el, binding, vnode) {
                    console.dir({componentUpdated: {el, binding, vnode}})
                }
            }
        }
    }
</script>

<style lang="less">

</style>