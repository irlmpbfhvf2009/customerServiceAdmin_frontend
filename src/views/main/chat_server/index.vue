<template>
    <div class="box">
        <div class="chat-window">
            <div class="message-list" ref="messageList">
                <div v-for="(message, index) in messages" :key="index" class="message">
                    <div class="message-header">
                        {{ message.sender }} said:
                        <span class="message-time">{{ message.time }}</span>
                    </div>
                    <div class="message-body">{{ message.text }}</div>
                </div>
            </div>
            <div class="message-input">
                <input type="text" v-model="messageInput" @keyup.enter="sendMessage">
                <button @click="sendMessage">Send</button>
            </div>
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
    const messageList = ref(null);
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
      console.log(message)
      messages.value.push({
        uniqueId: message.uniqueId,
        content: message.content,
      })
    }
    const sendMessage = () => {
      if (!messageInput.value) {
        return
      }

      const message = {
        uniqueId: uniqueId,
        content: messageInput.value,
      }
      console.log(JSON.stringify(message))
      stompClient.value.send('/app/topic/chat/'+uniqueId, {}, JSON.stringify(message))
      messageInput.value = ''
    }
    return {
      stompClient,
      messages,
      messageInput,
      messageList,
      connect,
      handleMessage,
      sendMessage,
    }
  }
})
</script>
  
<style lang="scss" scoped>
.box {
    padding: 15px;
}
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  background-color: #eee;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px;
}

.message-header {
  font-weight: bold;
}

.message-time {
  color: #999;
  font-size: 80%;
  margin-left: 10px;
}

.message-body {
  margin-top: 5px;
}

.message-input {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.message-input input[type="text"] {
  flex: 1;
  padding: 5px;
  border-radius: 5px;
  border: none;
  margin-right: 10px;
}

.message-input button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>