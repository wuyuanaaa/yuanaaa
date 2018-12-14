(function () {
    let start = document.querySelector('.begin'),
        items = document.querySelectorAll('.item'),
        first = true,
        round = 2,  // 转 round 圈后正式抽奖
        resultArr = [],
        current = 0,
        count = 0,
        result;

    /*
    * 概率：
    *   概率0 则不可能被抽到
    *   其他值的概率为 当前概率 / 总概率 ，意思就是 数字 相对越大 概率越大
    * */
    const prob = {
        '1': 11,
        '2': 44,
        '3': 23,
        '4': 18,
        '5': 28,
        '6': 0,
        '7': 10,
        '8': 7,
    };

    // 计算总概率
    let total = 0;
    for(let k in prob) {
        if(prob.hasOwnProperty(k)) {
            if (prob[k] !== 0) {
                total += parseInt(prob[k]);
            }
        }
    }
    // 生成正式的概率
    const realProb = {};
    for(let k in prob) {
        if(prob.hasOwnProperty(k)) {
            if (prob[k] === 0) {
                realProb[k] = 0
            } else {
                realProb[k] = Math.floor(parseInt(prob[k]) * 1000 / total);
            }
        }
    }
    // 抽取抽奖结果
    function getResult() {
        if (first) {
            for(let k in realProb) {
                if(realProb.hasOwnProperty(k)) {
                    while (realProb[k] > 0) {
                        resultArr.push(k);
                        realProb[k]--;
                    }
                }
            }
            first = false;
        }
        resultArr.sort(() => Math.random() - 0.5);
        return resultArr[0];
    }

    // 开始抽奖
    function run() {
        setTimeout(function () {
            items[current].classList.remove('active');
            current ++;
            if (current > 7) {
                current = 0;
            }
            items[current].classList.add('active');
            count --;
            if (count > 0) {
                run();
            } else {
                layer.msg('恭喜你抽到了' + items[result - 1].innerText + '！！！');
            }
        }, 100);
    }
    // 抽奖结果存至本地缓存
    localStorage.removeItem('result');

    // 注册事件
    start.addEventListener('click', function () {
        items[current].classList.remove('active');
        current = 0;
        items[current].classList.add('active');
        if (localStorage.getItem('result')) {
            result =  parseInt(localStorage.getItem('result'));
            layer.msg('你已经抽过一次了，再怎么抽结果都一样的！')
        } else {
            result = parseInt(getResult());
        }
        localStorage.setItem('result', result);
        count = (round * 8 - 1 + result);
        run();
    });
})();
