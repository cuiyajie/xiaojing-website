<template>
  <div class="homepage">
    <div class="arena">
      <div class="layout-container arena-container">
        <div class="description">
          <h2>小瞳助手，企业考勤好帮手</h2>
          <p>将全球领先的人脸识别和深度学习技术用于企业办公服务。</p>
          <p class="seperator"><span>下载应用</span></p>
          <div class="clearfix">
            <div class="app-column">
              <a href="javascript:void(0)" class="app-link ios">iPhone下载</a>
              <span class="note">Phone5s、iPad Air2、<br />iPad Mini2及以上，iOS7.0以上系统</span>
            </div>
            <div class="app-column">
              <a href="javascript:void(0)" class="app-link android">Android稍后上线</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section class="feature">
      <div class="layout-container"><h2 class="guide">小瞳能做什么</h2></div>
      <div class="layout-container feature-section feature-record">
        <h2>人脸极速打卡</h2>
        <p>忘带卡成为过去，刷刷脸完成考勤</p>
      </div>
      <div class="layout-container feature-section feature-analysis">
        <h2>智能统计报表</h2>
        <p>智能生成考勤统计，减轻考勤统计工作</p>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    name: 'homepage',
  };
</script>
<style lang="scss">
  @import "~scss_var";

  .homepage {
    background-color: #FFF;


    h2 {
      font-size: 32px;
      font-weight: lighter;
      margin: 0;
    }

    p {
      font-weight: lighter;
      margin: 0;
    }

    .arena {
      height: 500px;
      color: #FFF;
      font-size: 14px;
      background: url(../../img/home/arena-bg.png) no-repeat;
      background-size: cover;

      h2, p {
        margin-bottom: 16px;
        line-height: 150%;
      }

      p.seperator {
        span {
          border-top: 1px solid #FFF;
          display: inline-block;
          padding-top: 16px;
        }
      }
    }

    .arena-container {
      height: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      background: url(../../img/home/shot-app@2x.png) no-repeat;
      background-size: 355px auto;
      background-position: 88% center;
    }

    .app-column {
      float: left;
      width: 148px;
      margin-right: 20px;

      .note {
        display: inline-block;
        margin-top: 10px;
        font-size: 12px;
        font-weight: lighter;
        line-height: 140%;
      }
    }

    .app-link {
      display: block;
      padding: 10px 0;
      border-radius: 4px;
      border: 1px solid #FFF;
      background-position-y: center;
      background-repeat: no-repeat;
      text-align: center;
      font-weight: normal;
      color: #FFF;

      &.ios {
        padding-left: 25px;
        background-image: url(../../img/home/ico_ios.png);
        background-position-x: 25px;
      }

      &.android {
        border-style: dashed;
        padding-left: 20px;
        background-image: url(../../img/home/ico_android.png);
        background-position-x: 10px;
      }
    }

    .feature {
      background-color: #FFF;
      color: $darkblue;
      text-align: center;
      padding-top: 80px;

      h2 {
        margin-bottom: 15px;
      }
    }

    .guide {
      display: inline-block;
      padding: 12px 20px;
      color: $linkface;
      border: 1px solid $linkface;
      font-size: 32px;
      font-weight: lighter;
      position: relative;

      &:after {
        content: '';
        border-top: 9px solid $linkface;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        position: absolute;
        bottom: -9px;
        left: 50%;
        margin-left: -8px;
      }
    }

    .feature-section {
      position: relative;
      height: 500px;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-size: 300px auto;
        background-repeat: no-repeat;
        background-position-y: center;
      }

      &.feature-record {
        background-image: url(../../img/home/content-bg1.png);

        &:before {
          background-image: url('../../img/home/shot-record@2x.png');
        }
      }

      &.feature-analysis {
        background-image: url(../../img/home/content-bg2.png);

        &:before {
          background-position-x: right;
          background-image: url('../../img/home/shot-analysis@2x.png');
        }
      }
    }
  }
</style>
