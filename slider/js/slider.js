/**
 * Created by Administrator on 2018/4/14.
 */


function mySlide() {
    var speed = 666;
    var easing = 'swing';
    var interval = 4000;
    var count = 0;
    var imgs = $('.slider>li');
    var conts = $('.control>li');
    var max = imgs.length - 1;
    var width = imgs[0].offsetWidth;



    function change(num) {
        if(num>count){
            if(num > max){
                num = 0;
            }
            $(imgs[num]).css('left',width*2);
            $(imgs[count]).stop().animate({left:'0'},speed,easing);
            $(imgs[num]).stop().animate({left:width},speed,easing);

        } else {
            if(num < 0){
                num = max;
            }
            $(imgs[num]).css('left','0px');
            $(imgs[count]).stop().animate({left:width*2},speed,easing);
            $(imgs[num]).stop().animate({left:width},speed,easing);

        }
        count = num;
        $(conts[count]).addClass('active').siblings().removeClass('active');
    }

    $('.l').on('click',function () {
        change(count-1);
    });
    $('.r').on('click',function () {
        change(count+1);
    });
    conts.on('click',function () {
        change($(this).data('i'));
    });
    var times = null;
    times = setInterval(function () {
        change(count+1);
    },4000);
    $('.slider').on('mouseover',function () {
        clearInterval(times);
    });
    $('.bar').on('mouseover',function () {
        clearInterval(times);
    });
    $('.slider').on('mouseout',function () {
        clearInterval(times);
        times = setInterval(function () {
            change(count+1);
        },interval);
    });
}
mySlide();

