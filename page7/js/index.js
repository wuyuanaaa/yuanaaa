$(function () {
    // 倒计时
    var $dateNum = $('#dateNum'),
        url = {},
        $shareContent = $('#toImg'),
        $textContent = $('.img-text-content'),
        $dateEl = $('#date');

    // 文本格式化，去除样式
    $textContent.on('blur', function () {
        var text = $(this).html();
        var reg = /<[\w:]+\s\w+[^>]+>/g;
        var regBold = /#b([^#]+?)#b/g;
        text = text.replace(reg, '');               // 去掉除去</br> <b> 之外的html标签
        text = text.replace(regBold,'<b>$1</b>');   // 将手动添加的 #b...#b 替换成<b>标签包裹
        $(this).html(text);
    });

    // 设置时间
    var now = new Date(),
        str = '';

    // 设置默认日期为当前日期
    var nowObj = disposeDate(now);
    str = nowObj.y + '-' + nowObj.m + '-' + nowObj.d;
    $dateNum.val(str);
    $dateNum.on('change', function () {
        str = $(this).val();
        changeNum(str);
    });
    changeNum(str);     // 初始化图片日期
    // 改变图片日期
    function changeNum(str) {
        var num = str.replace(/\-/g,'.');
        $dateEl.text(num);
    }

    function disposeDate(date) {
        var obj = {};
        obj.y = date.getFullYear();
        obj.m = date.getMonth() + 1;
        obj.m = obj.m < 10 ? '0'+ obj.m : obj.m;
        obj.d = date.getDate();
        return obj;
    }

    // 下载图片
    $('#download').on('click', function () {
        getBase64();
    });

    function getBase64() {
        $shareContent.css({
            'transform': 'scale(1)'
        });
        html2canvas($shareContent[0],{logging:false}).then(function (canvas) {
            url.base64 = canvas.toDataURL("image/jpeg", 1);
            download();
        });
    }

    // 下载图片事件
    function download() {
        var imgData = url.base64;
        var filename = '映课早报' + str + '.jpg';
        imgData = imgData.replace('image/jpeg', 'image/octet-stream');

        saveFile(imgData, filename);
        $shareContent.css({
            'transform': 'scale(0.5)'
        });

        function saveFile(data, filename) {
            appendImg(data);            // 页面添加图片预览，下载失败时可以直接右键下载图片

            var link = document.createElement('a');
            data = data.replace('image/jpeg', 'image/octet-stream');

            link.href = data;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function appendImg(data) {
            var img = document.createElement('img');
            img.src = data;
            $('#hook-downLoad').html('').append(img);
        }
    }
});
