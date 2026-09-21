+++
author = "张小橙"
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
date = '{{ .Date }}'
draft = true

# 标签，用来归类文章，示例 tags = ["Hugo","PaperMod"]
tags = []
# 分类，比标签层级更高的归类，示例 categories = ["技术博客"]
categories = []
# 系列文章，多篇文章组成一个系列，不用就删掉这一行
series = []
# 最后修改日期
lastmod = '{{ .Date }}'
# 页面meta描述，用于SEO，搜索引擎展示的简介
description = ""
# 文章摘要，在列表页展示的简短介绍
summary = ""
# 封面图配置
[cover]
image = "images/cover.webp"
alt = "封面图描述"
caption = ""
relative = true

# ========== PaperMod 页面功能开关 ==========
# 是否显示文章目录
showToc = true
# 目录是否默认展开 true=打开，false=折叠
TocOpen = false
# 是否隐藏文章元信息（发布日期、作者、阅读时长）
hidemeta = false
# 评论功能开关，false关闭，需要自己配置评论系统再开启
comments = false
# 关闭HLJS代码高亮，false=开启代码高亮
disableHLJS = false
# 关闭文章底部分享按钮
disableShare = false
# 在文章列表页隐藏摘要
hideSummary = false
# 搜索隐藏：true 本篇文章不会出现在站内搜索结果
searchHidden = false
# 显示阅读预估时长
ShowReadingTime = true
# 面包屑导航（顶部首页 > 文章分类 导航）
ShowBreadCrumbs = true
# 文章底部「上一篇/下一篇」跳转链接
ShowPostNavLinks = true
# 显示文章字数统计
ShowWordCount = true
# 列表页展示RSS订阅按钮
ShowRssButtonInSectionTermList = true
# 使用Hugo原生生成目录，推荐开启，性能更好
UseHugoToc = true
+++

