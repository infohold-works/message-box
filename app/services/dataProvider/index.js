module.exports = {
    getMessageTypes: function (ctx) {
        // Here you would make a request to your server

        // return ctx.$http.get('http://yourserver.com/api', function (data, status, request) {
        //       return data;
        //   }).error(function (data, status, request) {
        //       return data;
        //   })
        console.log('Get MessageTypes from dataProvider');
        return {
            messageTypes: [{
                "id": 1,
                "title": "部门通知",
                "read": false,
                "count": 13
            }, {
                "id": 2,
                "title": "业务通知",
                "read": false,
                "count": 7
            }, {
                "id": 3,
                "title": "到账通知",
                "read": false,
                "count": 0
            }, {
                "id": 4,
                "title": "对账通知",
                "read": false,
                "count": 8
            }, {
                "id": 5,
                "title": "测试消息",
                "read": false,
                "count": 0
            }]
        }
    },

    getSummaries: function (ctx) {

        console.log('Get Summaries from dataProvider');

        return {
            summaries: [
                {
                    "id": 1,
                    "author": "李世民",
                    "title": "晓松奇谈",
                    "desc": "wow lol wow lol wow lol wow lol wow lol wow lol wow lol wow lol ",
                    "sendtime": "2016-02-28",
                    "read": false
                },
                {
                    "id": 2,
                    "author": "雍正",
                    "title": "皇帝诏曰",
                    "desc": "wow lol wow lol wow lol wow lol wow lol wow lol wow lol wow lol ",
                    "sendtime": "2016-02-28",
                    "read": true
                },
                {
                    "id": 3,
                    "author": "诸葛亮",
                    "title": "奔跑吧兄弟",
                    "desc": "wow lol wow lol wow lol wow lol wow lol wow lol wow lol wow lol ",
                    "sendtime": "2016-02-28",
                    "read": false
                },
                {
                    "id": 4,
                    "author": "孙悟空",
                    "title": "奇葩说",
                    "desc": "wow lol wow lol wow lol wow lol wow lol wow lol wow lol wow lol ",
                    "sendtime": "2016-02-28",
                    "read": true
                }
            ]
        }
    },

    getMessages: function (ctx) {

        console.log('Get Messages from dataProvider');

        return {
            messages: [
                {
                    "id": 1,
                    "author": "李世民",
                    "title": "晓松奇谈",
                    "content": "在笔记中的精妙设计，实现了对Markdown的存储和再次编辑。既解决了其他产品只是单向导出HTML的单薄，又规避了服务端存储Markdown带来的隐私安全问题。这样，服务端仅作为对印象笔记 API调用和数据转换之用。",
                    "sendtime": "2016-02-28",
                    "markedread": false
                },
                {
                    "id": 2,
                    "author": "雍正",
                    "title": "皇帝诏曰",
                    "content": "wow lol wow lol wow lol wow lol wow lol wow lol wow lol wow lol ",
                    "sendtime": "2016-02-28",
                    "markedread": false
                },
                {
                    "id": 3,
                    "author": "诸葛亮",
                    "title": "奔跑吧兄弟",
                    "content": "wow lol wow lol wow lol wow lol wow lol wow lol wow lol wow lol ",
                    "sendtime": "2016-02-28",
                    "markedread": false
                },
                {
                    "id": 4,
                    "author": "孙悟空",
                    "title": "奇葩说",
                    "content": "wow lol wow lol wow lol wow lol wow lol wow lol wow lol wow lol ",
                    "sendtime": "2016-02-28",
                    "markedread": false
                }
            ]
        }
    }
}
