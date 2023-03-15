<template>
  <div class="container">
    <h1>Chat Room</h1>
    <div class="layout-container">
      <div v-for="m in messages" class="chat-bubble" :class="[m.sender === uniqueId ? 'sender' : 'receiver']">
        <div class="message">{{ m.content }}</div>
        <div class="time">{{ m.timestamp.toLocaleTimeString() }}</div>
      </div>
    </div>

    <div class="input-box">
      <input type="text" v-model="messageInput" class="sent" placeholder="Type your message here..."
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
import { ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export default ({
  setup() {
    // 檢查cookie中是否有識別碼，如果沒有，生成一個新的識別碼
    let uniqueId = document.cookie.replace(/(?:(?:^|.*;\s*)uniqueId\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!uniqueId) {
      uniqueId = uuidv4();
      document.cookie = `uniqueId=${uniqueId};path=/`;
    }

    const chatMessage = ref({
      sender: uniqueId,
      receiver: null,
      ip: null,
      content: '',
      timestamp: new Date(),
      isUser: true,
      isOnline: true,
    });
    const stompClient = ref(null);
    const socket = new SockJS(socketData[0].label)
    const messages = ref([]);
    const messageInput = ref('');

    stompClient.value = Stomp.over(socket)
    stompClient.value.connect({ debug: null }, () => {
      chatMessage.value.isOnline = true;
      stompClient.value.subscribe('/topic/userOnlineStatus', (message) => {
        handleOnlineStatus(JSON.parse(message.body))
      })
      stompClient.value.subscribe('/user/' + uniqueId + '/queue/messages', (message) => {
        const queueMessage = JSON.parse(message.body)
        messages.value.push(queueMessage)
      })
      stompClient.value.send('/app/chat.userOnlineStatus', {}, JSON.stringify(chatMessage.value));
      
    })

    function handleOnlineStatus(message) {
      // new arraylist
      let adminList = new Set();
      for (let i = 0; i < message.length; i++) {
        if (!message[i].isUser) {
          adminList.add(message[i]);
        }
      }
      // random admin
      if (adminList.size === 0) {
        alert('尚無客服人員')
        return
      }
      let randomAdmin = Array.from(adminList)[Math.floor(Math.random() * adminList.size)];
      chatMessage.value.receiver = randomAdmin.sender;
    }

    function sendMessage() {
      if (chatMessage.value.receiver === null) {
        alert('尚無客服人員')
        return
      }
      if (messageInput.value === '') {
        return
      }
      chatMessage.value.content = messageInput.value;
      stompClient.value.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage.value));
      if (messageInput.value) {
        messages.value.push(chatMessage.value);
      }
      messageInput.value = ''
    }
    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      chatMessage.value.isOnline = false;
      stompClient.value.send('/app/chat.userOnlineStatus', {}, JSON.stringify(chatMessage.value));
    });
    return {
      uniqueId,
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


input[type="text"].sent {
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
  word-wrap: break-word;
  /* 新增的屬性 */
}

.chat-bubble.sender {
  background-color: #bae2ff;
  margin-left: auto;
}

.chat-bubble.receiver {
  background-color: #fff;
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
  bottom: -20px;
  left: 0px;
  font-size: 10px;
  color: #a6a6a6;
  margin: 0;
  padding: 0;
  width: 65px;
}

.chat-bubble.sender .time {
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: 10px;
  color: #a6a6a6;
  margin: 0;
  padding: 0;
  width: 65px;
}
</style>