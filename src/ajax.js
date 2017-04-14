import Vue from 'vue';

import VueResource from 'vue-resource';

Vue.use(VueResource);

import modals from './modals';
import spinners from './spinners';

const ajax = {

    /**
     * Make http request
     *
     * @param {string} url
     * @param options
     * @param {string} options.method 'GET', 'POST', etc.
     * @param {object|boolean} options.spinner spinner object to show while request is being made
     * @param {string} options.spinnerMessage message to show while request is being made
     * @param {string|boolean} options.successMessage message to show when request completed successfully
     * @param {string|boolean} options.errorMessage message to show when request completed with error
     * @param {number|boolean} options.delay add faked delayin ms (used for testing only)
     * @param {formValidator} options.validator
     * @param {Modal} options.modal
     * @param {array} options.buttons
     * @param body
     */
    request (url, options, body = null) {

        options = Object.assign({
            method: 'get',
            spinner: true,
            spinnerMessage: 'Loading...',
            successMessage: true,
            errorMessage: true,
            validator: null,
        }, options);

        let spinnerId = null;

        /**
         * Shows spinner progress indicator
         */
        function showSpinner() {
            if (options.spinner) {
                if (typeof options.spinner === 'boolean') {
                    spinnerId = spinners.show(options.spinnerMessage);
                } else {
                    options.spinner.show(options.spinnerMessage)
                }
            }
        }

        /**
         * Hides spinner progress indicator
         */
        function hideSpinner() {
            if (options.spinner) {
                if (typeof options.spinner === 'boolean' && spinnerId) {
                    spinnerId = spinners.hide(spinnerId);
                } else {
                    options.spinner.hide();
                }
            }
        }

        /**
         * Disable buttons so user won't click save or cancel twice
         */
        function disableButtons() {
            // console.log({buttons: options.buttons})
            (options.buttons || options.modal && options.modal.getButtonElements() || [])
                .forEach(button => button.disabled = true)
        }

        /**
         * Enable buttons after request is completed
         */
        function enableButtons () {
            (options.buttons || options.modal && options.modal.getButtonElements() || [])
                .forEach(button => button.disabled = false)
        }

        if (options.validator && !options.validator.validateFields()) {
            return Vue.Promise.reject({
                validationErrors: options.validator.getErrors ()
            });
        }

        options.before = function () {
            showSpinner()
            disableButtons()
        };

        function sleep(ms) {
            return new Vue.Promise(resolve => setTimeout(resolve, ms));
        }


        let promise = null;
        switch (options.method) {
            case 'get':
            case 'head':
            case 'jsonp':
            case 'delete':
                promise = Vue.http[options.method](url, options);
                break;
            case 'post':
            case 'put':
            case 'patch':
                promise = Vue.http[options.method](url, body, options);
                break;
            default:
                throw new Error('HTTP method not set');
        }

        function onSuccess (response) {
            hideSpinner()
            enableButtons()
            if (options.successMessage) {
                let message = '';
                if (typeof options.successMessage === 'boolean') {
                    message = response.body.message || '';
                } else {
                    message = options.successMessage;
                }
                if (message) {
                    modals.alert(message);
                }
            }
            return response;
        }

        function onError (response) {
            hideSpinner()
            enableButtons()
            if (response.body.code === 'validation-errors' && options.validator){
                options.validator.showErrors(response.body.payload);
            }
            if (options.errorMessage) {
                let message = '';
                if (typeof options.errorMessage === 'boolean') {
                    message = response.body.message || 'Server responded with an error';
                } else {
                    message = options.errorMessage;
                }
                if (message) {
                    modals.alert(message);
                }
            }
            return Vue.Promise.reject(response);
        }

        return sleep(options.delay || 0).then(() => promise.then(
            response => response.body && !response.body.code ? onSuccess(response) : onError(response),
            onError
        ));
    },

    get (url, options) {
        options = options || {};
        options.method = 'get';
        return ajax.request(url, options);
    },

    head (url, options) {
        options = options || {};
        options.method = 'head';
        return ajax.request(url, options);
    },

    jsonp (url, options) {
        options = options || {};
        options.method = 'jsonp';
        return ajax.request(url, options);
    },

    delete (url, options) {
        options = options || {};
        options.method = 'delete';
        return ajax.request(url, options);
    },

    post (url, body, options) {
        options = options || {};
        options.method = 'post';
        return ajax.request(url, options, body);
    },

    put (url, body, options) {
        options = options || {};
        options.method = 'put';
        return ajax.request(url, options, body);
    },

    patch (url, body, options) {
        options = options || {};
        options.method = 'patch';
        return ajax.request(url, options, body);
    },

    resource (urlPattern, defaultOptions) {

        function getUrl(params) {
            return Vue.url(urlPattern, params);
        }

        return {
            get(params, options){
                return ajax.get(getUrl(params), Object.assign({}, defaultOptions, options));
            },

            query(params, options){
                return ajax.get(getUrl(params), Object.assign({}, defaultOptions, options));
            },

            save(params, body, options){
                return ajax.post(getUrl(params), body, Object.assign({}, defaultOptions, options));
            },

            update(params, body, options){
                return ajax.put(getUrl(params), body, Object.assign({}, defaultOptions, options));
            },

            remove(params, options){
                return ajax.delete(getUrl(params), Object.assign({}, defaultOptions, options));
            },

            delete(params, options){
                return ajax.delete(getUrl(params), Object.assign({}, defaultOptions, options));
            },

        }

    }
};

export default ajax;