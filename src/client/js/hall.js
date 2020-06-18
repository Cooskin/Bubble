/*
游戏说明展示隐藏
*/
$('.exp a').click(function () {
    $(this).parent().toggle();
})

$('.expbtn').click(function () {
    $('.exp').toggle();
})