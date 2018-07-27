$(function() {
	var $mainImgBox = $('#mainImgBox');
	var $codeImgBox = $('#codeImgBox');
	var $mainFileInput = $('#mainFileInput');
	var $codeFileInput = $('#wxFileInput');
	var $downloadBtn = $('#downloadBtn');
	var $mainName = $('#mainName');
	var $codeName = $('#codeName');
	var $code = $('#code');
	var $finallyImg = $('#finallyImg');
	var imgArr = [];
	var wxXY = {};
	var mainWH = {};
	var imgBase64;
	var $radios = $("input[name='mode']");
	var automation = true;  // 是否为快速模式

	//
	$('#tips').on('click',function () {
		$(this).toggleClass('tipsOpen')
	});

	// 拖拽上传图片
	$mainImgBox[0].ondragenter = function (event) {   // 清除默认事件，防止浏览器直接打开图片文件
		event.stopPropagation();
		event.preventDefault();
	};
	$mainImgBox[0].ondragover = function (event) {
		event.stopPropagation();
		event.preventDefault();
	};
	$codeImgBox[0].ondragenter = function (event) {
		event.stopPropagation();
		event.preventDefault();
	};
	$codeImgBox[0].ondragover = function (event) {
		event.stopPropagation();
		event.preventDefault();
	};

	$mainImgBox[0].ondrop = function (event) {
		event.stopPropagation();
		event.preventDefault();
		var file = event.dataTransfer.files[0];
		mainImgUpload(file);
	};
	$codeImgBox[0].ondrop = function (event) {
		event.stopPropagation();
		event.preventDefault();
		var file = event.dataTransfer.files[0];
		codeImgUpload(file);
	};

	// 点击上传图片
	$('.box').on('click',function (event) {  // 父盒子的点击事件传递给file input
		event.stopPropagation();
		$(this).find('.file')[0].click();
	});
	$mainFileInput.on('change',function () {
		mainImgUpload(this.files[0]);
	});
	$codeFileInput.on('change',function () {
		codeImgUpload(this.files[0]);
	});

	// 图片上传事件
	function mainImgUpload(file) {
		wxXY = {
			x: 200,
			y: 200,
			w: 200
		};
		$mainName.text(file.name);
		layer.msg('主图上传成功！');
		var reader = new FileReader();
		reader.onload = function (event) {
			imgArr[0] = event.target.result;
			getMainWH(event.target.result); // 获取海报的宽高后开始合成
		};
		reader.readAsDataURL(file);
	}
	function codeImgUpload(file) {
		$codeName.text(file.name);
		layer.msg('二维码上传成功！');
		var reader = new FileReader();
		reader.onload = function (event) {
			imgArr[1] = event.target.result;
			compound();
		};
		reader.readAsDataURL(file);
	}

	// 二维码位置模式设置
    $radios.on('click',function () {
		if($(this).hasClass('on')){
            layer.msg('已切换到【快速模式】，将智能识别二维码进行拼图！');
        }else {
			layer.msg('已切换到【自由模式】，按住鼠标拖放即可移动二维码！');
			switchToMode2();
		}
	});

	// 自由模式下二维码位置改变
    function switchToMode2() {
		automation = false;
		var hasMove = false;
		$finallyImg.on('mousedown', function (event) {
			event.preventDefault();
			$code.show().css({
				top: event.offsetY + 'px',
				left: event.offsetX + 'px'
			});
			wxXY.x = event.offsetX;
			wxXY.y = event.offsetY;
			window.onmousemove = function (event) {
				hasMove = true;
				var w = event.clientX  - $code.offset().left;
				$code.width(w*2);
				$code.height(w*2);
				wxXY.w = w*2;
			};
			window.onmouseup = function () {
				window.onmousemove = null;
				$code.hide();
				if(hasMove){
					compound();
					hasMove = false;
				}
			};
		});
	}

	// 返回海报图宽高
	function getMainWH(src) {
		var img = new Image;
		img.src = src;
		img.onload = function () {
			mainWH.w = img.width;
			mainWH.h = img.height;
			compound(); // 启动合成
		}
	}

	//生成画布
	function compound(){
		draw(function(){
			$finallyImg.html('<img src="'+imgBase64+'">');
		})
	}
	function draw(fn) {
		var c = document.createElement('canvas'),
			ctx = c.getContext('2d'),
            result = {};
		result = {
			x: wxXY.x,
			y: wxXY.y,
			w: wxXY.w
		};
		c.width = mainWH.w;
		c.height = mainWH.h;

		function drawing(n) {
			if (n < imgArr.length) {
				var img = new Image;
				img.src = imgArr[n];
				img.onload = function() {
					if (n==1) {
                        ctx.drawImage(img,result.x,result.y,result.w,result.w);
						drawing(n+1);
						console.log(result);
						if(result.w){
							layer.msg('拼图成功，点击【下载海报】即可下载！');
						}else {
							layer.msg('拼图失败，建议使用【自由模式】并手动设定二维码位置！');
						}
					} else {
						ctx.drawImage(img,0,0,img.width,img.height);
						if(automation) {
                            var data = ctx.getImageData(0, 0, img.width, img.height).data;
                            result = getCodeInfo(data,img.width,img.height);
							console.log(result);
							drawing(n+1);
						}else {
                            drawing(n+1);
						}
					}
				}
			} else {
				imgBase64 = c.toDataURL("image/jpeg",1);
				fn();
			}
		}
		drawing(0);
	}

    // 图片像素点处理
    function getCodeInfo(data,w,h) {
        var arr = [];
        for(var i = 0; i < h; i ++){
            for(var j = 0; j < w; j++){
                var x = i * 4 * w + 4 * j,
                    r = data[x],
                    g = data[x + 1],
                    b = data[x + 2],
                    rgba = {};
                rgba.x = j;
                rgba.y = i;
                if(r > 250 && g > 250 && b > 250){
                    arr.push(rgba);
                }
            }
        }
        return disposeRgbaArr(arr,data,w);
    }

    // 处理像素点数据
    function disposeRgbaArr(arr,data,w) {
        var count = 0,   // 前一个点的值
            times = 0,   // 连续白点的次数
            XArr = [],   // 从左至右保存X直线上每个点的X坐标
            result = {
                lastIndex: 0    // 保存首次X方向直线的lastIndex
            };
        getY();
        return result;

        function getY(){
            for(var i = result.lastIndex; i < arr.length; i++){
                if(arr[i].x == ++count){
                    times ++;
                    XArr[times] = arr[i].x;
                }else {
                    if(times > 190) {   // 190为连续白点的阀值  非固定值
                        result.x = arr[i - 1].x;
                        result.y = arr[i - 1].y;
                        result.lastIndex = i;
                        getX(data,w,result.y);
                        break;
                    }else {
                        count = arr[i].x;
                        times = 0;
                        XArr[times] = arr[i].x
                    }
                }
            }
        }
        function getX(data,w,y) {
            var find = false;
            for(var i = 0; i < XArr.length; i++){
                var num = w * 4 * y + XArr[i] * 4;
                var times = 0;
                for(var j = 0; j < 190; j++){
                    if(data[num + j * 4 * w] > 250 && data[num + j * 4 * w + 1] > 250 && data[num + j * 4 * w + 2] > 250){
                        times ++;
                        if(times > 180) {   // 此处次数必须比190小
                            find = true;
                            result.x = XArr[0] + i -1;
                            result.w = XArr.length - i + 1;
                            return;
                        }
                    }else {
                        times = 0;
                    }
                }
            }
            if(!find) {
                 getY();  //  如果没有找到Y直线  继续找下一条X直线
            }
        }
    }

	// 下载按钮点击事件
	$downloadBtn.on('click',download);

	// 下载图片事件
	function download() {
		var imgData = imgBase64;
		imgData = imgData.replace('image/jpeg','image/octet-stream');
		function saveFile(data,filename) {
			var link = document.createElement('a');
			link.href = data;
			link.download = filename;
			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			link.dispatchEvent(event);
		}
		var filename = new Date().toLocaleDateString() + '.' + 'jpg';
		saveFile(imgData, filename);
	}
});