<template>
    <div class="page page-ajax">
        <h1>Forms Demo</h1>
        <h2>Config</h2>
        <h3>Error notification styling</h3>
        <div>
            <label><input type="checkbox" v-model="config.colorizeFieldBackground"/>colorize-field-background</label><br/>
            <label><input type="checkbox" v-model="config.colorizeLabel"/>colorize-label</label><br/>
            <label><input type="checkbox" v-model="config.colorizeInput"/>colorize-input</label> or
            <label><input type="checkbox" v-model="config.colorizeInputBorder"/>colorize-input-border</label>,
            <label><input type="checkbox" v-model="config.colorizeInputBackground"/>colorize-input-background</label>,
            <label><input type="checkbox" v-model="config.colorizeInputFont"/>colorize-input-font</label><br/>
            <label><input type="checkbox" v-model="config.colorizeMessage"/>colorize-message</label><br/>
        </div>
        <h3>Message styling</h3>
        <div>
            <label><input type="checkbox" v-model="config.messageFloatBottom"/>message-float message-float-bottom</label> or
            <label><input type="checkbox" v-model="config.messageFloatRight"/>message-float message-float-right</label><br/>
            <label><input type="checkbox" v-model="config.messageAlignCenter"/>message-align-center</label> or
            <label><input type="checkbox" v-model="config.messageAlignRight"/>message-align-right</label><br/>
        </div>
        <h3>Label styling</h3>
        <div>
            <label><input type="checkbox" v-model="config.stretch"/>stretch</label> or
            <label><input type="checkbox" v-model="config.fullsize"/>fullsize</label><br/>
            <label><input type="checkbox" v-model="config.noLabel"/>no-label</label><br/>
            <label><input type="checkbox" v-model="config.labelColon"/>label-colon</label>,
            <label><input type="checkbox" v-model="config.labelRequiredAsterisk"/>label-required-asterisk</label><br/>
        </div>
        <h2>Form</h2>
        <form @submit.prevent="">
            <form-validator ref="validator" :class="validatorClass">

                <form-field class=""
                            label="Required"
                            hint="Put something here"
                            validate-required>
                    <input type="text" v-model="model.required"/>
                </form-field>

                <form-field class=""
                            label="Email"
                            hint="Your email please"
                            mode="keypress"
                            validate-email>
                    <input type="text" v-model="model.email"/>
                </form-field>

                <form-field class=""
                            label="Regexp"
                            hint="Your phone please xxx-xx-xx"
                            :validate-regexp="{regexp: '/^\\d{3}-\\d{2}-\\d{2}$/', message: 'Valid format is: xxx-xx-xx'}">
                    <input type="text" v-model="model.phone"/>
                </form-field>

                <form-field class=""
                            label="Custom check"
                            approval="Good job!"
                            hint="Type in 'custom'"
                            :validate-custom="value => value === 'custom'">
                    <input type="text" v-model="model.custom"/>
                </form-field>

                <form-field class=""
                            label="Check API"
                            hint="Put something here"
                            :validate-api="{url: '/api/check/', post: true, message: 'data is invalid', progressMessage: 'checking data', delay: 500, fakeDelay: 1000}">
                    <input type="text" v-model="model.api"/>
                </form-field>

                <form-field class="radio"
                            label="Check range"
                            hint="Select option"
                            validate-required
                            :validate-range="{ge: 2, le: 3}" approval="Well done!">
                    <label><input type="radio" v-model="model.radio" :value="1"/>1</label>
                    <label><input type="radio" v-model="model.radio" :value="2"/>2</label>
                    <label><input type="radio" v-model="model.radio" :value="3"/>3</label>
                    <label><input type="radio" v-model="model.radio" :value="4"/>4</label>
                </form-field>

                <form-field class=""
                            label="Check length"
                            hint="Let us know who you are"
                            mode="keypress"
                            validate-required
                            :validate-length="{min: 10, max: 100}" >
                    <textarea v-model="model.text" rows="5"></textarea>
                    <span>{{model.text.length}} chars</span>
                </form-field>

                <form-field class="" label="Password" hint="lowercase, uppercase, digits"
                            validate-required
                            :validate-password-complexity="{chars: 'lowercase uppercase digits', minLength: 2, minComplexity: 0, stopWords: model.email}"
                            approval="Well done!">
                    <input type="password" v-model="model.password"/>
                </form-field>

                <div>
                    <form-field label="repeat"
                                :validate-password-repeat="model.password"
                                approval="Well done!">
                        <input type="password" v-model="model.password2"/>
                    </form-field>
                </div>

                <button @click="validate()">Validate</button>

            </form-validator>
        </form>
        <pre>{{getValues()}}</pre>
    </div>
</template>

<script>

    import FormField from '../../src/Components/FormField.vue';

    export default {
        name: 'FormsPage',
        components: [
            FormField
        ],
        data () {
            return {
                config: {
                    colorizeFieldBackground: false,
                    colorizeLabel: false,
                    colorizeInput: false,
                    colorizeInputBorder: false,
                    colorizeInputBackground: false,
                    colorizeInputFont: false,
                    colorizeMessage: false,
                    messageFloatBottom: false,
                    messageFloatRight: false,
                    messageAlignRight: false,
                    messageAlignCenter: false,
                    stretch: false,
                    fullsize: false,
                    noLabel: false,
                    labelColon: false,
                    labelRequiredAsterisk: false,
                },
                model: {
                    required: '',
                    email: '',
                    phone: '',
                    custom: '',
                    api: '',
                    radio: 0,
                    password: '',
                    password2: '',
                    text: ''
                }
            };
        },
        computed: {
            validatorClass () {
                return {
                    'colorize-field-background': this.config.colorizeFieldBackground,
                    'colorize-label': this.config.colorizeLabel,
                    'colorize-input': this.config.colorizeInput,
                    'colorize-input-border': this.config.colorizeInputBorder,
                    'colorize-input-background': this.config.colorizeInputBackground,
                    'colorize-input-font': this.config.colorizeInputFont,
                    'colorize-message': this.config.colorizeMessage,
                    'message-float': this.config.messageFloatBottom || this.config.messageFloatRight,
                    'message-float-bottom': this.config.messageFloatBottom,
                    'message-float-right': this.config.messageFloatRight,
                    'message-align-right': this.config.messageAlignRight,
                    'message-align-center': this.config.messageAlignCenter,
                    'stretch': this.config.stretch,
                    'fullsize': this.config.fullsize,
                    'no-label': this.config.noLabel,
                    'label-colon': this.config.labelColon,
                    'label-required-asterisk': this.config.labelRequiredAsterisk,
                };
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
            },

            getValues () {
                return JSON.stringify(this.$refs.validator && this.$refs.validator.getValues(), null, '  ');
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    form{
        width: 300px;
    }
</style>