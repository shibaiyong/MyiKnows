var dataUtil = {
  getLabelData() {
    return []
  },
  getCorrelationNewsData() {
    return []
  },
  getTabItems() {
    return ["首页", "舆情头条", "监测中心", "简报中心 "]
  },
  getStatusData() {
    return [{
      "title": "任务状态",
      "id": "missStatus",
      "items": [
        {
          "name": "运行中",
          "id": "A",
          "isSelected": true
        },
        {
          "name": "已停止",
          "id": "B  ",
          "isSelected": false
        }
      ]
    }, {
      "title": "任务类型",
      "id": "missType",
      "items": [
        {
          "name": "全部监测",
          "id": "A",
          "isSelected": true
        },
        {
          "name": "常规监测",
          "id": "B",
          "isSelected": false
        },
        {
          "name": "人物监测",
          "id": "C",
          "isSelected": false
        },
        {
          "name": "文稿监测",
          "id": "D",
          "isSelected": false
        }
      ]
    }]
  },
  getMonitorListData() {
    return [
      {name: "苏州社会民生全网监测", status: 0, id: "12435333333", isSelected: false, buttonStyle: [true, false, false, false]},
      {name: "苏州社会民生全网监测", status: 0, id: "12435333333", isSelected: false, buttonStyle: [true, false, false, false]},
      {
        name: "苏州社会民生全网监测",
        status: 0,
        id: "12435333333",
        isSelected: false, buttonStyle: [true, false, false, false]
      }, {
        name: "苏州社会民生全网监测",
        status: 0,
        id: "12435333333",
        isSelected: false,
        buttonStyle: [true, false, false, false]
      }, {
        name: "苏州社会民生全网监测",
        status: 0,
        id: "12435333333",
        isSelected: false, buttonStyle: [true, false, false, false]
      }, {
        name: "苏州社会民生全网监测",
        status: 0,
        id: "12435333333",
        isSelected: false,
        buttonStyle: [true, false, false, false]
      }, {
        name: "苏州社会民生全网监测",
        status: 0,
        id: "12435333333",
        isSelected: false, buttonStyle: [true, false, false, false]
      }, {
        name: "苏州社会民生全网监测",
        status: 0,
        id: "12435333333",
        isSelected: false,
        buttonStyle: [true, false, false, false]
      }]
  },
  getMessageCenterListData() {
    return [{
      id: "123141",
      date: "2018/08/21 12:23",
      type: "1",
      content: "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
      status: "1"
    }, {
      id: "123142",
      date: "2018/08/21 12:23",
      type: "1",
      content: "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
      status: "1"
    }, {
      id: "123143",
      date: "2018/08/21 12:23",
      type: "1",
      content: "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
      status: "1"
    }, {
      id: "123144",
      date: "2018/08/21 12:23",
      type: "1",
      content: "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
      status: "1"
    }, {
      id: "123145",
      date: "2018/08/21 12:23",
      type: "1",
      content: "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
      status: "1"
    }, {
      id: "123146",
      date: "2018/08/21 12:23",
      type: "1",
      content: "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难",
      status: "1"
    }, {id: "123147", date: "2018/08/21 12:23", type: "1", content: "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难", status: "1"}]
  },
  getArticleDetailsData() {
    return {
      title: "特朗普：解除对俄制裁有条件 先要给美国“好处”",
      publishTime: "2018-12-14 13:25",
      source: "新华社",
      gatherSource: "腾讯新闻",
      id: "1231312313",
      newsLink: "http://www.baidu.com",
      keyword: ["海外", "俄罗斯", "俄罗斯"],
      abstract: "本次峰会主题为“合作共赢，携手构建更加紧密的中非命运共同体”。中非合作论坛非方成员领导人将应邀与会，有关非洲地区组织和国际组织代表将出席峰会有关活动。",
      content: "  <p>海外网8月21日电\n" +
      "            当地时间20日，美国总统特朗普在对媒体谈及美国对俄制裁这一话题时表示，如果俄罗斯能在包括叙利亚、乌克兰等问题上做出让步，做一些“对美国来说有利的事情”，自己可能就会开始考虑解除对俄罗斯的制裁。</p>\n" +
      "\n" +
      "          <p>\n" +
      "            综合今日俄罗斯及塔斯社报道，特朗普接受路透社采访时称，在最近与普京的会晤中，两人谈到了叙利亚、乌克兰、以色列等等议题，但并没有谈论到美国解除对俄制裁的问题。至于美国是否会取消其制裁，特朗普则是为这种可能性设置了先决条件。</p>\n" +
      "\n" +
      "          <p>\n" +
      "            特朗普称：“我没有想过（解除对俄制裁），我根本没有考虑过这个问题。但如果他们（俄罗斯）做了对我们有利的事情，那么我会考虑的。如果没有（这一先决条件）我就不会考虑。”他在随后也提到，美国和俄罗斯有很多共同点，两国“在很多方面可以互相帮助”。</p>\n" +
      "\n" +
      "\n" +
      "          <p>\n" +
      "            俄媒指出，在克里米亚并入俄罗斯后，美国就自2014年起对俄罗斯实施了广泛的制裁，并在随后对制裁进行了多次的扩展和更新，涉及到个人和法律实体。接下来的几年中，美国又指控俄罗斯干涉其2016年大选以及俄罗斯官员涉嫌侵犯人权，对俄方实施制裁。最新到来的一轮制裁则是与俄罗斯前间谍在英国中毒事件有关。</p>\n" +
      "\n" +
      "          <p>\n" +
      "            美国国务院8月8日宣称，已确认俄方在英国对俄前情报人员斯克里帕尔及其女儿的攻击中使用神经毒剂，并决定在22日左右对俄罗斯实施制裁。对此，俄罗斯外交部发言人扎哈罗娃10日也作出回应，称俄罗斯也正制定回应美国新制裁的对等措施。</p>\n" +
      "\n" +
      "          <p>今年3月，俄罗斯前特工斯克里帕尔及其女儿尤利娅在英国索尔兹伯里市街头一张长椅上昏迷不醒。英国政府认定俄罗斯与此事有关，但俄方坚决否认。斯克里帕尔5月中旬在治疗结束后出院，尤利娅也已于4月中旬出院。</p>",
      labelData: [
        {
          "titleLabel": "舆情类型",
          "itemLabel": [
            "海外",
            "俄罗斯",
            "美国"
          ],
          "closeAble": true
        },
        {
          "titleLabel": "内容标签",
          "itemLabel": [
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
          ],
          "closeAble": false
        }
        ,
        {
          "titleLabel": "人物标签",
          "itemLabel": [
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
          ],
          "closeAble": false
        }
        ,
        {
          "titleLabel": "机构标签",
          "itemLabel": [
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
          ],
          "closeAble": false
        },
        {
          "titleLabel": "机构标签",
          "itemLabel": [
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
          ],
          "closeAble": false
        },
        {
          "titleLabel": "机构标签",
          "itemLabel": [
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
          ],
          "closeAble": false
        },
        {
          "titleLabel": "机构标签",
          "itemLabel": [
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
          ],
          "closeAble": false
        },
        {
          "titleLabel": "地点标签",
          "itemLabel": [
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
            "海外",
            "俄罗斯",
          ],
          "closeAble": false
        },
        {
          "titleLabel": "情感标签",
          "itemLabel": [
            "正面",
          ],
          "closeAble": false
        }
      ], correlationNewsData: [
        {
          "title": "相似内容",
          "showMore": true,
          "items": [
            {
              "title": "新闻",
              "content": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难"
            },
            {
              "title": "新闻",
              "content": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难"
            },
            {
              "title": "新闻",
              "content": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难"
            },
            {
              "title": "新闻",
              "content": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难"
            }
          ]
        },
        {
          "title": "相关内容",
          "showMore": true,
          "items": [
            {
              "title": "新闻",
              "content": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难"
            },
            {
              "title": "新闻",
              "content": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难"
            },
            {
              "title": "新闻",
              "content": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难"
            },
            {
              "title": "新闻",
              "content": "美国制裁上瘾新兴市场扛得住吗?这个国家左右为难"
            }
          ]
        }]
    }
  }
}
export default dataUtil;
