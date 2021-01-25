$(function (){
  if (localStorage.getItem('goods')) {
    // 获取购物车数据
    var goodsArr = JSON.parse( localStorage.getItem('goods') )
    // 获取所有数据
    $.ajax({
      url: './data/goods.json',
      type: 'get',
      dataType: 'json',
      success: function (json){
        var domStr = ''
        $.each(json,function (index,item){
          $.each(goodsArr,function (i,obj){
            if (item.id === obj.id) {
              domStr += `
              <li>
                <input type="checkbox" class="check1">
                <img src="${item.imgurl}" alt="">
                <h3>${item.title}</h3>
                <p class="pri">${item.price}</p>
                <span class="reduce">-</span>
                <span class="number" data-id="${item.id}">${obj.num}</span>
                <span class="add">+</span>
                <span class="sum">${item.price * obj.num}</span>
                <em data-id="${item.id}">删除</em>
              </li>
              `
            }
          })
        })
        $('.list').html(domStr)
      }
    })

    // 删除商品
    $('.list').on('click','li em',function (){
      // 当前点击的商品id
      var id = $(this).attr('data-id')
      $.each(goodsArr,function (index,item){
        if (item.id === id) {
          goodsArr.splice(index,1)
          return false
        }
      })
      // 删除dom结构
      $(this).parent().remove()
      // 更新本地存储的数据
      localStorage.setItem('goods',JSON.stringify(goodsArr))
      if (goodsArr.length <= 0) {
        localStorage.removeItem('goods')
        var newLi = '<li>购物车暂无数据！</li>'
        $('.list').html(newLi)
        $('.head .check')[0].checked = false
        $('.priAll span').html(0)
      }
      // 判断是否要全选
      $('.list li input').each(function (index,ele){
        if (!$(ele).attr('checked')) {//未选中
          $('.head .check')[0].checked = false
        }else{
          $('.head .check')[0].checked = true
        }
      })
      priAll()
    })

    // 商品数量增加
    $('.list').on('click','li .add',function (){
      var id = $(this).prev().attr('data-id')
      var pri = $(this).prev().prev().prev().html()
       $.each(goodsArr,function (index,item){
          if(item.id == id){
            item.num++
            $(this).prev().html(item.num)
            $(this).next().html(item.num*pri)
          }
          localStorage.setItem('goods', JSON.stringify(goodsArr) )
      }.bind(this))
      priAll()
    })

    // 商品数量减少
    $('.list').on('click','li .reduce',function (){
      var id = $(this).next().attr('data-id')
      var pri = $(this).prev().html()
       $.each(goodsArr,function (index,item){
          if(item.id == id){
            item.num--
            if(item.num <= 0){
              item.num = 0
              $(this).next().html(item.num)
              $(this).next().next().next().html(0)
            }else{
              $(this).next().html(item.num) 
              $(this).next().next().next().html(item.num*pri)
            }
          }
          localStorage.setItem('goods', JSON.stringify(goodsArr) )
      }.bind(this))
      priAll()
    })

    // 全选按钮
    $('.head').on('click','.check',function (){
        // 判断是否要全选
       if($(this)[0].checked){
        $('.list li input').each(function (index,ele){
          $(ele)[0].checked = true
        })
       }else{
        $('.list li input').each(function (index,ele){
          $(ele)[0].checked = false
        })
       }
        priAll()
    })

    // 商品选中
    $('.list').on('click','li .check1',function (){
        // 判断是否要全选
        $('.list li input').each(function (index,ele){
          if (!$(ele).attr('checked')) {//未选中
            $('.head .check')[0].checked = false
            return false//结束each循环
          }else{
            $('.head .check')[0].checked = true
          }
        })
        priAll()
    })

    // 计算总价
    function priAll(){
      var num = 0
      $('.list li input').each(function (index,ele){
          if($(ele).prop('checked')){
            num += parseFloat($(ele).parent().find('.sum').html())
          }
          $('.priAll span').html(num)
      })
    }

  } else {
    var newLi = '<li>购物车暂无数据！</li>'
    $('.list').html(newLi)
  }
})