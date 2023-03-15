<template>
  <div class="layout-container">

    <div v-for="m in messages" class="chat-bubble" :class="[m.sender === chatMessage.sender ? 'sender' : 'receiver']">
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

    const store = useStore();
    const chatMessage = ref({
      sender: store.state.user.info.username,
      receiver: null,
      ip: store.state.user.info.ip,
      content: '',
      timestamp: new Date(),
      isUser: false,
      isOnline: true,
    });
    const stompClient = ref(null);
    const socket = new SockJS(socketData[0].label);
    const messages = ref([]);
    const messageInput = ref('');

    const active = inject('active');
    const inp_display = ref('display:none')



    stompClient.value = Stomp.over(socket)
    stompClient.value.connect({ debug: null }, () => {
      chatMessage.value.isOnline = true
      stompClient.value.subscribe('/topic/userOnlineStatus', (message) => {
        handleOnlineStatus(JSON.parse(message.body))
      })
      stompClient.value.subscribe('/user/' + chatMessage.value.sender + '/queue/messages', (message) => {
        handleQueueMessage(JSON.parse(message.body))
      })
      stompClient.value.send('/app/chat.userOnlineStatus', {}, JSON.stringify(chatMessage.value))
    })
    
    // watch(receiver, (newValue, oldValue) => {
    //   if (newValue) {
    //     chatMessage.value.receiver = newValue;
    //     inp_display.value = 'display:block'
    //   }
    // });
    function handleOnlineStatus(message) {
      console.log("in handleOnlineStatus")
    }
    function handleQueueMessage(message) {
      console.log("in handleQueueMessage")
      messages.value.push(message)
      if(message.receiver !== chatMessage.value.sender){
        inp_display.value = 'display:block'
      }
    }
    function sendMessage() {
      console.log("in sendMessage")
      if (messageInput.value) {
        chatMessage.value.content = messageInput.value;
        messages.value.push(chatMessage.value);
      }
      stompClient.value.send('/app/chat.sendMessage', {},JSON.stringify(chatMessage.value));
      messageInput.value = ''
    }

    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      user.value.isOnline = false;
      stompClient.value.send('/app/chat.userOnlineStatus', {}, JSON.stringify(chatMessage.value));
    });

    return {
      chatMessage,
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
  padding: 10px 0 0 10px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.input-container input[type='text'] {
  flex: 1;
  height: 40px;
  width: 80%;
  padding: 0 10px;
  border: none;
  outline: none;
  font-size: 16px;
}

.input-container button {
  background-color: blue;
  color: white;
  font-size: 16px;
  width: 10%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>