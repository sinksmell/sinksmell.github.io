---
title: "Concurrency in Go 读书笔记 第一章"
date: 2020-02-01T16:42:30+08:00
draft: false
tags:
    - "concurrency in go"
    - "chapter1"
categories:
    - "读书笔记"
---

## 并发简介

### Race Conditions 竞态

**出现条件**

> 两个及以上的操作必须按照正确地顺序执行，但程序未对执行顺序进行保证，将会出现 *race condition*

**示例代码**

```go
package main

import "fmt"

func main(){
	var data int
	go func() {
		data ++
	}()
	if data==0{
		fmt.Printf("the value is %v\n",data)
	}
}

```

**结果预测**

> * 没有内容输出，data 在 if 判断之前被改变
> * the value is 0 data 在打印数据之前被该变
> * the value is 1 data在 if 判断之后，打印数据之前被改变 

**竞态检测**

```shell
sun@sundeMacBook-Pro [16:57:47] [~/VSCode/sinksmell/notes/ch01] 
-> % go build -race race1.go 
sun@sundeMacBook-Pro [16:57:58] [~/VSCode/sinksmell/notes/ch01] 
-> % ls           
race1    race1.go
sun@sundeMacBook-Pro [16:58:03] [~/VSCode/sinksmell/notes/ch01] 
-> % ./race1            
the value is 0
==================
WARNING: DATA RACE
Write at 0x00c0000b8008 by goroutine 7:
  main.main.func1()
      /Users/sun/VSCode/sinksmell/notes/ch01/race1.go:8 +0x4e

Previous read at 0x00c0000b8008 by main goroutine:
  main.main()
      /Users/sun/VSCode/sinksmell/notes/ch01/race1.go:10 +0x88

Goroutine 7 (running) created at:
  main.main()
      /Users/sun/VSCode/sinksmell/notes/ch01/race1.go:7 +0x7a
==================
Found 1 data race(s)

// 从上面输出可以看到，data 值在改变前就被 main goroutine 读了
```



**临界资源**

> 可以被被多个进程/线程共享的资源，例如全局变量，共享内存，文件等

**临界区**

> 并不是某个区域，而是访问临界资源的一段代码



**解决竞态，类似操作系统里管理临界区，保证某一时刻，只有一个进程/线程能进入临界区访问临界资源**

> 可对临界资源进行加锁，解决上面例子中的问题

**尝试解除竞态**

> 👇的代码实际上仍然未明确规定哪个goroutine先访问data,只是对临界区加以管理

```go
package main

import (
	"fmt"
	"sync"
)

func main(){
	var data int
	var mutex sync.Mutex
	go func() {
		mutex.Lock()
		defer mutex.Unlock()
		data ++
	}()
	mutex.Lock()
	defer mutex.Unlock()
	if data==0{
		fmt.Printf("the value is %v\n",data)
	}
}

```

**再次检测**

```shell
sun@sundeMacBook-Pro [17:20:11] [~/VSCode/sinksmell/notes/ch01] 
-> % go build -race race1.go
sun@sundeMacBook-Pro [17:21:10] [~/VSCode/sinksmell/notes/ch01] 
-> % ./race1
the value is 0
```



### Atomicity 原子性

**原子性**

> 在某个上下文环境中，一个操作满足不可分割不可打断，就认为这个操作具有原子性
>
> > * 上下文的重要性，可以认为是作用域，例如在进程中的原子操作，放到操作系统层面来看，可能就不是原子操作。

**直觉中的原子操作**

```go
i++
```

> 这条语句看起来是一个原子操作，实际上从指令执行角度它分为3步，虽然每一步都是原子操作，但是组合起来就不是了
>
> * 取出i的值
> * 把i的值加一
> * 存储i的值 

**原子性有何意义?**

> 如果一个操作的原子性得到了保证，那么可以认为这个操作是**并发安全**的



### Memory Access Synchronization

> 实际上就是操作系统中对临界区的管理，可参考线程之间的同步与互斥



### Deadlocks,Livelocks,and Starvation

#### Deadlock 死锁

> 所有的工作进程/线程都在等待其他的线程释放资源
>
> 死锁必要条件
>
> **描述1**：
>
> * 资源独占性
> * 资源不可剥夺
> * 互斥
> * 相互等待
>
> **原文描述**
>
> * Mutual Exclusion
>
> >  Mutual Exclusion A concurrent process holds exclusive rights to a resource at any one time.
>
> * Wait For Condition
>
> > A concurrent process must simultaneously hold a resource and be waiting for an additional resource.
>
> * No Preemption
>
> >  A resource held by a concurrent process can only be released by that process, so it fulfills this condition.
>
> * Circular Wait
>
> > A concurrent process (P1) must be waiting on a chain of other concurrent processes (P2), which are in turn waiting on it (P1), so it fulfills this final condition too.

**示例代码**

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

type  value  struct{
    mu sync.Mutex
    value int
}

func main(){
	var wg sync.WaitGroup
	printSum:= func(v1,v2 *value) {
		defer wg.Done()
		v1.mu.Lock()
		defer v1.mu.Unlock()

		time.Sleep(time.Second*2)
		v2.mu.Lock()
		defer v2.mu.Unlock()
		fmt.Printf("sum=%v\n",v1.value+v2.value)
	}

	var a,b value
	wg.Add(2)
	go printSum(&a,&b)
	go printSum(&b,&a)
	wg.Wait()

}

```

**运行结果**

```shell
-> % ./deadlock 
fatal error: all goroutines are asleep - deadlock!

goroutine 1 [semacquire]:
sync.runtime_Semacquire(0xc0000180c8)
        /usr/local/Cellar/go/1.13/libexec/src/runtime/sema.go:56 +0x42
sync.(*WaitGroup).Wait(0xc0000180c0)
        /usr/local/Cellar/go/1.13/libexec/src/sync/waitgroup.go:130 +0x64
main.main()
        /Users/sun/VSCode/sinksmell/notes/ch01/deadlock.go:31 +0x122

goroutine 5 [semacquire]:
sync.runtime_SemacquireMutex(0xc0000180e4, 0x1051300, 0x1)
        /usr/local/Cellar/go/1.13/libexec/src/runtime/sema.go:71 +0x47
sync.(*Mutex).lockSlow(0xc0000180e0)
        /usr/local/Cellar/go/1.13/libexec/src/sync/mutex.go:138 +0xfc
sync.(*Mutex).Lock(...)
        /usr/local/Cellar/go/1.13/libexec/src/sync/mutex.go:81
main.main.func1(0xc0000180d0, 0xc0000180e0)
        /Users/sun/VSCode/sinksmell/notes/ch01/deadlock.go:22 +0x1f4
created by main.main
        /Users/sun/VSCode/sinksmell/notes/ch01/deadlock.go:29 +0xea

goroutine 6 [semacquire]:
sync.runtime_SemacquireMutex(0xc0000180d4, 0x1300, 0x1)
        /usr/local/Cellar/go/1.13/libexec/src/runtime/sema.go:71 +0x47
sync.(*Mutex).lockSlow(0xc0000180d0)
        /usr/local/Cellar/go/1.13/libexec/src/sync/mutex.go:138 +0xfc
sync.(*Mutex).Lock(...)
        /usr/local/Cellar/go/1.13/libexec/src/sync/mutex.go:81
main.main.func1(0xc0000180e0, 0xc0000180d0)
        /Users/sun/VSCode/sinksmell/notes/ch01/deadlock.go:22 +0x1f4
created by main.main
        /Users/sun/VSCode/sinksmell/notes/ch01/deadlock.go:30 +0x114

```



**分析**

> * Main,printSum(&a,&b),printSum(&b,&a) 三个goroutine
> * Main等待两个printSum简记为A，B的返回
> * 现在有两个资源 a,b , A 占用了a, B 占用了b  **独占**
> * A请求资源b, B请求资源a，都不成功，陷入等待状态  **互斥，相互等待**
> * 又有**资源不可剥夺**，于是死锁出现

![image-20200201193204237.png](https://i.loli.net/2020/02/03/LSmNUEJQ4FH6apA.png)



#### Livelock 活锁

> * 活锁是指并发操作在正常地进行，但是并没有使程序的状态向前推进
>
>   > 举个例子，你走在一条狭窄路上，这条路可以允许两个人同时通过。迎面走来一个人，你向左边走，给他让路，他向右边走(你的左边)给你让路，然后你意识到了这样没办法通过，于是你向右边走，他又向左边走(你的右边)，如此反复，谁都不能通过。

**代码示例**

```go
package main

import (
	"bytes"
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

var (
	// 控制两个人的行走步调
	cadence = sync.NewCond(&sync.Mutex{})
	left    int32 // 1表示向左走,注意此处的方向为相对于第一个人的方向
	right   int32 // 1 表示向右走
)

func main() {

	go func() {
		for range time.Tick(time.Millisecond) {
			cadence.Broadcast()
		}
	}()
	var peoples sync.WaitGroup
	peoples.Add(2)
	go walk(&peoples, "Alice")
	go walk(&peoples, "David")

	peoples.Wait()
}

// 模拟两个行人
func walk(wg *sync.WaitGroup, name string) {
	var out bytes.Buffer
	defer wg.Done()
	defer func() {
		fmt.Println(out.String())
	}()
	fmt.Fprintf(&out, "%v is trying to scoot:", name)
	// 设置转向次数为5
	for i := 0; i < 5; i++ {
		if tryLeft(&out) || tryRight(&out) {
			return
		}
	}
	fmt.Fprintf(&out, "\n %v give up!", name)
}

// 尝试向左走
func tryLeft(out *bytes.Buffer) bool {
	return tryDirection("left", &left, out)
}

// 尝试向右走
func tryRight(out *bytes.Buffer) bool {
	return tryDirection("right", &right, out)
}

// 模拟行走,两个人步调要一致
func takeStep() {
	cadence.L.Lock()
	cadence.Wait()
	cadence.L.Unlock()
}

// 尝试向某个方向移动
func tryDirection(dirName string, dir *int32, out *bytes.Buffer) bool {
	fmt.Fprintf(out, " %v", dirName)
	atomic.AddInt32(dir, 1)
	takeStep()
	if atomic.LoadInt32(dir) == 1 {
		fmt.Fprintf(out, ". Success!")
		return true
	}
	takeStep()
	atomic.AddInt32(dir, -1)
	return false
}

```

**运行结果**

```shell
Alice is trying to scoot: left right left right left right left right left right
 Alice give up!
David is trying to scoot: left right left right left right left right left right
 David give up!
```



**拓展**

> * **程序正常工作也有可能出现活锁现象**
> * **活锁**是饥饿现象的一个子集



#### Starvation 饥饿

> * 如果并发的线程/进程不能获取它所需的所有资源，就认为出现了饥饿
> * 饥饿通常意味着，一个或多个的线程/进程阻碍其他线程/进程高效地工作

**代码示例**

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	var wg sync.WaitGroup
	var shardLock sync.Mutex
	const runtime = time.Second

	greedyWorker := func() {
		defer wg.Done()
		var count int
    // 贪婪的工作者，在整个工作时间内都持有锁
		for begin := time.Now(); time.Since(begin) <= runtime; {
			shardLock.Lock()
			time.Sleep(3 * time.Nanosecond)
			shardLock.Unlock()
			count++
		}
		fmt.Printf("Greedy worker was able to execute %v work loops\n", count)
	}

	politeWorker := func() {
		defer wg.Done()
		var count int
    // 礼貌的工作者，在需要的时候获取锁
		for begin := time.Now(); time.Since(begin) <= runtime; {
			shardLock.Lock()
			time.Sleep(1 * time.Nanosecond)
			shardLock.Unlock()

			shardLock.Lock()
			time.Sleep(1 * time.Nanosecond)
			shardLock.Unlock()

			shardLock.Lock()
			time.Sleep(1 * time.Nanosecond)
			shardLock.Unlock()

			count++
		}
		fmt.Printf("Polite worker was able to execute %v work loops\n", count)
	}

	wg.Add(2)
	go greedyWorker()
	go politeWorker()

	wg.Wait()
}

```

**运行结果**

```shell
Greedy worker was able to execute 657044 work loops
Polite worker was able to execute 369205 work loops
```

**结果分析**

> * 贪婪的工作者与礼貌的工作者虽然工作时间相同，但是前者的工作量几乎达到了后者的两倍
> * 贪婪工作者将锁的控制拓展到了临界区的外面
> * 并不是贪婪工作者的算法更高效，而是通过饥饿了其他工作者来提高了工作效率

**拓展**

> * 为了避免饥饿其他工作线程，应该只锁定临界区
> * 如果出现了同步的性能问题再考虑拓展范围

### Determining Concurrency Safety 确定并发安全

> * 编写函数时，要确定一个函数的并发安全性
> * 大意就是通过函数的原型，注释来说明某个函数是否适用并发场景