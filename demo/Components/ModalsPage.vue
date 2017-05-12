<template>
    <div class="page page-ajax">
        <h1>Modals Demo</h1>
        <button @click="alertClicked()">Alert me!</button>
        <button @click="alert2Clicked()">Alert me double!</button>
        <button @click="confirmClicked()">Confirm me!</button>
        <button @click="popupClicked()">Popup me!</button>
        <modal ref="modalPopup"
               title="Lorem Ipsum..."
               :buttons="[{text: 'Persist', persist: true, click: doStuff, cls:'btn-persist'}, {text:'Close', cls:'btn-close'}, {text:'Close 2', value: 'hide', cls:'btn-close'}]"
               :cls="['custom-popup']"
               width="500px"
               height="auto"
               :auto-open="false"
               @hide="hidePopup">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.</p>
            <form-field label="What's your name?">
                <input/>
            </form-field>
        </modal>

    </div>
</template>

<script>
    import modals from '../../src/modals'

    export default {
        name: 'ModalsPage',
        created () {
            modals.setButtonClasses({
                regular: 'btn',
                primary: 'btn-primary',
            })
        },
        methods: {

            alertClicked () {
                modals.alert('Alert was clicked!', 'Alert...', () => {
                    console.log('Alert closed');
                });
            },

            alert2Clicked () {
                modals.alert('Alert double was clicked!\n Alert 2 comming soon!', 'Alert...', () => {
                    console.log('Alert closed');
                });
                modals.alert('Alert 2 is on the scene!', 'Alert...', () => {
                    console.log('Alert closed');
                });
            },

            confirmClicked () {
                modals.confirm('Send expedition to Mars?', 'Confirm...', () => {
                    console.log('Expedition sent');
                });
            },

            popupClicked () {
                console.log({popup: this.$refs.modalPopup});
                this.$refs.modalPopup.show();
            },

            doStuff () {
                console.log('Stuff done!');
                let buttons = this.$refs.modalPopup.getButtonRefs();
                console.log({buttons});

            },

            hidePopup (reason) {
                console.log(`Popup closed (${reason})`);
            }
        }
    }
</script>

<style lang="less">

</style>