<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
@import "~@/assets/common.less";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}

html,
body {
  margin: 0;
  padding: 0;
  user-select: none;
  width: 100%;
  height: 100%;
}
h1,
h2,
h3,
h4 {
  margin: 0;
  padding: 0;
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
input.no-style {
  border: 0px;
  outline: none;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  > label {
    &:first-of-type {
      min-width: 80px;
    }
  }
}
// 清除浮动
.clearfix:after {
  content: " ";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.clearfix {
  display: inline-block;
}
// 左右浮动
.f_l {
  float: left;
}

.f_r {
  float: right;
}

// 初始化 标题
h1,
h2,
h3,
h4,
h5,
h6,
em,
i,
select,
option,
input,
textarea {
  font-style: normal;
  font-weight: 400;
  outline: none;
}
</style>
