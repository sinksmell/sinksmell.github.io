---
title: "LeetCode 二分查找专项练习"
date: 2020-02-01T14:11:35+08:00
draft: false
tags:
    - 二分查找
    - 专项练习
categories:
    - LeetCode
---

### LeetCode.69. x的平方根

*题目描述*

> 实现 int sqrt(int x) 函数。
>
> 计算并返回 x 的平方根，其中 x 是非负整数。
>
> 由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。
>
> 示例 1:
>
> 输入: 4
> 输出: 2
> 示例 2:
>
> 输入: 8
> 输出: 2
> 说明: 8 的平方根是 2.82842..., 
>      由于返回类型是整数，小数部分将被舍去。

*解题思路*

> 根据 n^2 >= x 将 [0,n] 区间分成两部分 [n^2<=x] 和 [n^2>x] ,目标结果在所选性质的左边区间，所以使用模板2



*代码*

```go
func mySqrt(x int) int {
    l,r:=0,x
    for l<r {
        mid:=(l+r+1)/2
        if mid*mid >x{
            r=mid-1
        }else{
            l=mid
        }
    }
    return l
}
```

### LeetCode.35. 搜索插入位置

*题目描述*

> 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
>
> 你可以假设数组中无重复元素。
>
> 示例 1:
>
> 输入: [1,3,5,6], 5
> 输出: 2
> 示例 2:
>
> 输入: [1,3,5,6], 2
> 输出: 1
> 示例 3:
>
> 输入: [1,3,5,6], 7
> 输出: 4
> 示例 4:
>
> 输入: [1,3,5,6], 0
> 输出: 0

*解题思路*

> 根据 nums[i]<target 将区间 [0,n]区间分成两部分{i | nums[i]<target} 和 {i | nums[i]>=target},目标值在所选性质的右边区间，选用模板1

*代码*

```go
func searchInsert(nums []int, target int) int {
  // r 为最后一个能选到的位置
    l,r:=0,len(nums)
    for l<r{
        mid:=(l+r)/2
        if nums[mid]<target{
            l=mid+1
        }else{
            r=mid
        }
    }
    return l
}
```



### LeetCode.34.在排序数组中查找元素的第一个和最后一个位置

*题目描述*

> 给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。
>
> 你的算法时间复杂度必须是 O(log n) 级别。
>
> 如果数组中不存在目标值，返回 [-1, -1]。
>
> 示例 1:
>
> 输入: nums = [5,7,7,8,8,10], target = 8
> 输出: [3,4]
> 示例 2:
>
> 输入: nums = [5,7,7,8,8,10], target = 6
> 输出: [-1,-1]



*解题思路*

> * 选用 nums[i]<target 可以查到模板值出现的第一个位置，分成{i | nums[i]<target} 和 {i | nums[i] >=target}，使用模板1
> * 选用 nums[i]>target 可以查到目标值出现的最后一个位置，分成{i | nums[i]<=target} 和 {i | nums[i] >target}，使用模板2



*代码*

```go
func searchRange(nums []int, target int) []int {
    res:=make([]int,2)
    res[0]=-1
    res[1]=-1
  // 数据为空，可以返回了
    if len(nums)==0{
        return res
    }
    l,r:=0,len(nums)-1
    mid:=0
    for l<r{
        mid=(l+r)/2
        if nums[mid]<target{
            l=mid+1
        }else{
            r=mid
        }
    }
  // 没找到第一次出现的位置，说明该数字没出现过，可以返回了
    if nums[l]!=target{
        return res
    }
    res[0]=l
    l,r=0,len(nums)-1
    for l<r{
        mid=(l+r+1)/2
        if nums[mid]>target{
            r=mid-1
        }else{
            l=mid
        }
    }
    res[1]=l
    return res
}
```



### LeetCode.74. 搜索二维矩阵

