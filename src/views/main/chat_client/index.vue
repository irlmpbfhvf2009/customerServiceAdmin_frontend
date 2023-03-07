<template>
  <div class="container">
    <h1>Chat Room</h1>
    <div class="layout-container">
      <div v-for="m in messages" class="chat-bubble" :class="[m.sender === 'me' ? 'sender' : 'receiver']">
        <div class="time">03-07 15:01:31</div>
        <div class="message">{{ m.content }}</div>
      </div>
    </div>

    <div class="input-box">
      <input type="text" v-model="messageInput" class="received" placeholder="Type your message here..."
        @keyup.enter="sendMessage" />
      <button @click="sendMessage">
        Send
      </button>
    </div>
  </div>
</template>
  
<script>
import Stomp from "stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { socketData } from './enum';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export default ({
  setup() {
    const room = ref([])
    const messages = ref([]);
    const messageInput = ref('');
    const stompClient = ref(null);

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
        stompClient.value.subscribe('/topic/chat/' + uniqueId, (message) => {
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

    // 啟動連線
    // connect()

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
      messages,
      messageInput,
      sendMessage,
    };
  }

})
</script>
<style>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

.container {
  width: 50%;
  height: 500px;
  min-width: 400px;
  margin: 0 auto;
}

.layout-container {
  width: 100%;
  height: 95%;
  margin: 0px;
  background-color: rgb(243, 244, 248);
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  padding-top: 50px;
  margin-bottom: 20px;
}

.input-box {
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}

input[type="text"] {
  height: 40px;
  width: calc(100% - 110px);
  border: none;
  border-radius: 10px;
  padding: 0 20px;
  font-size: 16px;
}


input[type="text"].received {
  background-color: #e6e6e6;
  color: #000;
}

button {
  height: 40px;
  width: 60px;
  border: none;
  border-radius: 20px;
  background-color: #0084ff;
  color: #fff;
  font-size: 16px;
  margin-left: 10px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0073cc;
}




.chat-bubble {
  position: relative;
  border-radius: 10px;
  max-width: 70%;
  padding: 10px 20px;
  margin-bottom: 25px;
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

.chat-bubble.receiver .time {
  position: absolute;
  top: -15px;
  left: 0;
  font-size: 12px;
  color: #a6a6a6;
  margin: 0;
  padding: 0;
}

.chat-bubble.sender .time {
  position: absolute;
  top: -15px;
  right: 0;
  font-size: 12px;
  color: #a6a6a6;
  margin: 0;
  padding: 0;
}
</style>