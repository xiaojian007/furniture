const App = getApp();

Page({
  data: {

    // 列表高度
    scrollHeight: 0,

    // 一级分类：指针
    curNav: true,
    curIndex: 0,

    // 分类列表
    list: [],

    // show
    notcont: false
  },

  onLoad: function() {
    let that = this;
    // 设置分类列表高度
    that.setListHeight();
    // 获取分类列表
    that.getCategoryList();
  },

  /**
   * 设置分类列表高度
   */
  setListHeight: function() {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight - 47,
        });
      }
    });
  },

  /**
   * 获取分类列表
   */
  getCategoryList: function() {
    let that = this;
    let data = {
      list: [{
        category_id: 1,
        name: '分类1',
        child: [{
          file_id: 21,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类1-1'
        }]
      }, {
        category_id: 2,
        name: '分类2',
        child: [{
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }, {
          file_id: 22,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类2-1'
        }]
      }, {
        category_id: 3,
        name: '分类3',
        child: [{
          file_id: 24,
          image: {
            file_path: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2748829669,3023975841&fm=26&gp=0.jpg',
          },
          name: '分类3-1'
        }]
      }]
    }
    that.setData({
      list: data.list,
      curNav: data.list.length > 0 ? data.list[0].category_id : true,
      notcont: !data.list.length
    });
  },

  /**
   * 一级分类：选中分类
   */
  selectNav: function(t) {
    let curNav = t.target.dataset.id,
      curIndex = parseInt(t.target.dataset.index);
    this.setData({
      curNav,
      curIndex,
      scrollTop: 0
    });
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage: function() {
    return {
      title: "全部分类",
      path: "/pages/category/index"
    };
  }

});