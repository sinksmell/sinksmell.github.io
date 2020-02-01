---
title: "二分查找模板"
date: 2020-01-31T14:47:21+08:00
draft: false
description: "刷题必备的二分查找go模板"
tags:
    - 二分查找
categories:
    - 算法模板
---

### 核心思想
> * 找出某个性质，根据这个性质，可以将区间划分成两个部分，逐渐缩小搜索区间，直至找到目标元素
> * 若目标值出现在所选性质的右边，则选用模板1，若出现在性质左边，可选用模板2
> * 模板2别忘了加一，mid=(l+r+1)/2 防止出现死循环

### 搜索条件

> 数据有序

###  模板1.

```go
// 将区间 [l,r] 分割成 [l,mid] [mid+1,r]
func bsearch(nums []int)int{
  l,r:=0,len(nums)
  for l<r{
    mid:=(l+r)/2 // 可能会出现整数相加溢出
    if(check(mid)){
      l=mid+1
    }else{
      r=mid
    }
  }
}

// example
// 在有序数组（递增）中寻找目标元素
// 使用 <num 这个性质将区间划分成两个部分
func getNumberIndex(nums []int,num int) int {
    if len(nums)==0{
        return -1
    }
    left,right:=0,len(nums)-1
    for left<right{
        mid:=(left+right)/2
        if nums[mid]<num{
            left =mid+1
        }else{
            right=mid
        }
    }
  	// 此时 left 与 right 已经相等
  if nums[left]==num{
    return left
  }
    return -1
}

```



### 模板二

```go
// 将区间 [l,r] 分割成 [l,mid-1] [mid,r]
func bsearch(nums []int)int{
  l,r:=0,len(nums)
  for l<r{
    mid:=(l+r+1)/2 // +1 是为了防止死循环
    if(check(mid)){
      l=mid
    }else{
      r=mid-1
    }
  }
}

// example
// 在有序数组（递增）中寻找目标元素
// 使用 >num 这个性质将区间划分成两个部分
func getNumberIndex(nums []int,num int) int {
    if len(nums)==0{
        return -1
    }
    left,right:=0,len(nums)-1
    for left<right{
        mid:=(left+right+1)/2
        if nums[mid]>num{
            right =mid-1
        }else{
            left=mid
        }
    }
    if nums[left]!=left{
        return -1
    }
    return left
}
```

