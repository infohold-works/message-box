<script>
  export default {
    name: 'MdlFab'
  }
</script>

<template>
  <div class="fab">
    <a href="#" class="btn-fab btn-alizarin" tooltip="用户信息"><i class="fa fa-user"></i></a>
    <a href="#" class="btn-fab btn-memrald" tooltip="帮助信息"><i class="fa fa-question"></i></a>
    <a href="#" class="btn-fab btn-large btn-peter-river" tooltip="意见收集">
      <i class="fa fa-edit"></i>
    </a>
  </div>
</template>

<style>
  .fab {
    margin: 1em;
    position: fixed;
    bottom: 0;
    right: 20px;
    z-index: 2;
  }

  .fab:hover .btn-fab:not(:last-of-type) {
    width: 40px;
    height: 40px;
    margin: 15px auto 0;
    opacity: 1;
  }

  .fab:hover .rotate {
    background-image: url("http://goo.gl/0eJslQ");
    transform: rotate(0deg);
  }

  .btn-fab {
    display: block;
    width: 35px;
    height: 35px;
    margin: 20px auto 0;
    text-decoration: none;
    position: relative;
    border-radius: 50%;
    overflow: inherit;
    box-shadow: 0px 5px 11px -2px rgba(0, 0, 0, 0.18), 0px 4px 12px -7px rgba(0, 0, 0, 0.15);
    opacity: 0;
    transition: .2s;
  }

  .btn-fab:nth-last-of-type(2) {
    transition-delay: 20ms;
  }

  .btn-fab:nth-last-of-type(3) {
    transition-delay: 40ms;
  }

  .btn-fab:nth-last-of-type(4) {
    transition-delay: 60ms;
  }

  .btn-fab:nth-last-of-type(5) {
    transition-delay: 80ms;
  }

  .btn-fab:nth-last-of-type(6) {
    transition-delay: 100ms;
  }

  .btn-fab:nth-last-of-type(1) {
    width: 48px;
    height: 48px;
    opacity: 1;
  }

  .btn-fab:hover {
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);
  }

  [tooltip]:before {
    content: attr(tooltip);
    background: #585858;
    padding: 5px 7px;
    margin-right: 10px;
    border-radius: 2px;
    color: #FFF;
    font: 500 12px Roboto;
    white-space: nowrap;
    position: absolute;
    bottom: 20%;
    right: 100%;
    visibility: hidden;
    opacity: 0;
    transition: .3s;
  }

  [tooltip]:hover:before {
    visibility: visible;
    opacity: 1;
  }

  .fab a i {
    color: white;
  }

  .btn-fab i {
    padding: 12px;
  }

  .btn-fab.btn-large i {
    padding: 15px;
  }

  .btn-memrald {
    background: #2ecc71;
  }

  .btn-carrot {
    background: #e67e22;
  }

  .btn-alizarin {
    background: #e74c3c;
  }

  .btn-peter-river {
    background: #3498db;
  }
</style>
