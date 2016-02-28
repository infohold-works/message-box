<script>
    var Explorer = require('./Explorer.vue')

    module.exports = {
        name: 'Fullreponame',

        data: function() {
            return {
                fullRepoName: '',
                username: '',
                repo: ''
            };
        },

        methods: {
            changeRepo: function() {
                var splitData = this.fullRepoName.split('/');
                this.username = splitData[0];
                this.repo = splitData[1];

                // $('h3').text('Hello World');

                console.group("Vue Data");
                console.log("fullRepoName:", this.fullRepoName);
                console.log("username:", this.username);
                console.log("repo:", this.repo);
                console.groupEnd("Vue Data");
            }
        },

        components: {
            Explorer
        }
    }
</script>
<template>
    <div id="container" class="container">
        <div class="row">
            <div class="dashboard-header">
                <h4>Github文件浏览器</h4>
            </div>
            <div class="col-md-9 col-md-offset-3" style="margin-top: 80px;">
                <form id="changeRepoForm" @submit.prevent="changeRepo()" class="form-inline">
                    <div class="form-group">
                        <label for="fullRepoName">Full Repo Name</label>
                        <input type="text" name="fullRepoName" v-model="fullRepoName" placeholder="xiaoluoboding/kaidorei" class="form-control">
                    </div>
                    <button type="submit" class="btn btn-primary">获&emsp;取</button>
                </form>
                <hr>
                <explorer :username="username" :repo="repo"></explorer>
            </div>
        </div>
    </div>
</template>
