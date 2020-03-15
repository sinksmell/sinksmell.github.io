---
title: "Concurrency in Go 读书笔记 第二章"
date: 2020-02-05T13:24:47+08:00
draft: false
tags:
    - "concurrency in go"
    - "chapter1"
categories:
    - "读书笔记"
---

## 代码建模: CSP

### 并发与并行

> * 教科书上的定义，并发指的是某一时间段内多个任务同时进行，并行指的是某一时刻，多个任务同时进行
>
> * 本书中的定义很独特 `Concurrency is a property of the code;parallelism is a property of the running program`
>
> > * 1. 编码角度。当你在编写代码时，可以使用多线程或其他方式，使得某些任务可以同时进行。但是，你只编写了并发的代码而不是并行的代码。
> > * 2. 运行角度。假设你的程序编写的两个线程可以同时执行，但是 cpu 是单核的。程序一执行，操作系统中就多了一个进程，该进程中的两个线程，并不能同一时刻执行，他们只能构成并发。如果 CPU 是两核或者是单核两线程，那么该进程中的两个线程，可能被调度到不同的核心上执行，从而构成并行。
> > * 3. 并行与时间。并行性是一个时间的函数，或者说是上下文（context）。举个例子，我们有一个 context，时间是5s,有两个操作待执行，每个操作是 2 s,此时两个任务可以并行执行。如果 context 时间是 1 s,那么两个任务只能是串行。 `context is defined as the bounds by which two or more operations could be considered parallel` , 这里作者就是想通过操作执行时间与时间上下文的关系说明能否实现并行。
> > * 总结，并行是一个动态的概念，并发还是并行，除了程序本身的多线程技术，还要考虑 **runtime**, OS,CPU等的情况。

### Context

> 译作上下文，可指代的内容广泛。
>
> > 一个进程，系统线程，机器等都可以描述为上下文。正如原子操作的定义依赖上下文，并发操作的正确性也依赖上下文。

#### 上下文举例
> 逐渐降低抽象级别
>
> 1. 进程级别。假设你的电脑上有一个计算器的程序，你点击他，程序启动了。此时，你的电脑就是这个计算器进程的上下文。
>
> > ps 根据操作系统的知识，进程有独立性的性质，再启动一个计算器程序，两个进程之间相互独立。
>
> 2. 线程级别。假设该计算器进程能被多个用户同时访问，每个用户开一个线程，此时进程就是线程的上下文。此时就需要考虑，竞态，死锁，活锁，饥饿等问题，因为多个线程共享一个进程的资源，处于同一上下文内。
>
> 3. 函数调用栈级别。此时问题变得异常复杂，但越底层，越复杂，对并发影响越大。还好大部分并发逻辑都是在线程级别编写的。

### 经典并发模型
> * go出现之前，大多数编程语言都是基于线程级别，加上同步内存访问实现的并发
> * 由于频繁创建和释放线程开销较大，出现了线程池的技术

### Go并发模型
> * 使用 goroutine 代替 thread
>
> * 基于 Communicating Seauential Processes 论文 ，实现了 channel + goroutine 的并发模型
>
> > * goroutine 可以看做是协程的一种，也就是用户级线程，运行与于用户态。其他语言中的线程，是系统级线程，线程表维护在系统内核中，使用 ps ，top 之类的工具可以看到的线程。在Linux中会为线程单独分配一个 pid。线程被调度执行时，触发一个中断事件，使 cpu 进入内核态，进行上下文切换，因此也被成为内核级线程。
> >
> > * Channel 类似传统的Linux FIFO,命名管道，可在 goroutine 直接进行通信，并发安全。


### CSP简介
#### 时代背景
> * 1978 Charles Antony Richard Hoare 发表的论文
> * Hoare 建议 input,output 应该作为编程语言的原语，类似P,V原语，特别是在并发操作中

#### Communicating Seauential Processes
> * 字面上的意思就是多个过程之间的通信
> * Process 这里指的是一段逻辑，它需要输入去执行，然后产生输出供其他 process 消费
> * process 可以是进程，线程，也可以是某个函数
> * 为了能在 process 之间进行通信，Hoare 提出了一种channel

#### Hoare 提出的 channel

>cardreader?card image
>
>> From cardreader, read a card and assign its value (an array of characters) to the variable cardimage.
>
> lineprinter!line image
>
>> To lineprinter, send the value of lineimage for printing.
>
> X?(x, y)
>
>> From process named X, input a pair of values and assign them to x and y.
>
> DIV!(3*a+b, 13) 
>
>> To process DIV, output the two specified values.
>
>*[c:character; west?c → east!c]
>
>> Read all the characters output by west, and output them one by one to east. The repetition terminates when the process west terminates.
>
>guarded command
>
>> A guarded command is simply a statement with a left- and righthand side, split by a ->
>>
>> The lefthand side served as a conditional, or guard for the righthand side in that if the lefthand side was false or, in the case of a command, returned false or had exited, the righthand side would never be executed

#### Go Channel 

> * 引入了 channel 概念
> * 将 chennel 的 input/output 作为一种原语

### 通过实例感受并发模型的差异

> 假设你需要编写一个 web server 服务，接收http请求,返回结果

#### 使用传统编程语言

> * 标准库是否自带线程 ,还是要选一个第三方库？
> * 线程数量的限制? 如何找到一个最佳的数量?
> * 在所用的操作系统上，线程的资源开销?
> * 所编写的程序，在操作系统上运行时，如何处理多线程?

以上的问题都很重要，但是与我们要处理的实际问题都没什么关系。

回到问题本身，用户连接我的 web server 时，服务处理用户的请求，返回响应。

#### 使用 Go

> * 直接将上述步骤转换成 go 代码，每个请求，开启一个 goroutine 去处理
> * goroutine是轻量级的，不需要太过关心资源开销
> * 有充足的时间考虑系统中运行了多少 goroutine, 不需要过早地进行优化
> * 充分利用多核CPU进行并行

#### 作者建议

> 如果将 goroutine 比作 thread , channel 比作 mutex , 那么这些不同的抽象对于使用者有什么作用?

> Goroutines free us from having to think about our problem space in terms of parallelism and instead allow us to model problems closer to their natural level of concurrency. Although we went over the difference between concurrency and parallelism, how that difference affects how we model solutions might not be clear. Let’s jump into an example.