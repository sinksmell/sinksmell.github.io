---
title: "LeetCode 递归专题"
date: 2020-02-25T12:41:28+08:00
draft: true
---

### 509
> 跳台阶, fib 数列

```go

// 加个备忘录写法
var(
    cnt=make(map[int]int)
)

func numWays(n int) int {
    if res,ok:=cnt[n];ok{
        return res
    }
    if n==0 || n==1  {
        cnt[n]=1
        return cnt[n]
    }

    res:= (numWays(n-1)+numWays(n-2))%1000000007
    cnt[n]=res
    return cnt[n]
}

```

### 16.11 跳水板
> 完全不是考递归...  简单的乘法题

```go
import "sort"

var(
    res =make(map[int]bool)
)

func divingBoard(shorter int, longer int, k int) []int {
        res=make(map[int]bool)
       for i:=0;i<=k;i++{
            v := i* shorter + (k-i) *longer
            res[v]=true
       }
        s:=make([]int,0,len(res))
        for k,_:=range  res{
                if k==0{
                    continue
                }
                s=append(s,k)
        }
        sort.Ints(s)
        return s
}


```