$(function() {
	var $mainImgBox = $('#mainImgBox');
	var $codeImgBox = $('#codeImgBox');
	var $mainFileInput = $('#mainFileInput');
	var $codeFileInput = $('#codeFileInput');
	var $downloadBtn = $('#downloadBtn');
	var $mainName = $('#mainName');
	var $codeName = $('#codeName');
	var $code = $('#code');
	var $finalImgBox = $('#finalImgBox');
	var $finallyImg = $('#finallyImg');
	var $help = $('#help');
	var $helpText = $('#helpText');
	var $close = $('#close');
	var imgArr = [];
	var wxXY = {};
	var mainWH = {};
	var imgBase64;
	var automation = true;  // 是否为快速模式

	// help
	$help.on('click',function () {
		$helpText.fadeIn();
	});

	$close.on('click',function () {
		$helpText.fadeOut();
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
	$('.imgBox-btn').on('click',function (event) {  // 父盒子的点击事件传递给file input
		event.stopPropagation();
		$(this).prev().find('.file')[0].click();
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
			w: 200,
			isDefault: 0
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
			if(imgArr[0] && imgArr[1]) {
                compound();
			}
		};
		reader.readAsDataURL(file);
	}

	// 二维码位置设置
	switchToMode2();

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
			wxXY.x = event.offsetX*mainWH.w/400;
			wxXY.y = event.offsetY*mainWH.w/400;
			window.onmousemove = function (event) {
				hasMove = true;
				var w = event.clientX  - $code.offset().left;
				$code.width(w-2);
				$code.height(w-2);
				wxXY.w = w*mainWH.w/400;
				wxXY.isDefault = 2;
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
			if(imgArr[0] && imgArr[1]){
                compound(); // 启动合成
			}
		}
	}

	//生成画布
	function compound(){
		draw(function(){
			$finalImgBox.show();
			$finallyImg.html('<img src="'+imgBase64+'">');
		})
	}
	function draw(fn) {
		var c = document.createElement('canvas'),
			ctx = c.getContext('2d');

        c.width = mainWH.w;
		c.height = mainWH.h;
		var result = {};

		function drawing(n) {
			if (n < imgArr.length) {
				var img = new Image;
				img.src = imgArr[n];
				img.onload = function() {
					if (n==1) {
                        if(wxXY.isDefault === 1){
                        	wxXY = result;
							console.log(1);
						}
						console.log(wxXY);
						ctx.drawImage(img,wxXY.x,wxXY.y,wxXY.w,wxXY.w);
						drawing(n+1);
                        if(wxXY.isDefault === 0){
                            layer.msg('拼图失败，请手动设定二维码位置！');
						}else {
                            layer.msg('拼图成功，点击【下载海报】即可下载！');
						}

					} else {
						ctx.drawImage(img,0,0,img.width,img.height);
						var data = ctx.getImageData(0, 0, img.width, img.height).data;
						if(wxXY.isDefault === 0){
							result = getCodeInfo(data,img.width,img.height);

						}
						drawing(n+1);
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
        var colorRight = {};
        for(var i = 0; i < h; i ++){
            for(var j = 0; j < w; j++){
                var x = i * 4 * w + 4 * j,
                    r = data[x],
                    g = data[x + 1],
                    b = data[x + 2];
                if(r > 250 && g > 250 && b > 250){
                    colorRight[j+'-'+i] = true;
                }
            }
        }
        return disposeColorRight(colorRight);
    }

    // 处理像素点数据
	function disposeColorRight(obj) {
		var rightObj = obj;
        var len = 180;  // 白色线条的最小长度
		var result = {};
		for(var key in rightObj){
			var arr = key.split('-');
            var X = parseInt(arr[0]),
                Y = parseInt(arr[1]),
                times = 0,
				i = 0;
            function isRight() {
				if(rightObj[(X + i) + '-' + Y] && rightObj[X+ '-' + (Y + i)]){
					times ++;
					i++;
					isRight();
				}else {
					result = {
						x: X,
						y: Y,
						w: times
					};
				}
			}
			isRight();

            if(result.w > len){
				wxXY.isDefault = 1;
                return result;
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