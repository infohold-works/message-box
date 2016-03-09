<template>
    <article class="message" v-if="mescontent">
        <section class="message-read" v-if="mescontent">
            <h5>{{ mestitle }}</h5>
            <p class="source-provider"><span class="sendtime">{{ sendtime }}</span></p>
            {{{ mescontent }}}
        </section>
    </article>
    <!-- <div class="message-read" v-if="mescontent">
        <h5>{{ mestitle }}</h5>
        <p class="source-provider"><span class="sendtime">{{ sendtime }}</span></p>
        {{{ mescontent }}}
    </div>
    <div class="empty-placeholder" v-if="!mescontent">
        Sorry this content is only available online view
    </div> -->
</template>

<script>
    module.exports =  {
        name: 'Message',

        props: ['mestitle', 'mescontent', 'author', 'sendtime', 'markedread']
    }
</script>
