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

    <div class="input-container">
      <input type="text" placeholder="Type your message here..." v-model="messageInput" @keyup.enter="sendMessage">
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>
  
<script>
import { defineComponent, ref, reactive, inject, watch } from 'vue'
import Stomp from "stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { socketData } from './enum';
import { useStore } from 'vuex'

export default defineComponent({
  components: {
  },
  setup() {
    const stompClient = ref(null);
    const sender = ref('');
    const reactive = ref('');
    const messages = ref([]);
    const messageInput = ref('');
    const store = useStore()
    sender.value = store.state.user.info.id;

    const connect = () => {
      const socket = new SockJS(socketData[0].label)
      stompClient.value = Stomp.over(socket)
      stompClient.value.connect({}, () => {
        stompClient.value.subscribe('/chat.addUser', (message) => {
          console.log("addUser:")
          console.log(message)
          handleMessage(JSON.parse(message.body))
        })
      })
    }
    connect()
    const handleMessage = (message) => {
      messages.value.push({
        uniqueId: message.uniqueId,
        content: message.content,
      })
    }
    function sendMessage() {
      if (messageInput.value) {
        const message = { id: Date.now(), uniqueId: uniqueId, sender: 'me', content: messageInput.value };
        messages.value.push(message);
        console.log(message)
        console.log(JSON.stringify(message))
        stompClient.value.send('/app/topic/chat/' + uniqueId, {}, JSON.stringify(message))
        messageInput.value = ''
      }
    }
    return {
      messageInput,
      sendMessage,
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

.message-container {
  margin-bottom: 60px;
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
  margin-right: auto;
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

.input-container {
  position: fixed;
  bottom: 0;
  left: 1;
  width: 60%;
  height: 50px;
  padding: 0 10px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.input-container input[type='text'] {
  flex: 1;
  height: 40px;
  padding: 0 10px;
  border: none;
  outline: none;
  font-size: 16px;
}

.input-container button {
  background-color: blue;
  color: white;
  font-size: 16px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>