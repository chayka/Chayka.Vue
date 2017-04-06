<template>
    <div class="chayka-modals">
        <modal ref="modal" v-if="modal"
               :title="modal.title"
               :buttons="modal.buttons"
               :cls="modal.cls"
               :width="modal.width"
               :height="modal.height"
               :auto-open="false"
               @hide="hide()">
            {{modal.content}}
        </modal>
    </div>
</template>

<script>
import modals from '../modals'
import Modal from './Modal.vue'
export default {
    name: 'Modals',
    components: {
        Modal
    },
    data () {
        return {
            queue: []
        }
    },

    computed: {
        modal () {
            return this.queue.length ? this.queue[0] : null
        }
    },
    methods: {

        /**
         * Add an item to a queue and thus show a modal window.
         *
         * @param {object} modal
         */
        show (modal) {
            this.queue.push({
                content: '',
                title: '',
                buttons: [],
                cls: [],
                width: '300px',
                height: 'auto',
                ...modal
            });
            let self = this;
            window.setTimeout(()=>{
                if(this.queue.length){
                    self.$refs.modal.show();
                }
            }, 100);
        },

        /**
         * Close current modal popup, by shifting queue
         */
        hide () {
            this.queue.shift();
            if(this.queue.length){
                this.$refs.modal.show();
            }
        }

    },

    created () {
        modals.$on('show', this.show);
        modals.$on('hide', this.hide)
    }
}
</script>

<style rel="stylesheet/less" lang="less">
.chayka-modals{
    .chayka-modals-fader{
        z-index: 100002;
        &:first-child{
        }
    }
}
</style>