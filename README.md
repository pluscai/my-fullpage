# my-fullpage
单页切屏效果（幻灯片）代码

# 兼容注意事项
W3C并没有对鼠标滚轮事件进行规范，各浏览器厂商封装了不同的实现方法，事件属性也不一样，FireFox用了一个私有实现DOMMouseScroll。其他浏览器都是用mousewheel实现，所以需要做一下兼容处理。
