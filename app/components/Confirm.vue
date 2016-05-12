<script>
  export default {
    props: {
      show: {
        type: Boolean,
        twoWay: true,
        default: false
      },
      title: {
        type: String,
        default: '系统提示'
      },
      small: {
        type: Boolean,
        default: true
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
        default: '确认'
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
      },
      // 消息内容
      confirmContent: {
        type: String,
        default: "确认操作吗？"
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
        this.$dispatch('confirmed');
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
              <h6 class="modal-title">
                <slot name="title">
                    {{title}}
                </slot>
              </h6>
            </slot>
          </div>
          <!--Container-->
          <div class="modal-body">
            <slot name="body">
              {{confirmContent}}
            </slot>
          </div>
          <!--Footer-->
          <div class="modal-footer">
            <slot name="footer">
              <button type="button btn-sm" :class="cancelClass" @click="cancel"><i class="fa fa-close"></i> {{cancelText}}</button>
              <button type="button btn-sm" :class="okClass" @click="ok"><i class="fa fa-check"></i> {{okText}}</button>
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

  .modal-title {
    color: #34495e;
    font-size: 20px;
  }

  .modal-content {
    margin: 128px auto;
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

  .modal-body h6 .bell-test{
    color: #27AE60;
    font-size: 20px;
    margin-left: 15px;
  }

  .modal-body ul li {
    list-style: none;
  }

  .modal-footer {
    padding: 10px 15px;
  }

  .modal-footer button {
    padding: 6px 12px;
  }
</style>
