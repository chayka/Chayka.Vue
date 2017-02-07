<template>
    <div class="surge-modals">
        <modal ref="modal" v-for="(modal, i) in queue"
               :title="modal.title"
               :buttons="modal.buttons"
               :cls="modal.cls"
               :width="modal.width"
               :height="modal.height"
               :auto-open="true"
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
            })
        },

        /**
         * Close current modal popup, by shifting queue
         */
        hide () {
            this.queue.shift()
        }

    },

    created () {
        modals.$on('show', this.show)
        modals.$on('hide', this.hide)
    }
}
</script>

<style lang="less">
.surge-modals{
    .surge-modals-fader{
        z-index: 100002;
        display: none;
        &:first-child{
            display: block;
        }
    }
}
</style>