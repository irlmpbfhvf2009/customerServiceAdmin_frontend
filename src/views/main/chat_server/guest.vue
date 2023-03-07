<template>
    <div class="category">
      <div class="header-box">
        <h2>列表</h2>
      </div>
      <ul class="list system-scrollbar">
        <li>
            <span>1</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, inject } from "vue";
  export default defineComponent({
    
    setup() {
        let list = ref([]);
      
      return {
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
        & + li {
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