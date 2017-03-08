<template>
    <div class="page page-avatars">
        <h1>Avatars Demo</h1>
        <div class="block gravatar-box">
            <h2>GR avatars</h2>
            <form-field validate-required validate-email ref="emailField" approval="Good job">
                <input type="email" v-model="email" placeholder="Enter email for gravatar here"/>
            </form-field>
            <img :src="avatars.gravatar(email)"/>
        </div>
        <div class="block fbavatar-box">
            <h2>FB avatars</h2>
            <form-field validate-required ref="fbIdField" approval="Good job">
                <input type="text" v-model="fbId" placeholder="Enter fb id for avatar here"/>
            </form-field>
            <img :src="avatars.fbavatar(fbId)"/>
        </div>
    </div>
</template>

<script>

    import avatars from '../../src/avatars';

    export default {

        name: 'AvatarsPage',
        data () {
            return {
                email: '',
                fbId: '',
                avatars
            }
        },
        created () {

        },
        methods: {

        }
    }
</script>

<style lang="less">
    .block{
        width: 300px;
    }
</style>