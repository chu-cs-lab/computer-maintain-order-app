
Page({

  data: {
    cloudImgList:[]
  },


  onLoad(options) {
    console.log(options.orderId)
    this.setData({
      orderId:options.orderId
    })
  },
  getText(e){
    console.log(e)
    this.setData({
      text:e.detail.value
    })
  },
  chooseImage(){
    var that = this;
    wx.chooseImage({
      count: 3,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success(res){
        console.log(res)
        that.data.tempImgList = res.tempFilePaths
        that.uploadImages()
      }
    })
  },
  uploadImages(){
    var that = this;
    for(var l in this.data.tempImgList){
      wx.cloud.uploadFile({
        cloudPath:`repairmanImages/${Math.random()}_${Date.now()}.${this.data.tempImgList[l].match(/\.(\w+)$/)[1]}`,
        filePath:this.data.tempImgList[l],
        success(res){
          console.log(res.fileID)
          that.data.cloudImgList.push(res.fileID)
          that.setData({
            cloudImgList:that.data.cloudImgList
          })
        }
      })
    }


  },
  deleteImg(e){
    console.log(e.currentTarget.dataset.index)
    this.data.cloudImgList.splice(e.currentTarget.dataset.index,1)
    this.setData({
      cloudImgList:this.data.cloudImgList
    })
  },
  submit(){
    wx.showModal({
      title:'提示',
      content:'确认提交吗',
      confirmText:'确定'
    })
    .then(res=>{
      if(res.confirm == true){
        wx.cloud.database().collection('shop_orders').doc(this.data.orderId)
        .update({
          data:{
            status:2,
            repairNote:this.data.text,
            repairImages:this.data.cloudImgList,

          }
        })
        .then(result=>{
          console.log(result)
          wx.navigateBack({
            delta: 0,
            success(){
              wx.showToast({
                title: '提交成功',
              })
            }
          })
          
          
        })
      }else{

      }

    })
  }

  
})