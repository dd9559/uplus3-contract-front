<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="less">
  @import "~@/assets/common.less";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
  }

  html, body {
    margin: 0;
    padding: 0;
    user-select:none;
    width: 100%;
    height: 100%;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .modal {
    &-context{
      /*width: 80%;*/
      .input-group {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        &:last-of-type{
          margin: 0px;
        }
        > label {
          &:first-of-type{
            min-width: 100px;
          }
        }
      }
      .file-upload {
        &-opera {
          display: flex;
          > p {
            display: inherit;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
          }
        }
      }
    }
  }
</style>
