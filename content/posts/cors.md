---
title: "跨域问题及解决方法"
draft: false
description: "学习计算机网络知识可以更好地理解应用直接的网络通信"
tags: [ "network", "nginx", "http","cors"]
lastmod: 2020-01-26
date: "2019-10-16"
categories:
  - "Network"
  - "HTTP"
  - "Nginx"
---

### 跨域问题是什么
同源策略
> 同源策略是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSRF等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。

跨域 (cors)
> cross-origin sharing standard:当协议、子域名、主域名、端口号中任意一个不相同时，都算作不同域。不同域之间相互请求资源，就算作“跨域”。例如:
>
> > http://localhost:8080 -> http://localhost:8088

### 为什么出现跨域问题

浏览器拦截
> 跨域并不是没有发出请求，其实请求能发出去，服务端收到请求并正常返回结果，只是结果被浏览器拦截了。浏览器为了阻止用户读取到另一个域名下的内容，拦截了ajax响应。

### 如何解决跨域问题

**开发时**
> 假设后台服务监听localhost:8080,以axios为例

``` js
axios({
  method: 'post',
  url: 'http://localhost:8080/api/login',
  data: {
    Name: 'Fred',
    passWord: 'xxx'
  }
});

```
只需要在后端允许cors
> 以beego为例，虽然不同框架添加形式不一样，但想法都是在后端允许跨域请求

``` go
	beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST","OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type"},
		AllowCredentials: true,
	}))

```
这时再发送ajax请求就可以正常响应了

**部署时**

Nginx 
> Go 是一个独立的 HTTP 服务器，但是我们有些时候为了 nginx 可以帮我做很多工作，例如访问日志，cc 攻击，静态服务等，nginx 已经做的很成熟了，Go 只要专注于业务逻辑和功能就好，所以通过 nginx 配置代理就可以实现多应用同时部署。

![](https://i.loli.net/2019/02/28/5c776da4a011f.png)

* 1.修改Nginx对应的配置文件,添加如下代码实现反向代理

``` js
server {
listen 9090;
server_name localhost;
 ......
  location /api {
            proxy_pass   http://localhost:8080/api;
            add_header Access-Control-Allow-Methods *;
            add_header Access-Control-Max-Age 3600;
            add_header Access-Control-Allow-Credentials true;
            add_header Access-Control-Allow-Origin $http_origin;
            add_header Access-Control-Allow-Headers $http_access_control_request_headers;
            if ($request_method = OPTIONS ) {
                return 200;
            }
        }

}

```
* 2.修改ajax请求地址

``` js
axios({
  method: 'post',
  url: '/api/login',
  data: {
    Name: 'Fred',
    passWord: 'xxx'
  }
});

```
* 3.解释

> 假设前端页面运行在 http://localhost:80,使用ajax异步请求后,根据url会访问 http://localhost:80/api/login  由于设置了Nginx反向代理 Nginx将请求转发给 http://localhost:8080/api/login 来处理。可以简单的理解为,访问当前地址 /api ---> http://localhost:8080/api。请求地址并没有改变,跨域问题也就不存在了。
> 

