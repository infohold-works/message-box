<script>
  import { remote } from 'electron'
  import { setSetting } from '../vuex/actions'
  const notifier = remote.getGlobal('notifier')
  import $ from 'jquery'
  import env_conf from '../../config/env_development.json'
  import storage from 'electron-json-storage'

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
    vuex: {
      actions: {
        setSetting
      }
    },
    created() {
      if (this.show) {
        document.body.className += ' modal-open';
      }
      // 初始值设置
      $("[data-toggle='switch']").bootstrapSwitch();
      storage.has('setting', function(error, hasKey) {
        if (error) throw error;

        if (!hasKey) {
          storage.set('setting', env_conf.setting, function(error) {
            if (error) throw error;
            $('#autoLanuchSwitch').bootstrapSwitch('state', env_conf.setting.autoLanuch)
            $('#notifySwitch').bootstrapSwitch('state', env_conf.setting.notify)
            $('#notifySoundSwitch').bootstrapSwitch('state', env_conf.setting.notifySound)
          });
        } else {
          storage.get('setting', function(error, data) {
            $('#autoLanuchSwitch').bootstrapSwitch('state', data.autoLanuch)
            $('#notifySwitch').bootstrapSwitch('state', data.notify)
            $('#notifySoundSwitch').bootstrapSwitch('state', data.notifySound)
          });
        }
      });
    },
    ready() {
      var self = this;
      $('#autoLanuchSwitch').on('switchChange.bootstrapSwitch', function (event, state) {
        storage.get('setting', function(error, data) {
          if (error) throw error;
          data.autoLanuch = state
          storage.set('setting', data, function(error) {
            if (error) throw error;
            self.setSetting(data)
          });
        });
      });
      $('#notifySwitch').on('switchChange.bootstrapSwitch', function (event, state) {
        storage.get('setting', function(error, data) {
          if (error) throw error;
          data.notify = state
          storage.set('setting', data, function(error) {
            if (error) throw error;
            self.setSetting(data)
          });
        });
      });
      $('#notifySoundSwitch').on('switchChange.bootstrapSwitch', function (event, state) {
        storage.get('setting', function(error, data) {
          if (error) throw error;
          data.notifySound = state
          storage.set('setting', data, function(error) {
            if (error) throw error;
            self.setSetting(data)
          });
        });
      });
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
                  <label for="autoLanuchSwitch">开机自动启动消息盒子</label>
                  <input type="checkbox" data-toggle="switch" data-on-color="primary" data-off-color="default" id="autoLanuchSwitch"/>
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
                  <label for="notifySwitch">开启后，在桌面接收到来自社保的消息提醒，可随时关闭。</label>
                  <input type="checkbox" checked data-toggle="switch" id="notifySwitch"/>
                </li>
                <li>
                  <label for="notifySoundSwitch">接收到消息提醒时播放提示音。</label>
                  <input type="checkbox" checked data-toggle="switch" id="notifySoundSwitch"/>
                </li>
              </ul>
            </slot>
          </div>
          <!--Footer-->
          <!-- <div class="modal-footer">
            <slot name="footer">
              <button type="button" :class="cancelClass" @click="cancel"><i class="fa fa-close"></i> {{cancelText}}</button>
              <button type="button" :class="okClass" @click="ok"><i class="fa fa-check"></i> {{okText}}</button>
            </slot>
          </div> -->
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

  .modal-header {
    padding: 0;
  }

  .modal-header .close {
    margin: 15px;
  }

  .modal-body {
    padding: 10px 15px;
    color: #34495e;
    font-size: 16px;
  }

  .modal-body h6 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    padding: 15px 0;
    border-bottom: 1px solid #ddd;
  }

  .modal-body h6 .bell-test{;
    color: #27AE60;
    font-size: 14px;
    margin-left: 15px;
  }

  .modal-body ul {
    margin: 0;
    padding: 0;
  }

  .modal-body ul li {
    list-style: none;
  }

  .modal-body ul li label {
    margin-left: 15px;
  }

  .modal-footer {
    padding: 0 15px;
  }
</style>
