<template>
    <div class="vuejs-app">
        {{message}}
        <spinners></spinners>
        <modals></modals>
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/ajax">Ajax</router-link>
            <router-link to="/forms">Forms</router-link>
            <router-link to="/modals">Modals</router-link>
            <router-link to="/spinners">Spinners</router-link>
        </nav>
        <router-view></router-view>
    </div>
</template>

<script>

    import {Spinners, Spinner, Modals, Modal, FormField, FormValidator} from '../src/index'

    export default {
        name: 'App',
        components: {
            Spinner,
            Spinners,
            Modal,
            Modals,
            FormField,
            FormValidator,
        },
        data () {
            return {
                message: 'hello VueJS'
            }
        },
        computed: {
        },
        mounted () {
        },
        created () {
        },
        methods: {
        }
    }
</script>

<style>
.vuejs_app{
    background: blue;
}
</style>
