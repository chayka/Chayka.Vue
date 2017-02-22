<template>
    <div class="page page-ajax">
        <h1>Forms Demo</h1>
        <form>
            <form-validator ref="validator" class="message-align-center colorize-field-background label-colon message-float message-float-bottom">
                <form-field class="" label="Label text" hint="Put something here" ref="dummyField" mode="keypress"
                    validate-email
                    :validate-api="{url: '/api/check-email/', post: true, message: 'email not registered', progressMessage: 'checking email'}">
                    <input type="text" v-model="dummy"/>
                    <spinner></spinner>
                </form-field>
                <form-field class="radio" label="Have kids" hint="Select option" ref="radioField"
                    validate-required :validate-range="{le: 1}" approval="Well done!">
                    <!--<label><input type="radio" v-model="radioValue" :value="0"/>Child free</label>-->
                    <label><input type="radio" v-model="radioValue" :value="1"/>1 Child</label>
                    <label><input type="radio" v-model="radioValue" :value="2"/>2 Child</label>
                </form-field>
                <form-field class="" label="Password" hint="lowercase, uppercase, digits" ref="passwordField"
                            validate-required
                            :validate-password-complexity="{chars: 'lowercase uppercase digits', minLength: 2, minComplexity: 0, stopWords: dummy}"
                            approval="Well done!">
                    <input type="password" v-model="password"/>
                </form-field>
                <div>
                    <form-field label="repeat" ref="passwordRepeatField"
                                :validate-password-repeat="password"
                                approval="Well done!">
                        <input type="password" v-model="password2"/>
                    </form-field>
                </div>
                <button @click="validate()">Validate</button>
            </form-validator>
        </form>
    </div>
</template>

<script>

    import FormField from '../../src/Components/FormField.vue';
//    import modals from '../../src/modals';

    export default {
        name: 'FormsPage',
        components: [
            FormField
        ],
        data () {
            return {
                dummy: 'Dummy',
                radioValue: 0,
                password: '',
                password2: '',
            }
        },
        created () {

        },
        methods: {
            validate () {
                this.$refs.validator.validateFields();
            },

            validateCustom (value) {
                return value === 'foo';
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    form{
        width: 300px;
    }
</style>