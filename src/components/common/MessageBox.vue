<template>
  <div id="messageContainer" v-show='visible != -1'>
    <div class="messageBox">
      <h3 class="font24">{{textOptions.title}}</h3>
      <div class="mes-content" v-if="textOptions.content!=''"><span class="font24">{{textOptions.content}}</span></div>
      <div class="mes-content" v-else>
        <slot name="content"></slot>
      </div>
      <div class="mes-footer"><button @click="confirmCallback">{{textOptions.confirme}}</button><button @click="cancelCallback" v-show="textOptions.cancel!=''">{{textOptions.cancel}}</button></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'messageBox',
    props: ['textOptions', 'visible'],
    data() {
      return {
        isOpen: 1
      }
    },
    methods: {
      confirmCallback() {
        if (this.textOptions.confirmCallback) {
          this.textOptions.confirmCallback();
        }
      },
      cancelCallback() {
        if (this.textOptions.cancelCallback) {
          this.textOptions.cancelCallback();
        }
      }
    },
  }
</script>

<style scoped>
  #messageContainer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(51, 51, 51, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .messageBox {
    margin: 0 auto;
    background: white;
    text-align: center;
    width: 800px;
    padding: 30px 0 50px;
    border-radius: 20px;
  }

  .messageBox h3 {
    font-weight: bold;
    color: #555555;
  }

  .messageBox .mes-content {
    margin: 60px 0 80px;
  }

  .messageBox .mes-content input {
    width: 590px;
    height: 38px;
    border: 1px solid #CDCDCD;
    border-radius: 10px;
    outline: none;
    padding-left: 10px;
  }

  .messageBox .mes-content span {
    color: #555555;
  }

  .mes-footer {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .mes-footer button {
    width: 128px;
    height: 38px;
    border: 2px solid #1D2088;
    border-radius: 10px;
    background: white;
    outline: none;
    font-size: 16px;
    color: #1D2088;
    font-weight: bold;
  }

  .mes-footer button:nth-child(1) {
    background: #1D2088;
    color: white;
  }
</style>