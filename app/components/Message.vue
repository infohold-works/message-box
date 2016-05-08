<script>
  module.exports = {
    name: 'Message',

    props: ['mestitle', 'mescontent', 'author', 'sendtime']
  }
</script>
<template>
  <article class="message" v-if="mescontent">
    <header class="message-header">
      <h5>{{ mestitle }}</h5>
      <section class="message-header-meta">
        <span class="meta-item">
          <i class="fa fa-user"></i>&nbsp;
          {{ author }}
        </span>
        <span class="meta-item">
          <i class="fa fa-clock-o"></i>&nbsp;
          <time class="sendtime">{{ sendtime }}</time>
        </span>
      </section>
    </header>
    <section class="message-content">
      {{{ mescontent }}}
    </section>
  </article>
  <!--
    <div class="empty-placeholder" v-if="!mescontent">
        Sorry this content is only available online view
    </div> -->
</template>
<style>
  .dashboard-message-detail .message {
    font-size: 1.4rem;
    line-height: 1.5;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 5px 20px 20px 20px;
    position: absolute;
    top: 48px;
    left: 0;
    bottom: 0;
    right: 0;
    word-wrap: break-word;
  }

  .message .message-header .message-header-meta {
    font-size: 16px;
    color: #9EABB3;
  }

  .message .message-header .message-header-meta .meta-item {
    padding: 0 10px;
  }

  .message .message-header .message-header-meta .meta-item:first-child {
    padding-left: 0;
    border-right: 1px solid #9EABB3;
  }

  .message .message-content {
    margin-top: 20px;
  }

  .message .message-content h1 {
    font-size: 29px;
    margin: 20px 0;
  }

  .message .message-content h2 {
    font-size: 26px;
    margin: 20px 0;
  }

  .message .message-content h3 {
    font-size: 24px;
    margin: 20px 0;
  }

  .message .message-content h4 {
    font-size: 22px;
    margin: 20px 0;
  }

  .message .message-content h5 {
    font-size: 20px;
    margin: 20px 0;
  }

  .message .message-content h6 {
    font-size: 20px;
    margin: 20px 0;
  }

  .message .message-content p {
    font-size: 16px;
  }
</style>
