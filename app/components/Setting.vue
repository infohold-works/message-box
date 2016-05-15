<script>
  import { remote } from 'electron'
  const notifier = remote.getGlobal('notifier')

  export default {
    props: {
      show: {
        type: Boolean,
        twoWay: true,
        default: false
      },
      title: {
        type: String,
        default: '设置'
      },
      small: {
        type: Boolean,
        default: false
      },
      large: {
        type: Boolean,
        default: false
      },
      full: {
        type: Boolean,
        default: false
      },
      // 为true时无法通过点击遮罩层关闭modal
      force: {
        type: Boolean,
        default: true
      },
      // 自定义组件transition
      transition: {
        type: String,
        default: 'modal'
      },
      // 确认按钮text
      okText: {
        type: String,
        default: '保存'
      },
      // 取消按钮text
      cancelText: {
        type: String,
        default: '取消'
      },
      // 确认按钮className
      okClass: {
        type: String,
        default: 'btn btn-success'
      },
      // 取消按钮className
      cancelClass: {
        type: String,
        default: 'btn btn-default'
      },
      // 点击确定时关闭Modal
      // 默认为false，由父组件控制prop.show来关闭
      closeWhenOK: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        duration: null
      };
    },
    computed: {
      modalClass() {
        return {
          'modal-lg': this.large,
          'modal-sm': this.small,
          'modal-full': this.full
        }
      }
    },
    created() {
      if (this.show) {
        document.body.className += ' modal-open';
      }
    },
    destroyed() {
      document.body.className = document.body.className.replace(' modal-open', '');
    },
    watch: {
      show(value) {
        // 在显示时去掉body滚动条，防止出现双滚动条
        if (value) {
          document.body.className += ' modal-open';
        } else {
          if (!this.duration) {
            this.duration = window.getComputedStyle(this.$el)['transition-duration'].replace('s', '') * 1000;
          }
          window.setTimeout(() => {
            document.body.className = document.body.className.replace(' modal-open', '');
          }, this.duration || 0);
        }
      }
    },
    methods: {
      ok() {
        this.$emit('ok');
        if (this.closeWhenOK) {
          this.show = false;
        }
      },
      cancel() {
        this.$emit('cancel');
        this.show = false;
      },
      // 点击遮罩层
      clickMask() {
        if (!this.force) {
          this.cancel();
        }
      },
      testNotify() {
        notifier.notify({
          'title': "测试标题",
          'message': "看这里！看这里！",
          'sound': true
        }, function(error, response) {
          console.log(error);
          console.log(response);
        });
      }
    }
  };
</script>

<template>
  <div v-show="show" :transition="transition">
    <div class="modal" @click.self="clickMask">
      <div class="modal-dialog" :class="modalClass" v-el:dialog>
        <div class="modal-content">
          <!--Header-->
          <div class="modal-header">
            <slot name="header">
              <a type="button" class="close" @click="cancel"><i class="fa fa-close"></i></a>
              <h4 class="modal-title">
                <slot name="title">
                    {{title}}
                </slot>
              </h4>
            </slot>
          </div>
          <!--Container-->
          <div class="modal-body">
            <slot name="body">
              <div class="system">
                <h6>系统设置</h6>
              </div>
              <ul>
                <li>
                  <label for="switch-01">开机自动启动<code>消息盒子</code></label>
                  <input type="checkbox" checked data-toggle="switch" name="default-switch-colors" data-on-color="primary" data-off-color="default" id="switch-03" class="pull-right" />
                </li>
              </ul>
              <div class="bell">
                <h6>
                  <span>桌面提醒</span>
                  <span class="bell-test"><a href="#" @click="testNotify()"><i class="fa fa-bell-o"></i>发送测试提醒</a></span>
                </h6>
              </div>
              <ul>
                <li>
                  <label for="switch-02">开启后，在桌面接收到来自社保的消息提醒，可随时关闭。</label>
                  <input type="checkbox" checked data-toggle="switch" name="default-switch" id="switch-02" class="pull-right" />
                </li>
                <li>
                  <label for="switch-03">接收到消息提醒时播放提示音。</label>
                  <input type="checkbox" checked data-toggle="switch" name="default-switch" id="switch-03" class="pull-right" />
                </li>
              </ul>
            </slot>
          </div>
          <!--Footer-->
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" :class="cancelClass" @click="cancel">{{cancelText}}</button>
              <button type="button" :class="okClass" @click="ok">{{okText}}</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop in"></div>
  </div>
</template>

<style scoped>
  .modal {
    display: block;
  }

  .modal-transition {
    transition: all .6s ease;
  }

  .modal-leave {
    border-radius: 1px !important;
  }

  .modal-transition .modal-dialog,
  .modal-transition .modal-backdrop {
    transition: all .5s ease;
  }

  .modal-enter .modal-dialog,
  .modal-leave .modal-dialog {
    opacity: 0;
    transform: translateY(-30%);
  }

  .modal-enter .modal-backdrop,
  .modal-leave .modal-backdrop {
    opacity: 0;
  }

  .modal-body {
    padding: 10px 15px;
    color: #34495e;
    font-size: 16px;
  }

  .modal-body h6 {
    font-size: 20px;
    font-weight: 700;
  }

  .modal-body h6 .bell-test{;
    color: #27AE60;
    font-size: 20px;
    margin-left: 15px;
  }

  .modal-body ul li {
    list-style: none;
  }
</style>
