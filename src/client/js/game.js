function maps(obj) {
    for (var i = 0; i < obj.length; i++) {
        for (var j = 0; j < obj[i].length; j++) {
            var $oLi = $('<li></li>');
            var $oImg = $('<img>');

            var flag = obj[i][j];
            switch (flag) {
                case 0:
                    $oImg.attr('src', 'images/gamebg/q1.png');
                    break;
                case 1:
                    $oImg.attr('src', 'images/gamebg/1.png');
                    break;
                case 2:
                    $oImg.attr('src', 'images/gamebg/3.png');
                    break;
                case 3:
                    $oImg.attr('src', 'images/gamebg/2.png');
                    break;
            }
            $oLi.append($oImg);
            $('#cont ul').append($oLi);

        }
    }
}