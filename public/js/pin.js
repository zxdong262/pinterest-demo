/*!
 * pin.js
 */

//start
$(function() {

	var
	minPicWidth = 300
	,imgCount = 0
	,org = ''
	,hint = 250
	,onloading = false
	,maxUnitsNumber = 500
	,pageSize = 12
	,windowWidth = $(window).width()
	,noMorePics = false

	//adjust when resize window
	$(window).resize(function() {

		if($(window).width() !== windowWidth) {
			windowWidth = $(window).width()
			$('#pics .img-wrap').unwrap()
			layout()
		}

	})

	//on scroll
	$(window).on('scroll', function() {
		var wh = $(window).height()
		,wst = $(window).scrollTop()
		,bh = $('body').height()
		if(wst + hint + wh > bh && !onloading) getData()
	})


	//init
	layout()

	//ajax get data
	function getData() {
		var count = $('#pics .img-wrap').length

		onloading = true
		$('#meta').html('loading...')

		$.ajax({
			url: '/pin'
			,type: 'get'
			,data: {
				pageSize: pageSize
				,from: count
			}
			,success: function(res) {

				//error
				if(!res || res.code || res.code !== 0) err()
				else renderData(res)
			}
		})
	}

	//error handler
	function err() {
		onloading = false
		$('#meta').html('<i class="color-red">loading error</i>')
	}

	//renderData
	function renderData(res) {
		var arr = res.data
		,len = arr.length
		,ht = len < pageSize?'<i class="color-green">no more pics</i>': ''
		,i = 0
		,cols = $('#pics').children()
		,colsCount = cols.length
		,dom = ''
		,item

		for(;i < len;i ++) {
			item = arr[i]
			dom = '<span class="img-wrap block">' +
							'<span class="pd-img block">' +
								'<span class="block">' +
				      		'<img class="block" alt="" src="' + item.imgPath + '" />' + 
				      	'</span>' +
				      	'<span class="block img-desc bold aligncenter">' + item.title + '</span>' +
				      '</span>' +
				    '</span>'
			cols.eq(i%colsCount).append(dom)
		}

		checkDomSize()
		if(len < pageSize) noMorePics = true
		onloading = false
		$('#meta').html(ht)
	}

	//checkDomSize, if tooooo many imgs, delete some from the top
	function checkDomSize() {
		var size = $('#pics .img-wrap').length
		,cols = $('#pics').children()
		,colsCount = cols.length
		,toDelete = Math.floor((size - maxUnitsNumber) / colsCount)
		if(size < maxUnitsNumber) return
		cols.each(function() {
			$(this).children(':lt(' + toDelete + ')').remove()
		})
	}

	//adjust layout
	function layout() {
		
		
		var 
		w = $('#pics').width()

		if(w < minPicWidth * 2) {

			$('#pics .img-wrap').wrapAll('<span class="one-col col c1" />')
		}
		else if(w <= minPicWidth * 3) {
			$('#pics .img-wrap').filter(':even').wrapAll('<span class="two-col col c1" />')
			$('#pics').children('.img-wrap').wrapAll('<span class="two-col col c2" />')
			$('.two-col').width(picWidth + 20)
		}
		else {
			$('#pics .img-wrap').filter(function(index) {
				return index % 3 == 0
			}).wrapAll('<span class="three-col iblock c1" />')
			$('#pics').children('.img-wrap').filter(':odd').wrapAll('<span class="three-col col c2" />')
			$('#pics').children('.img-wrap').wrapAll('<span class="three-col col c3" />')
		}
		
	}

})