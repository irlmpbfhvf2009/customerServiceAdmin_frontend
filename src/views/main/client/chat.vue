<template>
    <div>
      <h1>聊天室</h1>
      <div class="chat-container">
        <div v-for="message in messages" :key="message.id" :class="{'from-me': message.fromMe}">
          <div class="message">{{ message.content }}</div>
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

  export default {
    data() {
      return {
        stompClient: null,
        messages: [],
        messageInput: '',
        roomId: '',
      }
    },
    mounted() {
      this.connect()
    },
    methods: {
      connect() {
        const socket = new SockJS(socketData[0].label)
        this.stompClient = Stomp.over(socket)
        this.stompClient.connect({}, () => {
          this.stompClient.subscribe('/topic/chat' , (message) => {
            console.log(1)
            console.log(message)
            this.handleMessage(JSON.parse(message.body))
          })
        })
      },
      handleMessage(message) {
        const fromMe = message.username === this.username
        this.messages.push({
          id: message.id,
          content: message.content,
          fromMe,
        })
      },
      sendMessage() {
        if (!this.messageInput) {
          return
        }
  
        const message = {
          content: this.messageInput,
          // username: this.username,
          roomId: "123",
          // roomId: this.roomId,
        }
        console.log(message)
        this.stompClient.send('/api/chat', "321")
        this.messageInput = ''
      },
    },
  }
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
  