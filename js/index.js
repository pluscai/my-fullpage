
(function($) {
	$.fn.screen = function(options) {
		var set = $.extend({
			before: [],
			after: []
		}, options);

		var _ = this; // container容器

		// 设置容器样式
		_.css({
			overflow: 'hidden',
			position: 'fixed',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0
		});

		var ch = _.children('div');
		_.empty();

		// 创建用于移动的内部div容器
		var _i = $('<div></div>').css({
			position: 'relative',
			left: 0,
			top: 0,
			width: '100%',
			height: '100%',
			visibility: 'visible'
		});

		_i.appendTo(_);

		// 将每屏的内容添加到移动的内部div容器中
		ch.css({
			width: '100%',
			height: '100%'
		}).appendTo(_i);

		// 以上，切屏展示的基本结构搭建完成。

		// 创建右侧的导航条
		var navbar = $("<ul></ul>").css({
			position: 'absolute',
			right: '10%',
			top: '50%',
			"z-Index": '1000'
		});

		ch.each(function(i) {
			var _this = $(this);
			// 根据容器中包含的 div数量添加导航菜单
			var barele = $("<li></li>").attr("index", i).css({
				'background': (i == 0 ? '#fff' : 'transparent'),
				border: "3px solid #2876B3",
				'border-radius': '50%'
			});
			barele.css({
				'list-style': "none",
				cursor: 'pointer',
				'margin-bottom': '6px',
				width: '14px',
				height: '14px'
			});

			barele.appendTo(navbar);
		});

		// 先将其添加至HTML文档流对象中，再设置其top位置，不然其位置计算会忽略其自身高度
		navbar.appendTo(_);
		navbar.css({
			'margin-top': -parseInt(navbar.css("height")) / 2 + 'px'
		});
		// 以上，导航的创建完毕

		var wheelname = navigator.userAgent.indexOf("Firefox") > 0 ? "DOMMouseScroll" : "mousewheel";
		_.bind(wheelname, function() {
			console.log(arguments.callee.caller.arguments[0]);
			var evt = window.event || arguments.callee.caller.arguments[0];
			var countV = 0;
			if(evt.wheelDelta) {
				countV = Math.floor(evt.wheelDelta / 120) * 60;
			} else if(evt.detail) {
				countV = -Math.floor(evt.detail / 3) * 60;
			}
			// 得到鼠标滚动的值。这一块得用兼容。因为除了火狐，。其他的浏览器的滚轮事件还得兼容一下

			if(countV < 0) {
				// 如果countV是负值说明向下滚动
				slide(1); // 向下切屏
			} else {
				slide(-1);

			} // 执行滚动动画事件
		});

		// 切屏的方法实现
		var currentPage = 0; // 记录当前是第几屏的内容，回调函数的执行也要靠这个参数识别要执行哪个回调函数
		var lg = _i.children('div').length; // 记录一共多少屏内容

		var flag = true; // 如果切屏正在进行中，则不响应滚轮滑动事件  flase表示正在切屏

		$("li", navbar).bind("click", function() {
			var index = $(this).index();
			slideClick(index);
			navbar.find("li").css("background", "transparent");
			navbar.find("li").eq(index).css("background", "#fff");
		});

		// 点击导航的切屏
		function slideClick(index) {
			if(!flag) {
				return;
			} // 如果正在切换中，则跳出函数，不做处理
			flag = false;
			_i.animate({
				top: -index * 100 + "%"
			}, 'slow', function() {

				if(set.after[index]) { // 如果动画结束后有这个对应屏的回调函数，则执行这个回调函数
					set.after[index]();
				}
				flag = true; // 切屏动作执行完后，flag=true以便可以继续切屏
			});
		}

		// 鼠标滚轮滚动的切屏 
		function slide(n) { // n=1 就是向下切屏，n=-1 就向下切屏
			if(!flag) {
				return;
			} // 如果正在切换中，则跳出函数，不做处理

			flag = false;
			if(n > 0 && currentPage < (lg - 1)) { // 向下切屏时，如果不是最后一屏则执行切屏动作
				if(set.before[currentPage]) {
					set.before[currentPage](); // 这个是切屏前的回调函数执行
				}
				currentPage++; // 注意对当前屏数的加减操作 是在执行前后动画的中间进行的

				_i.animate({
					top: -currentPage * 100 + "%"
				}, 'slow', function() {
					navbar.find("li").css("background", "transparent");
					navbar.find("li").eq(currentPage).css("background", "#fff");
					if(set.after[currentPage]) { // 如果动画结束后有这个对应屏的回调函数，则执行这个回调函数
						set.after[currentPage]();
					}
					flag = true; // 切屏动作执行完后，flag=true以便可以继续切屏
				});

			} else {
				if(n < 0 && currentPage > 0) { //向上切屏时，如果不是第一屏则执行切屏动作
					if(set.before[currentPage]) {
						set.before[currentPage](); // 这个是切屏前的回调函数执行
					}
					currentPage--;
					_i.animate({
						top: -currentPage * 100 + "%"
					}, 'slow', function() {
						navbar.find("li").css("background", "transparent");
						navbar.find("li").eq(currentPage).css("background", "#fff");
						if(set.after[currentPage]) {
							set.after[currentPage]();
						}
						flag = true;
					});
				} else {
					flag = true; // 如果没执行动画，要把flag置为true;不然flag一直为false不能再切换
				}
			}
		}
	}

})(jQuery);