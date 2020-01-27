---
title: "Go语言 Defer Return 执行顺序探究"
draft: false
tags: [ "golang", "go", "defer"]
lastmod: 2020-01-25=7
date: "2019-03-01"
categories:
  - "Go"
  - "Assembler"
---

## Go语言Defer Return 返回值执行顺序探究
![](https://i.loli.net/2019/03/01/5c79001fee417.png)

### defer之间的执行顺序
> go 的 defer 语句是用来`延迟执行函数`的关键字

``` go
package main

import "fmt"

func defers(a int) int {
	defer func() {
		fmt.Println("Defer 1...")
	}()
	defer func() {
		fmt.Println("Defer 2...")
	}()
	fmt.Println("Run defers  ...")
	return a
}

func main() {
	res:= defers(1)
	fmt.Printf("get result: %d\n",res)
}

//运行结果
//Run defers  ...
//Defer 2...
//Defer 1...
//get result: 1

```
> 由此可见 :
>
> > * 多个defer执行顺序为后进先出,可以推测defer将函数压入栈中,待到执行时在依次出栈执行

### 未声明返回值

``` go
package main

import "fmt"

func demo1(a int) ( int) {
	res := a
	defer func() {
		fmt.Println("Defer ...")
		res += 100
	}()
	return res
}

func main() {
	res := demo1(1)
	fmt.Printf("get result: %d\n", res)
}

//运行结果
//Defer ...
//get result: 1

```

#### 声明返回值

``` go
package main

import "fmt"

func demo2(a int) (res int) {
	res = a
	defer func() {
		fmt.Println("Defer ...")
		res += 100
	}()
	return
}

func main() {
	res := demo2(1)
	fmt.Printf("get result: %d\n", res)
}

//运行结果
//Defer ...
//get result: 101

```
**可见是否声明返回值对运行结果有很大的影响!**
> 声明返回值时 defer函数改变了res值,未声明返回值时 defer函数无法改变res值

### 结论
> * 1.return 先给返回值赋值
> 
>> * 已经声明返回值则直接赋值
>> * 未声明返回值则先声明一个匿名返回值再赋值
>
> * 2.调用RET返回指令并传入返回值
> 
>> * RET则会检查defer是否存在，若存在就先逆序插入defer语句
> 
> * 3.RET携带返回值退出函数；

‍‍**因此defer、return、返回值三者的执行顺序应该是：return给返回值赋值-->defer开始执行-->最后RET指令携带返回值退出函数**


查看汇编代码来一探究竟
>  * 将fmt.Println换成 println这个内建函数 
>  * 假设你的源文件名字是main.go
>  * 对声明返回值与未声明返回值版本分别执行以下命令 
> 	

``` shell
GOOS=linux GOARCH=386 go tool compile -S main.go >> main.S
```
> **截取部分汇编代码**
``` x86asm
"".demo1 STEXT size=106 args=0x8 locals=0x10
	0x0000 00000 (defer_topic.go:15)	TEXT	"".demo1(SB), $16-8
	0x0000 00000 (defer_topic.go:15)	MOVL	TLS, CX
	0x0007 00007 (defer_topic.go:15)	MOVL	(CX)(TLS*2), CX
	0x000d 00013 (defer_topic.go:15)	CMPL	SP, 8(CX)
	0x0010 00016 (defer_topic.go:15)	JLS	99
	0x0012 00018 (defer_topic.go:15)	SUBL	$16, SP
	0x0015 00021 (defer_topic.go:15)	FUNCDATA	$0, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
	0x0015 00021 (defer_topic.go:15)	FUNCDATA	$1, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
	0x0015 00021 (defer_topic.go:15)	FUNCDATA	$3, gclocals·9fb7f0986f647f17cb53dda1484e0f7a(SB)
	0x0015 00021 (defer_topic.go:15)	PCDATA	$2, $0
	0x0015 00021 (defer_topic.go:15)	PCDATA	$0, $0
	0x0015 00021 (defer_topic.go:15)	MOVL	$0, "".~r1+24(SP)
	0x001d 00029 (defer_topic.go:16)	MOVL	"".a+20(SP), AX
	0x0021 00033 (defer_topic.go:16)	MOVL	AX, "".res+12(SP)
	0x0025 00037 (defer_topic.go:20)	PCDATA	$2, $1
	0x0025 00037 (defer_topic.go:20)	LEAL	"".res+12(SP), AX
	0x0029 00041 (defer_topic.go:20)	PCDATA	$2, $0
	0x0029 00041 (defer_topic.go:20)	MOVL	AX, 8(SP)
	0x002d 00045 (defer_topic.go:17)	MOVL	$4, (SP)
	0x0034 00052 (defer_topic.go:17)	PCDATA	$2, $1
	0x0034 00052 (defer_topic.go:17)	LEAL	"".demo1.func1·f(SB), AX
	0x003a 00058 (defer_topic.go:17)	PCDATA	$2, $0
	0x003a 00058 (defer_topic.go:17)	MOVL	AX, 4(SP)
	0x003e 00062 (defer_topic.go:17)	CALL	runtime.deferproc(SB)
	0x0043 00067 (defer_topic.go:17)	TESTL	AX, AX
	0x0045 00069 (defer_topic.go:17)	JNE	89
	0x0047 00071 (defer_topic.go:21)	MOVL	"".res+12(SP), AX
	0x004b 00075 (defer_topic.go:21)	MOVL	AX, "".~r1+24(SP)
	0x004f 00079 (defer_topic.go:21)	XCHGL	AX, AX
	0x0050 00080 (defer_topic.go:21)	CALL	runtime.deferreturn(SB)
	0x0055 00085 (defer_topic.go:21)	ADDL	$16, SP
	0x0058 00088 (defer_topic.go:21)	RET
	0x0059 00089 (defer_topic.go:17)	XCHGL	AX, AX
	0x005a 00090 (defer_topic.go:17)	CALL	runtime.deferreturn(SB)
	0x005f 00095 (defer_topic.go:17)	ADDL	$16, SP
	0x0062 00098 (defer_topic.go:17)	RET
```

``` x86asm
"".demo2 STEXT size=98 args=0x8 locals=0xc
	0x0000 00000 (defer_topic.go:24)	TEXT	"".demo2(SB), $12-8
	0x0000 00000 (defer_topic.go:24)	MOVL	TLS, CX
	0x0007 00007 (defer_topic.go:24)	MOVL	(CX)(TLS*2), CX
	0x000d 00013 (defer_topic.go:24)	CMPL	SP, 8(CX)
	0x0010 00016 (defer_topic.go:24)	JLS	91
	0x0012 00018 (defer_topic.go:24)	SUBL	$12, SP
	0x0015 00021 (defer_topic.go:24)	FUNCDATA	$0, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
	0x0015 00021 (defer_topic.go:24)	FUNCDATA	$1, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
	0x0015 00021 (defer_topic.go:24)	FUNCDATA	$3, gclocals·9fb7f0986f647f17cb53dda1484e0f7a(SB)
	0x0015 00021 (defer_topic.go:24)	PCDATA	$2, $0
	0x0015 00021 (defer_topic.go:24)	PCDATA	$0, $0
	0x0015 00021 (defer_topic.go:24)	MOVL	$0, "".res+20(SP)
	0x001d 00029 (defer_topic.go:25)	MOVL	"".a+16(SP), AX
	0x0021 00033 (defer_topic.go:25)	MOVL	AX, "".res+20(SP)
	0x0025 00037 (defer_topic.go:29)	PCDATA	$2, $1
	0x0025 00037 (defer_topic.go:29)	LEAL	"".res+20(SP), AX
	0x0029 00041 (defer_topic.go:29)	PCDATA	$2, $0
	0x0029 00041 (defer_topic.go:29)	MOVL	AX, 8(SP)
	0x002d 00045 (defer_topic.go:26)	MOVL	$4, (SP)
	0x0034 00052 (defer_topic.go:26)	PCDATA	$2, $1
	0x0034 00052 (defer_topic.go:26)	LEAL	"".demo2.func1·f(SB), AX
	0x003a 00058 (defer_topic.go:26)	PCDATA	$2, $0
	0x003a 00058 (defer_topic.go:26)	MOVL	AX, 4(SP)
	0x003e 00062 (defer_topic.go:26)	CALL	runtime.deferproc(SB)
	0x0043 00067 (defer_topic.go:26)	TESTL	AX, AX
	0x0045 00069 (defer_topic.go:26)	JNE	81
	0x0047 00071 (defer_topic.go:30)	XCHGL	AX, AX
	0x0048 00072 (defer_topic.go:30)	CALL	runtime.deferreturn(SB)
	0x004d 00077 (defer_topic.go:30)	ADDL	$12, SP
	0x0050 00080 (defer_topic.go:30)	RET
	0x0051 00081 (defer_topic.go:26)	XCHGL	AX, AX
	0x0052 00082 (defer_topic.go:26)	CALL	runtime.deferreturn(SB)
	0x0057 00087 (defer_topic.go:26)	ADDL	$12, SP
	0x005a 00090 (defer_topic.go:26)	RET
```


