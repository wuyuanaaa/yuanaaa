(function () {
    let start = document.querySelector('.begin'),
        items = document.querySelectorAll('.item'),
        first = true,
        round = 2,  // 转 round 圈后正式抽奖
        resultArr = [],
        current = 0,
        count = 0,
        result;

    const prob = {
        '1': 0,
        '2': 22,
        '3': 44,
        '4': 18,
        '5': 40,
        '6': 12,
        '7': 10,
        '8': 7,
    };

    let total = 0;

    for(let k in prob) {
        if(prob.hasOwnProperty(k)) {
            if (prob[k] !== 0) {
                total += parseInt(prob[k]);
            }
        }
    }

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
                layer.msg('恭喜你抽到了' + result + '号奖品！');
            }
        }, 100);

    }

    localStorage.removeItem('_yuanaaa');

    start.addEventListener('click', function () {
        items[current].classList.remove('active');
        current = 0;
        items[current].classList.add('active');
        if (localStorage.getItem('_yuanaaa')) {
            result =  parseInt(localStorage.getItem('_yuanaaa'));
            layer.msg('你已经抽过一次了，再怎么抽结果都一样的！')
        } else {
            result = parseInt(getResult());
        }
        localStorage.setItem('_yuanaaa', result);
        count = (round * 8 - 1 + result);
        run();
    });




})();
