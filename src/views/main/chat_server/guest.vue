<template>
  <div class="category">
    <div class="header-box">
      <h2>列表</h2>
    </div>
    <ul class="list system-scrollbar">
      <li v-for="receiver in fromUser" @click="updateReceiver(receiver)">
        <i class="el-icon-user-solid" :style="{ color: receiver.online }"></i>
        <span>{{ receiver.username }}</span>
      </li>
    </ul>
  </div>
</template>
  
<script>
import { defineComponent, ref, inject,watch } from "vue";
export default defineComponent({

  setup() {
    const fromUser = ref([]);
    const user = ref(null);
    const active= inject('active')
    const receiver = inject('receiver')

    watch(active, (newValue, oldValue) => {
      user.value = newValue
      const existingUserIndex = fromUser.value.findIndex(u => u.username === newValue.sender);
      if (newValue.type === 'JOIN' && newValue.isUser === true) {
        if (existingUserIndex === -1) {
          fromUser.value.push({
            username: newValue.sender,
            ip: newValue.ip,
            timestamp: newValue.timestamp,
            online: '#67C23A',
          });
        } else {
          fromUser.value[existingUserIndex].online = '#67C23A';
        }
      } else if (newValue.type === 'LEAVE') {
        if (existingUserIndex !== -1) {
          fromUser.value[existingUserIndex].online = '';
        }
      }
    });

    const updateReceiver = (r) => {
      user.value.receiver = r.username
      receiver.value = r.username
    };

    return {
      fromUser,
      updateReceiver,
    };
  },
});
</script>
  
<style lang="scss" scoped>
.category {
  background: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header-box {
    padding: 10px;
    display: flex;
    align-items: center;

    h2 {
      padding: 0;
      margin: 0;
      margin-right: 20px;
      font-size: 14px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 30px;
      line-height: 30px;
    }
  }

  .list {
    flex: 1;
    height: auto;
    margin: 0;
    padding: 0;
    display: block;
    overflow: auto;

    li {
      height: 38px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 20px;
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
      transition: 0.2s;

      &+li {
        border-top: 1px solid #eee;
      }

      &:hover {
        background: #eee;
      }

      &.active {
        background: rgba(186, 220, 255, 0.4);
      }

      span {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 14px;
      }
    }

    .load-tip {
      font-size: 14px;
      color: #616161;
    }
  }
}
</style>