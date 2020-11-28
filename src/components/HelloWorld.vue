<template>
  <div class="hello" style="margin: 0 auto; width: 70%">
    <img src="@/assets/logo.png">
    <el-collapse accordion>
      <el-collapse-item v-for="item in serverList" :key="item.id">
        <template slot="title">
          <i class="header-icon el-icon-info"></i>
          <h3 v-text="item.name"></h3>
          ,
          <h4 v-text="item.priip"></h4>
          , 到期日：
          <h4 v-text="item.expireTime"></h4>
          , 价格：
          <h4 v-text="item.price"></h4>
        </template>
        <div>
          <p style="text-align: left">
            <el-tag>CPU使用</el-tag>
            <span v-if="item.serverCpu">
              用户进程占比：<span v-text="item.serverCpu.us + '%'"></span>
              系统进程占比：<span v-text="item.serverCpu.sy + '%'"></span>
              空闲：<span v-text="item.serverCpu.idle + '%'"></span>
              心跳时间：<span v-text="item.serverCpu.addTime"></span>
            </span>
          </p>
          <p style="text-align: left">
            <el-tag>内存使用</el-tag>
            <span v-if="item.serverFreeList">
              <span
                v-for="serverFree in item.serverFreeList"
                :key="serverFree.id"
              >
                总量：<span v-text="serverFree.total"></span> 使用量：<span
                  v-text="serverFree.used"
                ></span>
                可用：<span v-text="serverFree.available"></span>
                心跳时间：<span v-text="serverFree.addTime"></span>
              </span>
            </span>
          </p>
          <el-card class="box-card">
            <div v-if="item.serverDiscList" class="text item">
              
                <el-table
                  :data="item.serverDiscList"
                  border
                  style="width: 100%"
                  size="mini"
                >
                  <el-table-column prop="name" width="200" label="硬盘信息 分区"> </el-table-column>
                  <el-table-column prop="all" width="100" label="容量">
                  </el-table-column>
                  <el-table-column prop="used" width="100" label="已用">
                  </el-table-column>
                  <el-table-column prop="avail" width="100" label="可用">
                  </el-table-column>
                  <el-table-column prop="usedpercent" width="100" label="已用百分比">
                  </el-table-column>
                  <el-table-column prop="path"  label="路径">
                  </el-table-column>
                </el-table>
              
            </div>
          </el-card>
        </div>
      </el-collapse-item>
      <el-collapse-item>
        <template slot="title">
          版权 @ 一致性 Consistency<i class="header-icon el-icon-info"></i>
        </template>
      </el-collapse-item>
      
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      serverList: [],
    };
  },
  mounted() {
    this.initServerListAll();
  },
  methods: {
    initServerListAll() {
      this.axios({
        method: "post",
        url: "/myoa/serveroa/server/selectServerListAll",
        data: {
          data: {},
        },
      }).then((res) => {
        this.serverList = res.data.data.serverList;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  color: #42b983;
}
</style>
