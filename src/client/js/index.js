/*
    输入框聚焦高亮，失焦取消高亮
*/
$('[type="text"],[type="password"]').focus(function () {
    $(this).css('border-color', '#ffeb00');
}).blur(function () {
    $(this).css('border-color', 'transparent')
})

/*
    登录注册切换
*/

$('#sign_on a ,#sign_up a').click(function () {
    $('#sign_on , #sign_up').toggle();
})


/*

*/
var reg = /^.{1,6}$/;
var str = '张三李四王五';
// console.log(str.match(reg));
console.log(str.length)
var userName = $('#sign_up [type="text"]').val();
var userPwd = $('#sign_up [type="password"]').val();

/*
    滑块
*/
if (userName == '') {

}
var sta = 0;
new DragSlide({
    el: document.querySelector('.dragSlide'),
    success: function () {
        console.log('success!!!')
        sta = 1;
    }
})


$('#onbtn').click(function () {
    if (sta || ) {

    }
})