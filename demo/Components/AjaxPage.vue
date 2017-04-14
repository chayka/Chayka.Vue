<template>
    <div class="page page-ajax">
        <h1>Ajax Demo</h1>

        <h2>Default Request</h2>
        <button @click="sendDefaultRequest()">Send Default Request</button>
        <button @click="sendCustomSpinnerRequest()">Send Custom Spinner Request</button>
        <pre>{{defaultResponse}}</pre>

        <h2>Success message</h2>
        <button @click="sendBackendSuccessRequest()">Show success message from backend</button>
        <button @click="sendOverrideSuccessRequest()">Override success message from backend</button>
        <button @click="sendSuppressedSuccessRequest()">Suppress success message from backend</button>
        <pre>{{successResponse}}</pre>

        <h2>Error message</h2>
        <button @click="sendBackendErrorRequest()">Show error message from backend</button>
        <button @click="sendOverrideErrorRequest()">Override error message from backend</button>
        <button @click="sendSuppressedErrorRequest()">Suppress error message from backend</button>
        <pre>{{errorResponse}}</pre>

        <h2>Forms</h2>
        <form-validator ref="validator">

            <form-field class=""
                        name="email"
                        label="Email"
                        hint="Your email please"
                        approval="Good job"
                        validate-email
                        validate-required>
                <input type="text" v-model="email"/>
            </form-field>
        </form-validator>
        <button ref="btnSubmit1" @click="sendFormSuccessRequest()">Submit form</button>
        <button ref="btnSubmit2" @click="sendFormErrorRequest()">Submit and render backend errors</button>
        <pre>{{formResponse}}</pre>
    </div>
</template>

<script>
    function formatJson (data) {
        return JSON.stringify(data, null, '  ');
    }

    import ajax from '../../src/ajax';
    export default {
        name: 'AjaxPage',
        data () {
            return {
                defaultResponse: '',
                successResponse: '',
                errorResponse: '',
                formResponse: '',
                email: '',
            }
        },
        created () {

        },
        methods: {


            sendDefaultRequest () {
                this.defaultResponse = '';
                ajax.get('/api/empty.json', {
                    delay: 1000
                }).then(response => {console.log('callback'); this.defaultResponse = formatJson(response.body, null)});
            },

            sendCustomSpinnerRequest () {
                this.defaultResponse = '';
                ajax.get('/api/empty.json', {
                    delay: 1000,
                    spinnerMessage: 'Loading important stuff...',
                }).then(response => {console.log('callback'); this.defaultResponse = formatJson(response.body, null)});
            },

            sendBackendSuccessRequest () {
                this.successResponse = '';
                ajax.get('/api/success.json', {
                    delay: 1000,
                }).then(response => this.successResponse = formatJson(response.body, null));
            },

            sendOverrideSuccessRequest () {
                this.successResponse = '';
                ajax.get('/api/success.json', {
                    delay: 1000,
                    successMessage: 'Frontend says Well done!'
                }).then(response => this.successResponse = formatJson(response.body, null));
            },

            sendSuppressedSuccessRequest () {
                this.successResponse = '';
                ajax.get('/api/success.json', {
                    delay: 1000,
                    successMessage: false
                }).then(response => this.successResponse = formatJson(response.body, null));
            },

            sendBackendErrorRequest () {
                this.errorResponse = '';
                ajax.get('/api/error.json', {
                    delay: 1000,
                }).then(() => {}, response => this.errorResponse = formatJson(response.body, null));
            },

            sendOverrideErrorRequest () {
                this.errorResponse = '';
                ajax.get('/api/error.json', {
                    delay: 1000,
                    errorMessage: 'Frontend says Booo!'
                }).then(() => {}, response => this.errorResponse = formatJson(response.body, null));
            },

            sendSuppressedErrorRequest () {
                this.errorResponse = '';
                ajax.get('/api/error.json', {
                    delay: 1000,
                    errorMessage: false
                }).then(() => {}, response => this.errorResponse = formatJson(response.body, null));
            },

            sendFormSuccessRequest () {
                this.formResponse = '';
                ajax.get('/api/success.json', {
                    delay: 1000,
                    errorMessage: 'Frontend says Booo!',
                    validator: this.$refs.validator,
                    buttons: [this.$refs.btnSubmit1, this.$refs.btnSubmit2],
                }).then(response => this.formResponse = formatJson(response.body, null));
            },

            sendFormErrorRequest () {
                this.formResponse = '';
                ajax.get('/api/form.error.json', {
                    delay: 1000,
                    errorMessage: false,
                    validator: this.$refs.validator,
                    buttons: [this.$refs.btnSubmit1, this.$refs.btnSubmit2],
                }).then(() => {}, response => this.formResponse = formatJson(response.body, null));
            },
        }
    }
</script>

<style lang="less">

</style>