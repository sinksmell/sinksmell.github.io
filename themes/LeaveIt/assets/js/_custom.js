// ==============================
// Custom JavaScript
// ==============================
// 顶部阅读进度条

$(document).ready(function () {
    // 导航条
    $(window).scroll(function () {
        $('.top-scroll-bar').attr(
            'style',
            'width: ' + ($(this).scrollTop() / ($(document).height() - $(this).height())) * 100 + '%; display: block;'
        );
    });

    // live2d
    loadlive2d("live2d", "/live2d/model/tia/model.json");
});
