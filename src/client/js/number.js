function name(cont, obj, that) {
    if (cont == '') {
        obj.html('昵称不能为空');
    } else if (cont.match(Space) == null) {
        obj.html('不能输入空格');
    } else if (cont.length > 6) {
        obj.html('昵称不能超过六个字符');
    } else {
        obj.html('');
        that.css('border-color', '#11f111');
    }
}

function pwd(cont, obj, that) {
    if (cont == '') {
        obj.html('密码不能为空');
    } else if (cont.match(Space) == null) {
        obj.html('不能输入空格');
    } else if (cont.length < 3 || cont.length > 6) {
        obj.html('任意字母或数字3-6字符');
    } else {
        obj.html('');
        that.css('border-color', '#11f111');
    }
}