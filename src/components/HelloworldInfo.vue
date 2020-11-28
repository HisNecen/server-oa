<template>
  <div class="hello" style="margin: 0 auto; width: 70%">
    <h1>{{ serverInfo.name }}</h1>
    <h3>
      <span><i class="el-icon el-icon-wind-power" style="color: red"></i></span
      >{{ serverInfo.priip }} @
      <span style="color: blue">{{ serverInfo.updatedTime }}</span>
    </h3>
    <el-collapse accordion>
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <div
              id="dataChart"
              :style="{ width: '100%', height: '100px' }"
            ></div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">
            <div
              id="firstChart"
              :style="{ width: '100%', height: '400px' }"
            ></div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <div
              id="pingChart"
              :style="{ width: '100%', height: '100px' }"
            ></div>
          </div>
        </el-col>
      </el-row>
      <el-card class="box-card">
        <p style="text-align: left">
          <el-tag>CPU使用</el-tag>
          <span v-if="serverInfo.serverCpu">
            用户进程占比：<span v-text="serverInfo.serverCpu.us + '%'"></span>
            系统进程占比：<span v-text="serverInfo.serverCpu.sy + '%'"></span>
            空闲：<span v-text="serverInfo.serverCpu.idle + '%'"></span>
            心跳时间：<span v-text="serverInfo.serverCpu.addTime"></span>
          </span>
        </p>
        <p style="text-align: left">
          <el-tag>内存使用</el-tag>
          <span v-if="serverInfo.serverFreeList">
            <span
              v-for="serverFree in serverInfo.serverFreeList"
              :key="serverFree.id"
            >
              总量：<span v-text="serverFree.total"></span> 使用量：<span
                v-text="serverFree.used"
              ></span>
              可用：<span v-text="serverFree.available"></span> 心跳时间：<span
                v-text="serverFree.addTime"
              ></span>
            </span>
          </span>
        </p>

        <div v-if="serverInfo.serverDiscList" class="text item">
          <el-table
            :data="serverInfo.serverDiscList"
            border
            style="width: 100%"
            size="mini"
          >
            <el-table-column prop="name" width="200" label="硬盘信息 分区">
            </el-table-column>
            <el-table-column prop="all" width="100" label="容量">
            </el-table-column>
            <el-table-column prop="used" width="100" label="已用">
            </el-table-column>
            <el-table-column prop="avail" width="100" label="可用">
            </el-table-column>
            <el-table-column prop="usedpercent" width="100" label="已用百分比">
            </el-table-column>
            <el-table-column prop="path" label="路径"> </el-table-column>
          </el-table>
        </div>
      </el-card>
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
  name: "HelloWorldInfo",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      priip: "",
      serverInfo: {},
      serverDiscPathFirst: null,
      serverDiscPathData: null,
      serverDiscPathHome: null
    };
  },
  mounted() {
    this.initServerInfoAll();
  },
  methods: {
    initServerInfoAll() {
      let priip = this.$route.query.priip;
      this.$message(priip);
      this.priip = priip;
      this.axios({
        method: "post",
        url: "/myoa/serveroa/server/selectServerInfoByPriip",
        data: {
          data: {
            priip: this.priip,
          },
        },
      }).then((res) => {
        this.serverInfo = res.data.data.serverInfo;
        this.serverInfo.serverDiscList.forEach(item => {
          if(item.path === "/boot"){
            this.serverDiscPathHome = item;
          }
          if(item.path === "/data"){
            this.serverDiscPathData = item;
          }
          if(item.path === "/"){
            this.serverDiscPathFirst = item;
          }
        });
        this.drawDisc();
      });
    },
    drawDisc() {
      var serverDiscFirstPercent = 0;
      if(this.serverDiscPathFirst != null){
        var percentstr = this.serverDiscPathFirst.usedpercent;
        percentstr=percentstr.replaceAll(" ","");
        percentstr=percentstr.replaceAll("%","");
        serverDiscFirstPercent = parseInt(percentstr);
      }

      var serverDiscDataPercent = 0;
      if(this.serverDiscPathData != null){
        var percentstr = this.serverDiscPathData.usedpercent;
        percentstr=percentstr.replaceAll(" ","");
        percentstr=percentstr.replaceAll("%","");
        serverDiscDataPercent = parseInt(percentstr);
      }

      var serverDiscHomePercent = 0;
      if(this.serverDiscPathHome != null){
        var percentstr = this.serverDiscPathHome.usedpercent;
        percentstr=percentstr.replaceAll(" ","");
        percentstr=percentstr.replaceAll("%","");
        serverDiscHomePercent = parseInt(percentstr);
      }


      let firstChart = this.$echarts.init(document.getElementById("firstChart"));
      firstChart.setOption({
        tooltip: {
          formatter: "{a} <br/>{c} {b}",
        },
        toolbox: {
          show: false,
          feature: {
            restore: { show: false },
            saveAsImage: { show: false },
          },
        },
        series: [
          {
            name: "已用",
            type: "gauge",
            z: 1,
            min: 0,
            max: 100,
            splitNumber: 10,
            radius: "50%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 10,
              },
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
              },
            },
            splitLine: {
              // 分隔线
              length: 20, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: "auto",
              },
            },
            axisLabel: {
              backgroundColor: "auto",
              borderRadius: 2,
              color: "#eee",
              padding: 1,
              textShadowBlur: 2,
              textShadowOffsetX: 1,
              textShadowOffsetY: 1,
              textShadowColor: "#222",
            },
            title: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: "bolder",
              fontSize: 13,
              fontStyle: "italic",
            },
            detail: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              formatter: function (value) {
                value = (value + "").split(".");
                value.length < 2 && value.push("00");
                return (
                  ("00" + value[0]).slice(-2) +
                  "." +
                  (value[1] + "00").slice(0, 2)
                );
              },
              fontWeight: "bolder",
              borderRadius: 3,
              backgroundColor: "#444",
              borderColor: "#aaa",
              shadowBlur: 5,
              shadowColor: "#333",
              shadowOffsetX: 0,
              shadowOffsetY: 3,
              borderWidth: 2,
              textBorderColor: "#000",
              textBorderWidth: 2,
              textShadowBlur: 2,
              textShadowColor: "#fff",
              textShadowOffsetX: 0,
              textShadowOffsetY: 0,
              fontFamily: "Arial",
              width: 40,
              fontSize: 12,
              color: "#eee",
              rich: {},
            },
            data: [{ value: serverDiscFirstPercent, name: "path:/(%)" }],
          },
          {
            name: "已用",
            type: "gauge",
            center: ["20%", "55%"], // 默认全局居中
            radius: "35%",
            min: 0,
            max: 100,
            endAngle: 45,
            splitNumber: 5,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 8,
              },
            },
            axisTick: {
              // 坐标轴小标记
              length: 12, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
              },
            },
            splitLine: {
              // 分隔线
              length: 20, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: "auto",
              },
            },
            pointer: {
              width: 5,
            },
            title: {
              offsetCenter: [0, "-30%"], // x, y，单位px
              fontSize: 11,
            },
            detail: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: "bolder",
            },
            data: [{ value: serverDiscDataPercent, name: "/data(%)" }],
          },
          {
            name: "已用",
            type: "gauge",
            center: ["77%", "55%"], // 默认全局居中
            radius: "35%",
            min: 0,
            max: 100,
            startAngle: 135,
            endAngle: -45,
            splitNumber: 5,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 8,
              },
            },
            axisTick: {
              // 坐标轴小标记
              length: 12, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
              },
            },
            splitLine: {
              // 分隔线
              length: 20, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: "auto",
              },
            },
            pointer: {
              width: 5,
            },
            title: {
              offsetCenter: [0, "-30%"], // x, y，单位px
              fontSize: 11,
            },
            detail: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: "bolder",
            },
            data: [{ value: serverDiscHomePercent, name: "/home(%)" }],
          },
          
        ],
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
