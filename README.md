# iknowsweb

> 舆情web端

## Build Setup

``` bash
#项目启动
npm run dev

# 打包详情
npm run build --report

# 页面布局
页面宽度采用100%方式进行

# 字体适配方案
采用mediaQuery方式进行控制，目前字体依据屏幕分辨率进行分级处理：
1024~1280， 1280~1440，1440~1920， 4k 四级进行匹配
设计稿以1920屏幕作为初始设计尺寸，从1920向下适配，每降一级，字号降2px， 最小字号为12px

# class命名规则
统一进行'-'作为连接符，如silde-container-item

# js书写规范 ES2015
可尽量采用es2015原生语法进行书写处理， 内部方法统一采用_开头，如 _dataDeal()

#



