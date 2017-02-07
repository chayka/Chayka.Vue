<template>
    <div class="surge-modals-fader" v-if="visible || autoOpen" @click.self="hide('close')">
        <div class="modals-modal" :class="cls" :style="{width: width, height: height}">
            <div class="modal_header">
                <div class="modal_header-title">{{title}}</div>
                <div class="modal_header-close" @click="hide('close')">&times;</div>
            </div>
            <div class="modal_body"><slot></slot></div>
            <div class="modal_buttons" v-if="buttons && buttons.length">
                <button v-for="button of buttons"
                        @click.prevent="buttonClicked(button)"
                        class="button" :class="button.cls">{{button.text}}</button>
            </div>
        </div>
    </div>
</template>

<script>
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
            visible: false
        }
    },
    created () {
        if (this.autoOpen) {
            this.open()
        }
    },
    methods: {
        /**
         * Show modal
         */
        show () {
            this.visible = true
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
            this.visible = false
            this.$emit('hide', payload || 'unknown')
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
        }
    }
}
</script>

<style lang="less">
.surge-modals-fader{
    text-align: center;
    z-index: 100001;
    position: fixed;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0, .1);
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

    & > .modals-modal{
        position: relative;
        background-color: white;
        display: inline-block;
        min-width: 300px;
        max-width: 100%;
        margin: 100px auto;
        border: 1px solid gray;
        box-sizing: border-box;

        & > .modal_header{
            position: relative;
            border-bottom: 1px solid #eeeeee;
            text-align: left;
            min-height: 30px;
            padding-top: 5px;
            & > .modal_header-title{
                margin-left: 10px;
                margin-right: 40px;
                line-height: 30px;
                text-align: left;
            }
            & > .modal_header-close{
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
        & > .modal_buttons{
            border-top: 1px solid #eeeeee;
            padding: 10px;
            text-align: right;
            & > button{
                margin-left: 1em;
            }
        }
    }
}    
</style>