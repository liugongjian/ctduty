<template>
        <div class="faceManage">
          <div class="title">
            天翼值更系统人脸管理
          </div>
          <div class="face">
              <img src="./images/face.png" alt="">
          </div>
        </div>
      </template>
      
      <script>
      export default {
        data() {
          return {
          }
        },
        created() {
    
        },
        methods: {
          
         }
        }
      </script>
    <style lang="scss">
    .title {
       width: 100%;
       height: 50px;
       line-height: 50px;
       font-family: MicrosoftYaHei;
       font-size: 22px;
       color: #333333;
       font-weight: 500;
       border-bottom: 1px solid #ccc;
       background: #FFF;
       padding: 0 20px;
     }
     .face{
         width: 100%;
         height: 100%;
     }
     .face img{
            width: 100%;
            height: 100%;
         }
      </style>
      