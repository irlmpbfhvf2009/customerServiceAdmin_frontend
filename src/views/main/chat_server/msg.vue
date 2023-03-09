<template>
  <div class="layout-container">
    <div v-for="m in messages" class="chat-bubble" :class="[m.sender === sender ? 'sender' : 'receiver']" >
    <!-- <div v-for="m in messages.filter(item => item.sender === t || itme.receiver === sender)" class="chat-bubble" :class="[m.sender === sender ? 'sender' : 'receiver']" > -->

      <div class="message">{{ m.content }}</div>
        <div class="time">{{ m.timestamp }}</div>
      </div>

  </div>

  <div class="input-container" :style="inp_display">
    <input type="text" placeholder="Type your message here..." v-model="messageInput" @keyup.enter="sendMessage">
    <button @click="sendMessage">Send</button>
  </div>
</template>
  
<script>
import { defineComponent, ref, reactive, inject, watch } from 'vue'
import Stomp from "stompjs";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { socketData } from './enum';
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const stompClient = ref(null);
    const sender = useStore().state.user.info.username;
    const user = ref(null);
    const messages = ref([]);
    const messageInput = ref('');
    const active = inject('active');
    const receiver = inject('receiver')
    const t = ref('')
    const inp_display = ref('display:none')

    watch(receiver, (newValue, oldValue) => {
      t.value = newValue
      if (t.value != "") {
        inp_display.value = 'display:flex'
      }
    });


    const socket = new SockJS(socketData[0].label)
    stompClient.value = Stomp.over(socket)
    stompClient.value.connect({ headers: { 'user': sender } }, () => {
      stompClient.value.subscribe('/topic/userUpdate', (message) => {
        handleUserUpdate(JSON.parse(message.body))
      })
      stompClient.value.subscribe('/user/' + sender + '/queue/messages', (message) => {
        const chatMessage = JSON.parse(message.body)
        console.log("進入/user/queue/messages")
        console.log(chatMessage)
        chatMessage.timestamp = new Date(chatMessage.timestamp).toLocaleTimeString()
        messages.value.push(chatMessage);
      })
      stompClient.value.subscribe('/exchange/offline.message.exchange/user.' + sender, message => {
        console.log("進入/exchange/offline.message.exchange/user")
        const content = JSON.parse(message.body).content;
        console.log('Received message:', content);
      })
      stompClient.value.send('/app/chat.userUpdate', {},
        JSON.stringify({ sender: sender, timestamp: new Date(), isUser: false, type: 'JOIN' }))
    })

    const handleUserUpdate = (message) => {
      user.value = message
      active.value = message

    };

    function sendMessage() {
      if (t.value != "") {
        if (messageInput.value) {
          messages.value.push({
            sender: sender,
            timestamp: new Date().toLocaleTimeString(),
            content: messageInput.value
          });
        }
        stompClient.value.send('/app/chat.sendMessage', {},
          JSON.stringify({
            sender: sender,
            receiver: t.value,
            isUser: false,
            ip: user.value.ip,
            content: messageInput.value,
            timestamp: new Date()
          }));
        messageInput.value = ''
      }
    }

    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      stompClient.value.send('/app/chat.userUpdate', {}, JSON.stringify({ sender: sender, isUser: false, type: 'LEAVE' }));
    });

    return {
      t,
      sender,
      messages,
      messageInput,
      sendMessage,
      inp_display,
    }
  }
})
</script>
  
<style lang="scss" scoped>
.layout-container {
  width: calc(100% - 10px);
  height: 85%;
  margin: 0 0 0 0px;
  padding-top: 10px;
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
  margin-left: 27px;
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

.input-container {
  position: absolute;
  bottom: 20px;
  right: 100px;
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