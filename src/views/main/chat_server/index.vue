<template>
  <div class="full">
    <div class="left">
      <guest />
    </div>
    <div class="content">
      <msg />
    </div>
  </div>
</template>


<script>
import guest from './guest.vue'
import msg from './msg.vue'
import { defineComponent,provide,ref } from 'vue'

export default defineComponent({
  name: 'index',
  components: {
    guest,
    msg,
  },
  setup() {
    let active = ref({})
    provide('active', active)
    let receiver = ref({})
    provide('receiver', receiver)
    return {
    }
  }
})
</script>
  
<style lang="scss" scoped>
  .full {
    width: 100%;
    height: 100%;
    padding: 0px;
    box-sizing: border-box;
    display: flex;
    .left {
      width: 300px;
    }
    .content {
      flex: 1;
      width: calc(100% - 250px);
      height: 100%;
    }
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