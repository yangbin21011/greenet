/**
 * Created by Administrator on 2017/5/8.
 */
var timer = null;
// var timerBanner = null;
var timerId = null;
// var btn = document.getElementById("btn");
// var demo = document.getElementById("demo");
var box = document.getElementById("banner");
var screen = box.children[0];
var ul = screen.children[0];
var ol = screen.children[1];
var ulLis = ul.children;//所有的广告
var imgWidth = screen.offsetWidth;
//var nav = document.getElementById("nav");
//var navBtns = nav.children;

//console.log(navBtns[0]);

//1.动态生成结构
//1.1根据图片数量动态生成按钮
for (var i = 0; i < ulLis.length; i++) {
    var li = document.createElement("li");
    li.innerHTML = "";
    ol.appendChild(li);
}
var olLis = ol.children;//所有的按钮
olLis[0].className = "current";
//1.2克隆第一张广告 放到最后
// var firstImg = ulLis[0].cloneNode(true);
// ul.appendChild(firstImg);

//2.鼠标经过按钮
//鼠标经过按钮 按钮排他 以动画的形式把ul移动到指定的位置
for (var j = 0; j < olLis.length; j++) {
    olLis[j].index = j;
    olLis[j].onmouseover = function () {
        //排他
        //干掉所有人
        for (var k = 0; k < olLis.length; k++) {
            olLis[k].className = "";
            // navBtns[k].className="";
        }
        //留下我自己
        this.className = "current";
        //以动画的形式把ul移动到指定的位置
        //目标 和 按钮索引有关 和 图片宽度有关 而且是负数
        var target = -this.index * imgWidth;
        animate(ul, {"left": target});
        // navBtns[this.index].className="current1";
    };
}

//3以动画的形式把ul移动到指定的位置
var pic = 0;//记录当前正在显示的图片的索引
var square = 0;//记录当前正在亮起的按钮的索引
var play = function () {
    //先判断 如果是最后一个图片 先让ul瞬间跳会开始位置 然后索引也要归零
    if (pic === ulLis.length - 1) {
        ul.style.left = 0 + "px";
        pic = 0;//索引也要归零
    }
    pic++;//计算出将要显示的图片的索引
    //目标 和pic有关 和 图片宽度有关 而且是负数
    var target = -pic * imgWidth;
    animate(ul, {"left": target});
    //按钮也要跟着走
    if (square < olLis.length - 1) {
        square++;
    } else {
        square = 0;
    }
    //干掉所有人
    for (var i = 0; i < olLis.length; i++) {
        olLis[i].className = "";
    }
    //留下对应的
    olLis[square].className = "current";
};
timer = setInterval(play, 2000);//自动播放

screen.onmouseover = function () {
    clearInterval(timer);
}
screen.onmouseout = function () {
    timer = setInterval(play, 2000);
}

//4 点击NAV 缓动到对应画面

//for (var l = 0; l < navBtns.length; l++) {
//    // pic=
//    navBtns[l].index = l;
//    navBtns[l].onclick = function () {
//        clearInterval(timer);
//        if(timerId=null){
//                // console.log(timer);
//                timerId = setTimeout(function () {
//                    timer = setInterval(play, 2000);
//                }, 3000);
//            }else {
//                clearTimeout(timerId);
//            }
//
//
//
//
//        //排他
//        //干掉所有人
//
//        for (var l = 0; l < olLis.length; l++) {
//            olLis[l].className = "";
//        }
//        //留下我自己
//        olLis[this.index].className = "current";
//        //以动画的形式把ul移动到指定的位置
//        //目标 和 按钮索引有关 和 图片宽度有关 而且是负数
//        var target = -this.index * imgWidth;
//        animate(ul, {"left": target});
//
//    };
//}


//新闻列表


//所有属性都到达目标值之后才能清理定时器
//封装 能够让 任意对象 的指定属性 变到指定值 的动画函数
function animate(obj, json, fn) {//json {属性名:属性值} {attr:target}
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true;
        for (var k in json) {
            if (k === "opacity") {//特殊处理
                //var leader = parseInt(getStyle(obj, k)) || 0;
                var leader = getStyle(obj, k) * 100;//1
                // 0 || 1 结果是1 那么如果透明度当前的值是0 就会变成1
                //所以这里不能给默认值 而且也没有必要
                //透明度没有单位px 所以也不用parseInt 参与运算自动变为数字
                var target = json[k] * 100;//0.5
                var step = (target - leader) / 10;//0.5-1=-0.5
                step = step > 0 ? Math.ceil(step) : Math.floor(step);//-1
                leader = leader + step;
                //obj.style[k] = leader + "px";
                obj.style[k] = leader / 100;//opacity没有单位
            } else if (k === "zIndex") {
                obj.style.zIndex = json[k];//无需渐变 直接设置即可
            } else {
                var leader = parseInt(getStyle(obj, k)) || 0;
                var target = json[k];
                var step = (target - leader) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                leader = leader + step;
                obj.style[k] = leader + "px";
            }
            if (leader !== target) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(obj.timer);
            if (fn) {//如果有才调用
                fn();//动画执行完成后执行
            }
        }
    }, 15);
}

function getStyle(obj, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(obj, null)[attr];
    } else {
        return obj.currentStyle[attr];
    }
}