<script>
    var QuoteService = require('../services/quote');

    module.exports = {
        name: "Quote",

        data: function() {
            return {
                quote: ""
            }
        },

        ready: function() {
            var quote = QuoteService.getQuote(this).quote
            this.$set('quote', quote);
        }
    }
</script>

<template>
    <div id="container" class="container">
        <div class="row">
            <div class="quote-wrapper">
                <h2>Random Quote</h2>
                <p>
                    {{quote}}
                </p>
            </div>
        </div>
    </div>
</template>

<style>
    .quote-wrapper {
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .14);
        padding: 2em;
        border: solid 1px #eee;
        margin-top: 1em;
    }
</style>
