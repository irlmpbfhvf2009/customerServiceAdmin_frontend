<template>
  <div class="container">
    <h1>Chat Room</h1>
    <div class="layout-container">
      <div v-for="m in messages" class="chat-bubble" :class="[m.sender === uniqueId ? 'sender' : 'receiver']">
        <div class="message">{{ m.content }}</div>
        <div class="time">{{ m.timestamp }}</div>
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
    const stompClient = ref(null);
    const messages = ref([]);
    const messageInput = ref('');
    const user = ref(null);

    // 檢查cookie中是否有識別碼，如果沒有，生成一個新的識別碼
    let uniqueId = document.cookie.replace(/(?:(?:^|.*;\s*)uniqueId\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!uniqueId) {
      uniqueId = uuidv4();
      document.cookie = `uniqueId=${uniqueId};path=/`;
    }
    const socket = new SockJS(socketData[0].label)
    stompClient.value = Stomp.over(socket)
    stompClient.value.connect({}, () => {
      stompClient.value.subscribe('/topic/userUpdate', (message) => {
        handleUserUpdate(JSON.parse(message.body))
      })
      stompClient.value.subscribe('/user/'+uniqueId+'/queue/messages', (message) => {
        console.log("進入/user/queue/messages")
        const chatMessage = JSON.parse(message.body)
        console.log(chatMessage)
        chatMessage.timestamp = new Date(chatMessage.timestamp).toLocaleTimeString()
        messages.value.push(chatMessage)
      })
      stompClient.value.subscribe('/exchange/offline.message.exchange/user.' + uniqueId, message => {
        console.log("進入/exchange/offline.message.exchange/user")
        const content = JSON.parse(message.body).content;
        console.log('Received message:', content);
      })
      stompClient.value.send('/app/chat.userUpdate', {},
        JSON.stringify({ sender: uniqueId, timestamp: new Date(), isUser: true, type: 'JOIN' }))
    })

    const handleUserUpdate = (message) => {
      console.log(message)
      console.log('----------------')
      user.value = message
      console.log( user.value )
    };


    function sendMessage() {
      if(user.value.receiver === null){
        location.reload();
      }
      if (messageInput.value && messageInput.value !== '') {
        messages.value.push({
          sender: uniqueId,
          timestamp: new Date().toLocaleTimeString(),
          content: messageInput.value
        });
      }
      stompClient.value.send('/app/chat.sendMessage', {},
                  JSON.stringify({
                    sender: uniqueId,
                    receiver: user.value.receiver,
                    isUser:true,
                    ip: user.value.ip,
                    content: messageInput.value,
                    timestamp: new Date()
                  }));
      messageInput.value = ''
    }
    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      stompClient.value.send('/app/chat.userUpdate', {}, JSON.stringify({ sender: uniqueId, isUser: true, type: 'LEAVE' }));
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