<template>
  <div>
    <h1>聊天室</h1>
    <div class="chat-container">
      <div v-for="message in messages" :key="message.uniqueId" :class="{ 'from-me': message.fromMe }">
        <div class="message">{{ message.message }}</div>
      </div>
    </div>
    <div class="input-container">
      <input v-model="messageInput" @keyup.enter="sendMessage" placeholder="輸入訊息...">
      <button @click="sendMessage">發送</button>
    </div>
  </div>
</template>
  
<script>
import Stomp from "stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { socketData } from './enum'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid';

export default ({
  setup() {
    const stompClient = ref(null);
    const messages = ref([]);
    const messageInput = ref('');
    // 檢查cookie中是否有識別碼，如果沒有，生成一個新的識別碼
    let uniqueId = document.cookie.replace(/(?:(?:^|.*;\s*)uniqueId\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!uniqueId) {
      uniqueId = uuidv4();
      document.cookie = `uniqueId=${uniqueId};path=/`;
    }

    const connect = () => {
      const socket = new SockJS(socketData[0].label)
      stompClient.value = Stomp.over(socket)
      stompClient.value.connect({}, () => {
        stompClient.value.subscribe('/topic/chat/'+uniqueId, (message) => {
          handleMessage(JSON.parse(message.body))
        })
      })
    }
    connect()

    const handleMessage = (message) => {
      console.log(message.message)
      // const fromMe = message.username === this.username
      messages.value.push({
        id: message.uniqueId,
        message: message.message,
      })
    }
    const sendMessage = () => {
      if (!messageInput.value) {
        return
      }

      const message = {
        uniqueId: uniqueId,
        message: messageInput.value,
      }
      console.log(JSON.stringify(message))
      stompClient.value.send('/app/topic/chat/'+uniqueId, {}, JSON.stringify(message))
      messageInput.value = ''
    }
    return {
      stompClient,
      messages,
      messageInput,
      connect,
      handleMessage,
      sendMessage,
    }
  }
})
</script>
  
<style>
.from-me {
  text-align: right;
}

.chat-container {
  height: 300px;
  overflow-y: scroll;
}

.message {
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
  background-color: #eee;
}
</style>
  