<template>
    <transition name="modal" @after-leave="!opened && onClosed()">
        <div class="chayka-modals-fader"
             v-if="opened || autoOpen"
             :class="modalClass"
             @click.self="hide('close')"
             @keyup.esc="hide('close')">
            <div class="modals-modal"
                 :class="modalClass.concat(cls)"
                 :style="{width, height}">
                <div class="modal_header">
                    <div class="modal_header-title">{{title}}</div>
                    <div class="modal_header-close" @click="hide('close')">&times;</div>
                </div>
                <div class="modal_body">
                    <slot></slot>
                </div>
                <div class="modal_buttons" v-if="buttons && buttons.length">
                    <button v-for="button in buttons"
                            @click.prevent="buttonClicked(button)"
                            :class="[btnClasses.regular].concat(button.cls)">{{button.text}}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import modals from '../modals'

    export default {
        name: 'Modal',
        props: {
            autoOpen: {
                default: false,
                type: Boolean
            },
            width: {
                default: '300px',
                type: String
            },
            height: {
                default: 'auto',
                type: String
            },
            title: {
                default: '',
                type: String
            },
            buttons: {
                default: () => [],
                type: Array
            },
            cls: {
                default: () => [],
                type: Array
            }
        },
        data: () => {
            return {
                visible: false,
                opened: false,
                payload: null,
            }
        },
        created () {
            if (this.autoOpen) {
                this.open()
            }
        },
        computed: {
            modalClass () {
                let res = [];
                if (this.opened) {
                    res.push('opened');
                }
                if (this.visible) {
                    res.push('visible');
                }
                return res;
            },
            btnClasses () {
                return modals.getButtonClasses()
            }
        },
        methods: {
            /**
             * Show modal
             */
            show () {
                this.opened = true;
//            window.setTimeout(() => {
//                /**
//                 * this timeout is set for the 'open' animation to work
//                 */
//                this.visible = true
//            }, 100);
            },

            /**
             * Show modal (alias)
             */
            open () {
                this.show()
            },

            /**
             * Hide modal
             *
             * @param payload
             */
            hide (payload) {
                /**
                 * Keep in mind, that 'opened' set to false on animationend so css animation is crucial for the modal to hide
                 */
                this.opened = false;
                this.payload = payload;
            },

            /**
             * Hide modal (alias)
             *
             * @param payload
             */
            close (payload) {
                this.hide(payload)
            },

            /**
             * This callback is called when 'close' animation is completed
             */
            onClosed () {
                this.$emit('hide', this.payload);
            },

            /**
             * On button click
             * @param button
             */
            buttonClicked (button) {
                let payload = button.value === undefined ? button.text : button.value

                if (!button.persist) {
                    this.hide(payload)
                }

                if (button.click) {
                    button.click()
                }
            },

            /**
             * Get button elements so the ajax wrapper can disable/enable it
             */
            getButtonElements () {
                return this.$el.querySelectorAll('.modal_buttons button')
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less">
    .chayka-modals-fader {
        text-align: center;
        z-index: 100001;
        position: fixed;
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, .05);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
        vertical-align: middle;

        transition: all .1s ease-in;
        visibility: visible;
        opacity: 1;

        &.modal-enter, &.modal-leave-to {
            visibility: hidden;
            opacity: 0;
            & > .modals-modal {
                margin: 130px auto;
            }
        }

        & > .modals-modal {
            position: relative;
            background-color: white;
            display: inline-block;
            min-width: 300px;
            max-width: 100%;
            margin: 100px auto;
            border: 1px solid gray;
            box-sizing: border-box;

            transition: all .1s ease-in;

            & > .modal_header {
                position: relative;
                border-bottom: 1px solid #eeeeee;
                text-align: left;
                min-height: 30px;
                padding-top: 5px;
                & > .modal_header-title {
                    margin-left: 10px;
                    margin-right: 40px;
                    line-height: 30px;
                    text-align: left;
                }
                & > .modal_header-close {
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 30px;
                    height: 30px;
                    line-height: 30px;
                    font-size: 20px;
                    text-align: center;
                    cursor: pointer;
                    font-family: Arial, sans-serif;
                }
            }
            & > .modal_body {
                padding: 1em 10px;
                text-align: left;

            }
            &.pre-line > .modal_body {
                padding: 0 10px 1em;
                white-space: pre-line;

            }
            & > .modal_buttons {
                border-top: 1px solid #eeeeee;
                padding: 10px;
                text-align: right;
                & > button {
                    margin-left: 1em;
                }
            }
        }
    }

</style>