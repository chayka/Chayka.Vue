<template>
    <div class="page page-ajax">
        <h1>Spinners Demo</h1>
        <button @click="showGeneral()">Add new spinner to general queue</button>
        <button @click="hideGeneral()" v-if="handles.length">Remove first spinner from general queue</button>
    </div>
</template>

<script>
    import spinners from '../../src/spinners';

    export default {
        name: 'SpinnersPage',
        data () {
            return {
                handles: [],
            }
        },
        created () {

        },
        methods: {
            showGeneral () {
                this.handles.push(spinners.show(`Spinner ${this.handles.length}`));
            },
            hideGeneral () {
                spinners.hide(this.handles.shift());
            }
        }
    }
</script>

<style lang="less">

</style>