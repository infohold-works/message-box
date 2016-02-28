<template>
    <div class="message-read" v-if="mescontent">
        <h3>{{ mestitle }}</h3>
        <p class="source-provider"><span class="sendtime">{{ sendtime }}</span></p>
        {{{ mescontent }}}
    </div>
    <div class="v-spinner" v-if="!mescontent">
        Sorry this content is only available online view
    </div>
</template>
<script>
    module.exports =  {
        name: 'Message',
        
        props: ['mestitle', 'mescontent', 'author', 'sendtime', 'markedread']
    }
</script>
