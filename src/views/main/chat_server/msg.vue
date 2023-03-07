<template>
    <div class="layout-container">
        <div class="chat-bubble sender">
            <div class="time">03-07 15:01:31</div>
            <div class="message">嗨，這是一則發送者訊息！</div>
        </div>

        <div class="chat-bubble receiver">
            <div class="time">03-07 15:01:31</div>
            <div class="message">嗨，這是一則接收者訊息！</div>
        </div>

    </div>
</template>
  
<script>
import { defineComponent, ref, reactive, inject, watch } from 'vue'
export default defineComponent({
    components: {
    },
    setup() {

        // getTableData(true)
        return {
        }
    }
})
</script>
  
<style lang="scss" scoped>
.layout-container {
    width: calc(100% - 10px);
    height: 100%;
    margin: 0 0 0 0px;
    padding-top: 30px;
    background-color: rgb(243, 244, 248);
}
.chat-bubble {
  position: relative;
  border-radius: 10px;
  max-width: 60%;
  padding: 10px 20px;
  margin: 10px;
  margin-bottom: 0px;
}

.chat-bubble.sender {
  background-color: #fff;
  margin-left: auto;
}

.chat-bubble.receiver {
  background-color: #bae2ff;
  margin-right:auto;
}

.chat-bubble .message {
  font-size: 16px;
  color: #2E2E2E;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}
.chat-bubble .time {
  position: absolute;
  top: -20px;
  right: 0;
  font-size: 12px;
  color: #a6a6a6;
  margin: 0;
  padding: 0;
  text-align: right;
}

</style>