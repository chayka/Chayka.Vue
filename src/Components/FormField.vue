<template>
    <div class="chayka-form-field" :class="cls">
        <label class="field-label">{{label}}<slot name="label"></slot></label>
        <div class="field-input">
            <div class="input-box">
                <slot></slot>
            </div>
            <div class="message" :class="{empty: !message}">
                {{message}}
            </div>
        </div>
    </div>
</template>

<script>
    import nls from '../nls';
    import Vue from 'vue';

    export default {
        name: 'FormField',
        props: {
            name: {
                type: String,
                default: ''
            },
            label: {
                type: String,
                default: ''
            },
            hint: {
                type: String,
                default: ''
            },
            approval: {
                type: String,
                default: ''
            },
            validateEvents: {
                type: [String, Array],
                default: 'keyup blur change'
            },
            validateRequired: [String, Object],
            validateLength: Object,
            validateRange: Object,
            validateRegexp: Object,
            validateEmail: [String, Object],
            validatePasswordComplexity: [String, Object],
            validatePasswordRepeat: [String, Object],
            validateCustom: [Function, Object],
            validateAsync: Object,
            validateApi: [String, Object],
        },
        computed: {
            message () {
                return this.msg || this.hint;
            },
            cls () {
                return {
                    focus: this.focus,
                    required: this.validateRequired !== undefined,
                    [this.state]: true,
                };
            }
        },
        data () {
            return {
                state: 'clean',
                focus: false,
                msg: ''
            };
        },
        created () {
            nls.extendDictionary('en-US', {
                'validate-require-message': 'This field is required',
                'validate-length-message-min-max': 'The value length should be between {{min}} and {{max}}',
                'validate-length-message-min': 'The value length should be at least {{min}} chars',
                'validate-length-message-max': 'The value length should be {{max}} chars max',
                'validate-range-message-min-max': 'The value should be between {{min}} and {{max}}',
                'validate-range-message-min': 'The value should be at least {{min}}',
                'validate-range-message-max': 'The value should be {{max}} max',
                'validate-regexp-message': 'Invalid format',
                'validate-email-message': 'Invalid format (e.g. user@domain.com)',
                'validate-password-complexity-message-min-length': 'The password should be at least {{minLength}} chars long',
                'validate-password-complexity-message-lowercase': 'The password should contain lowercase chars',
                'validate-password-complexity-message-uppercase': 'The password should contain uppercase chars',
                'validate-password-complexity-message-digits': 'The password should contain digits',
                'validate-password-complexity-message-non-alphanumeric': 'The password should contain non-alphanumeric chars',
                'validate-password-complexity-message-low-complexity': 'Entered password has low complexity',
                'validate-password-complexity-message-username-parts': 'Entered password contains parts of username',
                'validate-password-repeat-message': 'Entered passwords do not match',
                'validate-custom-message': 'Entered value is invalid',
                'validate-progress-message': 'Validating...',
            });
            nls.extendDictionary('ru-RU', {
                'validate-require-message': 'Данное поле обязательно для заполнения',
                'validate-length-message-min-max': 'Длина значения должна быть от {{min}} до {{max}} символов',
                'validate-length-message-min': 'Длина значения должна быть не менее {{min}} символов',
                'validate-length-message-max': 'Длина значения должна быть не более {{max}} символов',
                'validate-range-message-min-max': 'Значение должно быть в рамках от {{min}} до {{max}}',
                'validate-range-message-min': 'Значения должно быть не менее {{min}}',
                'validate-range-message-max': 'Значения должно быть не более {{max}}',
                'validate-regexp-message': 'Некорректный формат',
                'validate-email-message': 'Некорректный формат (user@domain.com)',
                'validate-password-complexity-message-min-length': 'Пароль должен быть не короче {{minLength}} символов',
                'validate-password-complexity-message-lowercase': 'Пароль должен содержать символы в нижнем регистре',
                'validate-password-complexity-message-uppercase': 'Пароль должен содержать символы в верхнем регистре',
                'validate-password-complexity-message-digits': 'Пароль должен содержать цифры',
                'validate-password-complexity-message-non-alphanumeric': 'Пароль должен содержать специальные символы (~!@#$%...)',
                'validate-password-complexity-message-low-complexity': 'Введенный пароль не достаточно сложен',
                'validate-password-complexity-message-username-parts': 'Введенный пароль содержит части логина',
                'validate-password-repeat-message': 'Введенные пароли не совпадают',
                'validate-custom-message': 'Введенные данные неверны',
                'validate-progress-message': 'Выполняется проверка...',
            });
        },
        mounted () {
            let inputs = this.getInputVNodes(this);
            let events = typeof this.validateEvents === 'string' ?
                this.validateEvents.split(/\s+/) :
                this.validateEvents;
            let self = this;
            inputs.forEach(input => {
                events.forEach(event => {
                    input.elm.addEventListener(event, () => {
                        window.setTimeout(() => self.validate(false, event), 0);
                        self.$emit('FormField.register', self);
                    });
                });
                input.elm.addEventListener('focus', () => self.focus = true);
                input.elm.addEventListener('blur', () => self.focus = false);
            });
            window.setTimeout(() => self.$emit('FormField.register', self), 1000);
//            this.$emit('FormField.register', this);
            // console.log({ field: this, value: this.value, inputs });
        },
        methods: {

            /**
             * Set field validation state, css class and message
             * @param {string} state
             * @param {string} message
             */
            setState (state = 'clean', message = ''){
                switch (state) {
                    case 'clean':
                        this.msg = message || this.hint;
                        break;
                    case 'valid':
                        this.msg = message || this.approval;
                        break;
                    default:
                        this.msg = message;
                }
                this.state = state;
                // console.log(`State: ${state} | ${message}`);
            },

            /**
             * Detect inputs to fetch model value and bind event listeners
             *
             * @param {vNode} item
             * @return {[vNode]}
             */
            getInputVNodes (item) {
                let nodes = [],
                    vComponent = null,
                    vNode = null,
                    self = this;
                if (item.$vnode) {
                    vComponent = item;
                    vNode = item.$vnode;
                } else if (item.elm) {
                    vComponent = item.componentInstance;
                    vNode = item;
                }
                if (vNode && vNode.data && vNode.data.directives) {
                    if (vNode.data.directives.find(d => d.name === 'model')) {
                        nodes.push(vNode);
                    }
                }
                if (vNode && vNode.children) {
                    vNode.children.forEach(child => {
                        nodes = nodes.concat(self.getInputVNodes(child));
                    })
                }

                if (vComponent && vComponent.$slots && vComponent.$slots.default) {
                    vComponent.$slots.default.forEach(slot => {
                        nodes = nodes.concat(self.getInputVNodes(slot));
                    });
                }
                return nodes;
            },

            /**
             * Fetch model value
             *
             * @return {{name: string, value: string|number}}
             */
            getModel (vNode) {
                let value = null,
                    name = '',
                    found = false;
                if (vNode && vNode.data && vNode.data.directives) {
                    vNode.data.directives.forEach(d => {
                        if (d.name === 'model' && !found) {
                            // console.log({d});
                            found = true;
                            value = d.value;
                            name = d.expression;
                        }
                    });
                }
                return {name, value};
            },

            /**
             * Fetch model value
             *
             * @return {string|number}
             */
            getValue () {
                let value = undefined;
                let self = this;
                let inputs = this.getInputVNodes(self);
                // console.log({ inputs });
                inputs.forEach(vNode => value = value !== undefined ? value : self.getModel(vNode).value);
                return value;
            },

            /**
             * Get field name, if not specified by 'name' attribute, fetch model name
             *
             * @return {expression}
             */
            getName () {
                if (!this.name){
                    let self = this,
                        name,
                        inputs = this.getInputVNodes(self);
                    inputs.forEach(vNode => name = name !== undefined ? name : self.getModel(vNode).name);
                    return name;
                }
                return this.name;
            },

            /**
             * Check if required field is filled in
             *
             * ```
             * <form-field validate-required>
             *      ...
             * </form-field>
             * ```
             *  or
             * ```
             * <form-field validate-required="Please, fill in {{label}}">
             *      ...
             * </form-field>
             * ```
             *  or
             * ```
             * <form-field :validate-required="{message: 'Please, fill in {{label}}, isActive: needEmail'}">
             *      ...
             * </form-field>
             * ```
             */
            checkRequired (value, silent = false) {
                let config = {
                    message: 'validate-require-message',
                    isActive: false,
                };
                if (this.validateRequired === '') {
                    config.isActive = true;
                } else if (this.validateRequired && typeof this.validateRequired === 'string') {
                    config = {
                        message: this.validateRequired,
                        isActive: true,
                    }
                } else if (this.validateRequired && typeof this.validateRequired === 'object') {
                    config = Object.assign(config, { isActive: true }, this.validateRequired);
                }

                let valid = !config.isActive || !!value;

                if (!silent) {
                    if (valid) {
                        this.setState('valid');
                    } else {
                        this.setState('error', nls._(config.message, {
                            label: this.label,
                            value
                        }));
                    }
                }

                return valid;
            },

            /**
             * Check if field value length is within set range
             *
             * ```
             * <form-field :validate-length="{min: 0, max: 16, message: 'Pick username {{max}} chars max'}">
             *      ...
             * </form-field>
             * ```
             */
            checkLength (value, silent = false) {
                let config = {
                    message: '',
                    isActive: false,
                    min: 0,
                    max: Infinity,
                };

                if (this.validateLength) {
                    config = Object.assign(config, { isActive: true }, this.validateLength);
                }

                let valid = !config.isActive || (value.length !== undefined && value.length >= config.min && value.length <= config.max);

                if (!silent) {
                    if (valid) {
                        this.setState('valid');
                    } else {
                        let message = 'validate-length-message-min-max';
                        if (!config.message) {
                            if (config.min > 0 && config.max === Infinity) {
                                message = 'validate-length-message-min';
                            } else if (config.min === 0 && config.max < Infinity) {
                                message = 'validate-length-message-max';
                            }
                        }

                        this.setState('error', nls._(config.message || message, {
                            label: this.label,
                            value,
                            min: config.min,
                            max: config.max,
                        }));
                    }
                }

                return valid;
            },

            /**
             * Check if field value is within set range
             *
             * ```
             * <form-field :validate-range="{gt: 0, le: 16, number: 'int', message: 'Number of years in IT, {{max}} max'}">
             *      ...
             * </form-field>
             * ```
             */
            checkRange (value, silent = false) {
                let config = {
                    message: '',
                    isActive: false,
                    number: 'float',
                    le: undefined,
                    lt: undefined,
                    ge: undefined,
                    gt: undefined,
                };

                if (this.validateRange) {
                    config = Object.assign(config, { isActive: true }, this.validateRange);
                }

                value = config.number === 'float' ? parseFloat(value) : parseInt(value);
                let valid = true, min, max;

                if (config.isActive) {
                    if (config.ge !== undefined) {
                        valid = valid && value >= config.ge;
                        min = config.ge;
                    }
                    if (config.gt !== undefined) {
                        valid = valid && value > config.gt;
                        min = config.gt;
                    }
                    if (config.le !== undefined) {
                        valid = valid && value <= config.le;
                        max = config.le;
                    }
                    if (config.lt !== undefined) {
                        valid = valid && value < config.lt;
                        max = config.lt;
                    }
                }

                if (!silent) {
                    if (valid) {
                        this.setState('valid');
                    } else {
                        let message = 'validate-range-message-min-max';
                        if (min !== undefined && max === undefined) {
                            message = 'validate-range-message-min';
                        } else if (min === undefined && max !== undefined) {
                            message = 'validate-range-message-max';
                        }

                        this.setState('error', nls._(config.message || message, {
                            label: this.label,
                            value,
                            min,
                            max,
                        }));
                    }
                }

                return valid;
            },

            /**
             * Check if field value matches provided pattern
             *
             * ```
             * <form-field :validate-regexp="{regexp: '/^\d*$/i', message: 'Digits only'}">
             *      ...
             * </form-field>
             * ```
             *  Or
             * ```
             * <form-field :validate-regexp="{regexp: '/\\b(fuck|ass|dickhead)\\b/i', message: 'Behave yourself!', forbid: true}">
             *      ...
             * </form-field>
             *
             *  Or
             *
             * <form-field validate-regexp="/^\d*$/i">
             *      ...
             * </form-field>
             * ```
             */
            checkRegexp (value, silent = false, options = {}) {
                let config = {
                    message: 'validate-regexp-message',
                    isActive: false,
                    regexp: '/.*/',
                    forbid: false,
                };

                if (this.validateRegexp) {
                    if (typeof this.validateRegexp === 'string') {
                        config = Object.assign(config, {
                            regexp: this.validateRegexp,
                            isActive: true,
                        });
                    } else if (typeof this.validateRegexp === 'object') {
                        config = Object.assign(config, { isActive: true }, this.validateRegexp);
                    }
                }

                if (options) {
                    Object.assign(config, options);
                }

                let valid = true;

                if (config.isActive && config.regexp) {

                    let regexp;

                    if (typeof config.regexp === 'string') {
                        let m = /^\/(.*)\/(\w*)$/.exec(config.regexp);
                        regexp = m ? new RegExp(m[1], m[2]) : /.*/;
                    } else {
                        regexp = config.regexp;
                    }

                    let match = regexp.test(value);
                    valid = config.forbid ? !match : match;
                }


                if (!silent) {
                    if (valid) {
                        this.setState('valid');
                    } else {
                        this.setState('error', nls._(config.message, {
                            label: this.label,
                            value: this.getValue()
                        }));
                    }

                }
                return valid;

            },

            /**
             * Check if field value matches email pattern
             *
             * ```
             * <form-field validate-email>
             *      ...
             * </form-field>
             * ```
             *  Or
             * ```
             * <form-field validate-email="Please, provide valid email">
             *      ...
             * </form-field>
             * ```
             */
            checkEmail (value, silent = false) {
                let config = {
                    message: 'validate-email-message',
                    isActive: false,
                    regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                };

                if (this.validateEmail === '') {
                    config.isActive = true;
                } else if (this.validateEmail && typeof this.validateEmail === 'string') {
                    config = Object.assign(config, {
                        message: this.validateEmail,
                        isActive: true,
                    })
                } else if (this.validateEmail && typeof this.validateEmail === 'object') {
                    config = Object.assign(config, { isActive: true }, this.validateEmail);
                }

                return this.checkRegexp(value, silent, config);
            },

            /**
             * Check if password field value is complex enough
             *
             * ```
             * <form-field :validate-password-complexity="{minLength: 6, minComplexity: 3, chars: 'lowercase uppercase digits nonAlNum', stopWords: usernameModel}">
             *      ...
             * </form-field>
             * ```
             *
             * or
             *
             * ```
             * <form-field validate-password-complexity="lowercase uppercase digits nonAlNum">
             *      ...
             * </form-field>
             * ```
             *
             * or
             *
             * ```
             * <form-field :validate-password-complexity="{chars: {lowercase: true, uppercase: false, digits: true, nonAlNum: false'}">
             *      ...
             * </form-field>
             * ```
             */
            checkPasswordComplexity (value, silent = false) {
                let config = {
                    message: '',
                    isActive: false,
                    minLength: 6,
                    minComplexity: 0,
                    chars: {
                        lowercase: false,
                        uppercase: false,
                        digits: false,
                        nonAlNum: false,
                    },
                    stopWords: '',
                };

                function _parseCharsRequirement(str) {
                    let flags = str.split(/\W+/);
                    return {
                        lowercase: flags.indexOf('lowercase') >= 0,
                        uppercase: flags.indexOf('uppercase') >= 0,
                        digits: flags.indexOf('digits') >= 0,
                        nonAlNum: flags.indexOf('nonAlNum') >= 0,
                    }
                }

                if (this.validatePasswordComplexity) {
                    // console.log('checking complexity');
                    if (typeof this.validatePasswordComplexity === 'string') {
                        config = Object.assign(config, {
                            chars: _parseCharsRequirement(this.validatePasswordComplexity),
                            isActive: true,
                        });
                    } else if (typeof this.validatePasswordComplexity === 'object') {
                        config = Object.assign(config, { isActive: true }, this.validatePasswordComplexity);
                        if (typeof config.chars === 'string'){
                            config.chars = _parseCharsRequirement(config.chars);
                        }
                    }
                }

                let error = '',
                    hasLowercase = /[a-zа-я]/.test(value),
                    hasUppercase = /[A-ZА-Я]/.test(value),
                    hasDigits = /\d/.test(value),
                    hasNonAlNum = /[^\w\d\s]/.test(value);

                function _hasStopWords(value) {
                    let stopWords = config.stopWords && config.stopWords.split(/\W+/) || [];
                    let hasStopWords = false;
                    stopWords.forEach(word => hasStopWords = hasStopWords || value.toLowerCase().indexOf(word.toLowerCase()) >= 0);
                    return hasStopWords;
                }

                // console.log({config});

                if (config.isActive) {
                    // console.log(`password check active ${config.minLength} ${value.length}`);
                    if(!error && config.minLength && value.length < config.minLength){
                        error = 'validate-password-complexity-message-min-length';
                    }
                    if(!error && _hasStopWords(value)){
                        error = 'validate-password-complexity-message-username-parts';
                    }

                    if(config.minComplexity){
                        if(!error){
                            let complexity = 0;
                            complexity += hasLowercase ? 1 : 0;
                            complexity += hasUppercase ? 1 : 0;
                            complexity += hasDigits ? 1 : 0;
                            complexity += hasNonAlNum ? 1 : 0;
                            if(complexity < config.minComplexity){
                                error = 'validate-password-complexity-message-low-complexity';
                            }
                        }
                    }else{
                        if(!error && config.chars.lowercase && !hasLowercase){
                            error = 'validate-password-complexity-message-lowercase';
                        }
                        if(!error && config.chars.uppercase && !hasUppercase){
                            error = 'validate-password-complexity-message-uppercase';
                        }
                        if(!error && config.chars.digits && !hasDigits){
                            error = 'validate-password-complexity-message-digits';
                        }
                        if(!error && config.chars.nonAlNum && !hasNonAlNum){
                            error = 'validate-password-complexity-message-non-alphanumeric';
                        }
                    }

                }

                if (!silent) {
                    if (!error) {
                        this.setState('valid');
                    } else {
                        this.setState('error', nls._(error, {
                            label: this.label,
                            minLength: config.minLength,
                            value
                        }));
                    }

                }

                // console.log(`password '${value}' is ${error ? 'invalid' : 'valid'}`);

                return !error;

            },

            /**
             * Check if password repeat field value matches password value
             *
             * ```
             * <form-field :validate-password-repeat="{password: passwordModel, message:'Passwords do not match'}">
             *      ...
             * </form-field>
             * ```
             *
             * or
             *
             * ```
             * <form-field :validate-password-repeat="passwordModel">
             *      ...
             * </form-field>
             * ```
             */
            checkPasswordRepeat (value, silent) {
                let config = {
                    message: 'validate-password-repeat-message',
                    isActive: false,
                    password: '',
                };
                if (this.validatePasswordRepeat!==undefined) {
                    // console.log('checking complexity');
                    if (typeof this.validatePasswordRepeat === 'string') {
                        config = Object.assign(config, {
                            password: this.validatePasswordRepeat,
                            isActive: true,
                        });
                    } else if (typeof this.validatePasswordRepeat === 'object') {
                        config = Object.assign(config, { isActive: true }, this.validatePasswordRepeat);
                    }
                }

                let valid = true;

                if (config.isActive) {
                    valid = config.password === value;
                }

                if (!silent) {
                    if (valid) {
                        this.setState('valid');
                    } else {
                        this.setState('error', nls._(config.message, {
                            label: this.label,
                            value: this.getValue()
                        }));
                    }

                }

                return valid;

            },

            /**
             * Check field value with custom callback
             *
             * ```
             * <form-field :validate-custom="{validate: validateSalary, message: 'Salary is too low'}">
             *      ...
             * </form-field>
             *
             *      or
             *
             * <form-field :validate-custom="{validate: value => value > 5000, message: 'Salary is too low'}">
             *      ...
             * </form-field>
             *
             *      or
             *
             * <form-field :validate-custom="value => value > 5000">
             *      ...
             * </form-field>
             * ```
             */
            checkCustom (value, silent) {
                let config = {
                    message: 'validate-custom-message',
                    isActive: false,
                    validate () {
                        return true;
                    }
                };

                if (this.validateCustom) {
                    if (typeof this.validateCustom === 'function') {
                        config = Object.assign(config, { isActive: true, validate: this.validateCustom });
                    } else if (typeof this.validateCustom === 'object') {
                        config = Object.assign(config, { isActive: true }, this.validateCustom);
                    }
                }

                let valid = true;
                if (config.isActive && config.validate && typeof config.validate === 'function') {
                    valid = config.validate(value);
                }

                if (!silent) {
                    if (valid) {
                        this.setState('valid');
                    } else {
                        this.setState('error', nls._(config.message, {
                            label: this.label,
                            value: this.getValue()
                        }));
                    }
                }

                return valid;
            },

            /**
             * Check field value with custom async validate function and callback
             *
             * <form-field :validate-async="{validate: validateSalary, callback: salaryValid, message: 'Salary is too low', progressMessage: 'validating data', delay: 500}">
             *      ...
             * </form-field>
             **/
            checkAsync (value, silent, options = {}) {
                let config = {
                    message: 'validate-custom-message',
                    progressMessage: 'validate-progress-message',
                    isActive: false,
                    delay: 500,
                    fakeDelay: 0,
                    validate (value, cb) {
                        cb(true, value);
                    },
                    callback () {
                    }
                };

                if (this.validateAsync) {
                    config = Object.assign(config, { isActive: true }, this.validateAsync);
                }

                if (options) {
                    Object.assign(config, options);
                }

                let valid = true;
                let self = this;

                /**
                 * Callback wrapper that sets the field state and caches validation result for value
                 *
                 * @param {boolean} valid
                 * @param {string} value
                 * @param {string} message
                 * @private
                 */
                function _callback(valid, value, message = '') {
                    if (!silent) {
                        self.setState(valid ? 'valid' : 'error', valid ? message || self.approval : nls._(config.message, {
                                label: self.label,
                                value: self.getValue()
                            }));
                    }
                    self.asyncCache[value] = [valid, message];
                    if (config.callback && typeof config.callback === 'function') {
                        config.callback(valid, value, message);
                    }
                }

                /**
                 * Validate wrapper that sets progress field state and performs debounce if needed
                 *
                 * @param {string|number} value
                 * @return {boolean|null}
                 * @private
                 */
                function _validate(value) {
                    if (self.asyncCache[value] !== undefined) {
                        let [valid, message] = self.asyncCache[value];
                        // console.log(`Cached: ${value} is ${valid ? 'valid' : 'invalid'} | ${message}`);
                        _callback(valid, value, message);
                        return valid;
                    } else {
                        if (self.asyncTimeout) {
                            window.clearTimeout(self.asyncTimeout);
                        }
                        // console.log({ config });
                        self.asyncTimeout = window.setTimeout( () => {
                            if (!silent) {
                                self.setState('progress', nls._(config.progressMessage, {
                                    label: self.label,
                                    value: self.getValue()
                                }));
                            }

                            window.setTimeout(() => {
                                config.validate(value, _callback)
                            }, config.fakeDelay || 0);
                        }, config.delay);

                    }
                    return null;
                }

                if (config.isActive && config.validate && typeof config.validate === 'function') {
                    this.asyncCache = this.asyncCache || {};

                    valid = _validate(value);
                }

                if (!silent) {
                    if (valid) {
                        this.setState('valid');
                    } else {
                        if (valid !== null) {
                            this.setState('error', nls._(config.message, {
                                label: this.label,
                                value: this.getValue()
                            }));
                        }
                    }
                }

                return valid;
            },

            /**
             * Check field value with async api call, validation success server denotes by HTTP 400 header, failure by HTTP 500.
             *
             * ```
             * <form-field :validate-api="{url: '/api/validate-data/?data={{value}}', message: 'Salary is too low', delay: 500, callback: registerAnswer}">
             *      ...
             * </form-field>
             *
             *      or
             *
             * <form-field validate-api="/api/validate-data/{{value}}">
             *      ...
             * </form-field>
             */
            checkApi (value, silent, options) {
                let config = {
                    message: 'validate-custom-message',
                    progressMessage: 'validate-progress-message',
                    isActive: false,
                    delay: 500,
                    url: '',
                    post: false,
                    callback () {
                    }
                };
                if (this.validateApi) {
                    if (typeof this.validateApi === 'string') {
                        config = Object.assign(config, {
                            url: this.validateApi,
                            isActive: true,
                        });
                    } else if (typeof this.validateApi === 'object') {
                        config = Object.assign(config, { isActive: true }, this.validateApi);
                    }
                }
                Object.assign(config, options);
                if (config.url) {
                    config.validate = (value, callback) => {
                        let url = config.url.replace(/\{value}/, encodeURIComponent(value));
                        let promise = config.post ? Vue.http.post(url, {value}) : Vue.http.get(url);
                        promise.then(
                            response => {
                                callback(true, value, response.body && response.body.message || '');
                            },
                            response => {
                                callback(false, value, response.body && response.body.message || config.message);
                            }
                        );
                    };
                    return this.checkAsync(value, silent, config);
                }
                return true;
            },

            /**
             * Run all validations
             * @param silent
             * @param event
             * @return {*}
             */
            validate (silent = false, event = ''){
                let value = this.getValue();
                let valid = this.checkRequired(value, silent);
                let delay = event !== 'keyup' ? { delay: 0 } : {};
                if (value) {
                    valid = valid && this.checkLength(value, silent);
                    valid = valid && this.checkRange(value, silent);
                    valid = valid && this.checkRegexp(value, silent);
                    valid = valid && this.checkEmail(value, silent);
                    valid = valid && this.checkPasswordComplexity(value, silent);
                    valid = valid && this.checkPasswordRepeat(value, silent);
                    valid = valid && this.checkCustom(value, silent);
                    valid = valid && this.checkAsync(value, silent, delay);
                    valid = valid && this.checkApi(value, silent, delay);
                } else if (valid) {
                    this.setState('clean');
                }

                // console.log(`value: ${value} is ${valid ? 'valid' : 'invalid'}`);
                return valid;
            }
        },
    }
</script>

<style rel="stylesheet/less" lang="less">
    .chayka-form-field {

        margin-bottom: 1em;

        label{
            min-height: 32px;
            line-height: 32px;
            font-size: 16px;
            border: 1px transparent solid;
            box-sizing: border-box;

            &:empty{
                display: none;
            }

        }

        & > .field-label{
            cursor: auto;
            display: block;
            padding-right: 1ex;
        }

        & > .field-input{
            & > .input-box{
                & > input[type=text],
                & > input[type=password],
                & > input[type=number],
                & > input[type=email],
                & > input[type=search],
                & > input[type=tel],
                & > input[type=url],
                & > select,
                & > textarea{
                    width: 100%;
                    margin: 0;
                    font-size: 16px;
                    min-height: 32px;
                    line-height: 32px;
                    box-sizing: border-box;
                    border: 1px solid;
                    padding: 0 1ex;
                }

                & > textarea{
                    resize: vertical;
                    line-height: normal;
                }

                & input[type=radio]{
                    margin-right: .9em;
                    margin-left: 0;
                }

                & input[type=checkbox]{
                    margin-right: 1ex;
                }

                label{
                    white-space: nowrap;
                    margin-right: 1ex;
                }
            }
            & > .message {

            }
        }

        &.progress {
            .field-input{
                position: relative;
                &::before {
                    content: ' ';
                    position: absolute;
                    z-index: 2;
                    display: inline-block;
                    width: 32px;
                    height: 32px;
                    background-color: #333;
                    vertical-align: center;
                    top: 1px;
                    right: 1px;

                    border-radius: 100%;
                    -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
                    animation: sk-scaleout 1.0s infinite ease-in-out;
                }
            }

            @-webkit-keyframes sk-scaleout {
                0% { -webkit-transform: scale(0) }
                100% {
                    -webkit-transform: scale(1.0);
                    opacity: 0;
                }
            }

            @keyframes sk-scaleout {
                0% {
                    -webkit-transform: scale(0);
                    transform: scale(0);
                } 100% {
                      -webkit-transform: scale(1.0);
                      transform: scale(1.0);
                      opacity: 0;
                  }
            }
        }

        &.radio {
            & > .field-label{
                flex: 0 0 initial;
            }
            & > .field-input{
                & > .message {
                    text-align: left;
                }
            }
        }
    }

    @color-valid: #050;
    @color-error: #600;
    @color-progress: #333;

    .colorize-field-background{
        .chayka-form-field{
            padding: 1ex;
        }
        .valid{
            background-color: lighten(@color-valid, 75%);
        }
        .error{
            background-color: lighten(@color-error, 75%);
        }
        .progress{
            background-color: lighten(@color-progress, 75%);
        }
    }

    .colorize-label{
        .valid{
            .field-label{
                color: @color-valid;
            }
        }
        .error{
            .field-label{
                color: @color-error;
            }
        }
        .progress{
            .field-label{
                color: @color-progress;
            }
        }
    }

    .colorize-input, .colorize-input-border{
        .valid{
            .input-box {
                & > input[type=text],
                & > input[type=password],
                & > input[type=number],
                & > input[type=email],
                & > input[type=search],
                & > input[type=tel],
                & > input[type=url],
                & > select,
                & > textarea {
                    outline-color: @color-valid;
                    border-color: @color-valid;
                }
            }
        }
        .error{
            .input-box {
                & > input[type=text],
                & > input[type=password],
                & > input[type=number],
                & > input[type=email],
                & > input[type=search],
                & > input[type=tel],
                & > input[type=url],
                & > select,
                & > textarea {
                    outline-color: @color-error;
                    border-color: @color-error;
                }
            }
        }
        .progress{
            .input-box {
                & > input[type=text],
                & > input[type=password],
                & > input[type=number],
                & > input[type=email],
                & > input[type=search],
                & > input[type=tel],
                & > input[type=url],
                & > select,
                & > textarea {
                    outline-color: @color-progress;
                    border-color: @color-progress;
                }
            }
        }
    }

    .colorize-input, .colorize-input-background {
        .valid {
            .input-box {
                & > input[type=text],
                & > input[type=password],
                & > input[type=number],
                & > input[type=email],
                & > input[type=search],
                & > input[type=tel],
                & > input[type=url],
                & > select,
                & > textarea {
                    background-color: lighten(@color-valid, 80%);
                }
            }
        }
        .error {
            .input-box {
                & > input[type=text],
                & > input[type=password],
                & > input[type=number],
                & > input[type=email],
                & > input[type=search],
                & > input[type=tel],
                & > input[type=url],
                & > select,
                & > textarea {
                    background-color: lighten(@color-error, 75%);
                }
            }
        }
        .progress {
            .input-box {
                & > input[type=text],
                & > input[type=password],
                & > input[type=number],
                & > input[type=email],
                & > input[type=search],
                & > input[type=tel],
                & > input[type=url],
                & > select,
                & > textarea {
                    background-color: lighten(@color-progress, 75%);
                }
            }
        }
    }
    .colorize-input, .colorize-input-font {
        .valid {
            .input-box {
                & > input[type=text],
                & > input[type=password],
                & > input[type=number],
                & > input[type=email],
                & > input[type=search],
                & > input[type=tel],
                & > input[type=url],
                & > select,
                & > textarea,
                & > label {
                    color: @color-valid;
                }
            }
        }
        .error {
            .input-box {
                & > input[type=text],
                & > input[type=password],
                & > input[type=number],
                & > input[type=email],
                & > input[type=search],
                & > input[type=tel],
                & > input[type=url],
                & > select,
                & > textarea,
                & > label  {
                    color: @color-error;
                }
            }
        }
        .progress {
            .input-box {
                & > input[type=text],
                & > input[type=password],
                & > input[type=number],
                & > input[type=email],
                & > input[type=search],
                & > input[type=tel],
                & > input[type=url],
                & > select,
                & > textarea,
                & > label {
                    color: @color-progress;
                }
            }
        }

    }

    .colorize-message{
        .valid {
            .field-input {
                & > .message {
                    color: @color-valid;
                }
            }
        }
        .error {
            .field-input {
                & > .message {
                    color: @color-error;
                }
            }
        }
        .progress {
            .field-input {
                & > .message {
                    color: @color-progress;
                }
            }
        }
    }

    .message-float{
        .field-input{
            & > .message{
                display: none;
                position: relative;
                z-index: 1;
                border-radius: 5px;
                border: 1px solid black;
                background: black;
                color: white;
                padding: .6em;

                &::before{
                    content: ' ';
                    display: block;
                    width: 1em;
                    height: 1em;
                    border-width: 1px;
                    border-color: black;
                    border-style: solid none none solid;
                    position: absolute;
                    background: inherit;
                }
            }
        }
        &.focus > .field-input, .focus > .field-input {
            & > .message {
                display: block;
                &.empty{
                    display: none;
                }
            }
        }
        &.message-float-bottom{
            .field-input{
                position: relative;
                & > .message{
                    position: absolute;
                    margin: 1em 0 0;
                    left: 1em;

                    &::before{
                        top: -.55em;
                        left: 2em;
                        -webkit-transform: rotate(45deg);
                        -moz-transform: rotate(45deg);
                        -ms-transform: rotate(45deg);
                        -o-transform: rotate(45deg);
                        transform: rotate(45deg);
                    }
                }
            }
        }
        &.message-float-right{
            .field-input{
                position: relative;
                & > .message{
                    position: absolute;
                    top: 0;
                    left: 100%;
                    margin: 0 0 0 1em;
                    min-width: 120px;

                    &::before{
                        left: -.55em;
                        top: .65em;
                        -webkit-transform: rotate(-45deg);
                        -moz-transform: rotate(-45deg);
                        -ms-transform: rotate(-45deg);
                        -o-transform: rotate(-45deg);
                        transform: rotate(-45deg);
                    }
                }
            }
        }
    }

    .message-float.colorize-message {
        .valid{
            .field-input {
                & > .message {
                    border-color: @color-valid;
                    background: lighten(@color-valid, 5%);
                    color: white;

                    &::before {
                        border-color: @color-valid;
                    }
                }
            }
        }
        .error{
            .field-input {
                & > .message {
                    border-color: @color-error;
                    background: lighten(@color-error, 5%);
                    color: white;

                    &::before {
                        border-color: @color-error;
                    }
                }
            }
        }
        .progress{
            .field-input {
                & > .message {
                    border-color: @color-progress;
                    background: lighten(@color-progress, 5%);
                    color: white;

                    &::before {
                        border-color: @color-progress;
                    }
                }
            }
        }
    }

        .message-align-left{
        .message{
            text-align: left;
        }
    }

    .message-align-right{
        .message{
            text-align: right;
        }
    }

    .message-align-center{
        .message{
            text-align: center;
        }
    }

    .chayka-form-validator.fullsize .chayka-form-field, .chayka-form-field.fullsize{
        .field-label{
            display: block;
            width: 100%;
            padding-right: 0;
        }
    }

    .chayka-form-validator.stretch .chayka-form-field, .chayka-form-field.stretch{
        display: flex;
        .field-label{
            flex: 0 0 120px;
        }

        .field-input{
            flex: 1;
            & > .input-box{
            }
            & > .message {

            }
        }

    }

    .no-label{
        .field-label{
            display: none;
        }
    }

    .label-colon{
        .field-label::after{
            content: ':';
        }
    }
    .label-required-asterisk{
        .required{
            .field-label::after{
                content: '*';
            }
        }
        &.label-colon{
            .field-label::after{
                content: ':*';
            }
        }
    }

</style>