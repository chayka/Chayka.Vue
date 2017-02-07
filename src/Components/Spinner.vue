<template>
    <div class="surge-spinner"
         :style="visibilityStyle">
        <span class="spinner-css"></span>
        <span class="spinner-message" v-if="!message"><slot></slot></span>
        <span class="spinner-message" v-if="!!message">{{message}}</span>
    </div>
</template>

<script>
export default{
    name: 'Spinner',
    props: {
        mode: {
            default: 'display',
            type: String
        },
        message: {
            default: '',
            type: String
        },
        visible: {
            default: false,
            type: Boolean
        }
    },
    data () {
        return {
        }
    },
    computed: {
        visibilityStyle () {
            return {
                display: this.mode === 'display' && !this.visible ? 'none' : '',
                visibility: this.mode === 'visibility' && !this.visible ? 'hidden' : ''
            }
        }
    },
    methods: {

        /**
         * Show spinner with a message
         * @param message
         */
        show (message = '') {
            this.message = message
            this.visible = true
        },

        /**
         * Hide spinner
         */
        hide () {
            this.visible = false
        }
    }
}
</script>

<style lang="less">

@img-width: 24px;
@img-height: 24px;
@size-padding: 10px;

.surge-spinner {
    padding: 0 0 0 0;
    // background: url('../assets/spinner32x32.gif') no-repeat 0 0;
    background-size: @img-width @img-height;
    min-height: @img-height;
    line-height: @img-height;
    vertical-align: middle;
    display: inline-flex;

     & .spinner-css {
        display: inline-block;
        width: @img-height;
        height: @img-height;
        background-color: #333;
        margin-right:  @size-padding;
        display: inline-block;
        vertical-align: center;

        border-radius: 100%;  
        -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
        animation: sk-scaleout 1.0s infinite ease-in-out;
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

    & > .spinner-message{
        vertical-align: center;
        line-height: @img-height;
    }
}

</style>