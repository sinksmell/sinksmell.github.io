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

### 69. x的平方根

****

**题目描述**

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

**解题思路**

> 根据 n^2 >= x 将 [0,n] 区间分成两部分 [n^2<=x] 和 [n^2>x] ,目标结果在所选性质的左边区间，所以使用模板2



**代码**

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

### 35. 搜索插入位置

****

**题目描述**

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

**解题思路**

> 根据 nums[i]<target 将区间 [0,n]区间分成两部分{i | nums[i]<target} 和 {i | nums[i]>=target},目标值在所选性质的右边区间，选用模板1

**代码**

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



### 34.在排序数组中查找元素的第一个和最后一个位置

****

**题目描述**

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



**解题思路**

> * 选用 nums[i]<target 可以查到模板值出现的第一个位置，分成{i | nums[i]<target} 和 {i | nums[i] >=target}，使用模板1
> * 选用 nums[i]>target 可以查到目标值出现的最后一个位置，分成{i | nums[i]<=target} 和 {i | nums[i] >target}，使用模板2



**代码**

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



### 74. 搜索二维矩阵

****

**题目描述**

>编写一个高效的算法来判断 m x n 矩阵中，是否存在一个目标值。该矩阵具有如下特性：
>
>每行中的整数从左到右按升序排列。
>每行的第一个整数大于前一行的最后一个整数。
>示例 1:
>
>输入:
>matrix = [
>  [1,   3,  5,  7],
>  [10, 11, 16, 20],
>  [23, 30, 34, 50]
>]
>target = 3
>输出: true
>示例 2:
>
>输入:
>matrix = [
>  [1,   3,  5,  7],
>  [10, 11, 16, 20],
>  [23, 30, 34, 50]
>]
>target = 13
>输出: false



**解题思路**

> 将二维矩阵看作是有序的一维数组，转化成简单的二分搜索，使用 < 性质划分，目标在右边，故使用模板1

**代码**

```go
func searchMatrix(matrix [][]int, target int) bool {
    if len(matrix)==0 || len(matrix[0])==0{
        return false
    }
    m,n:=len(matrix),len(matrix[0])
    l,r:=0,m*n-1
    for l<r{
        mid:=(l+r)/2
        x,y:=toXY(mid,n)
        if matrix[x][y]<target{
            l=mid+1
        }else{
            r=mid
        }
    }
    x,y:=toXY(l,n)
    return matrix[x][y]==target
}

// i => [0,m*n-1]
func toXY(i,n int)(x ,y int){
    x= i/n
    y= i%n
    return
}
```



### 153. 寻找旋转排序数组中的最小值

****

**题目描述**

> 假设按照升序排序的数组在预先未知的某个点上进行了旋转。
>
> ( 例如，数组 [0,1,2,4,5,6,7] 可能变为 [4,5,6,7,0,1,2] )。
>
> 请找出其中最小的元素。
>
> 你可以假设数组中不存在重复元素。
>
> 示例 1:
>
> 输入: [3,4,5,1,2]
> 输出: 1
> 示例 2:
>
> 输入: [4,5,6,7,0,1,2]
> 输出: 0

**解题思路**

> * 可以想象成一段上升的线段，从中间截断，然后将左侧的平移到右侧
> * 寻找一个性质，可以将数组分成两部分，这里选择：将数组最后一个元素记为 **last**,根据 > last 分成两部分
> * 目标结果在性质右边，选用模板1

**代码**

```go
func findMin(nums []int) int {
    if len(nums)==0{
        return 0
    }
    l,r:=0,len(nums)-1
    last:=nums[r]
    for l<r{
        mid:=(l+r)/2
        if nums[mid] > last{
            l=mid+1
        }else{
            r=mid
        }
    }
    return nums[l]
}
```



### 33. 搜索旋转排序数组

****

**题目描述**

> 假设按照升序排序的数组在预先未知的某个点上进行了旋转。
>
> ( 例如，数组 [0,1,2,4,5,6,7] 可能变为 [4,5,6,7,0,1,2] )。
>
> 搜索一个给定的目标值，如果数组中存在这个目标值，则返回它的索引，否则返回 -1 。
>
> 你可以假设数组中不存在重复的元素。
>
> 你的算法时间复杂度必须是 O(log n) 级别。
>
> 示例 1:
>
> 输入: nums = [4,5,6,7,0,1,2], target = 0
> 输出: 4
> 示例 2:
>
> 输入: nums = [4,5,6,7,0,1,2], target = 3
> 输出: -1

**解题思路**

> * 寻找旋转点，参考 **leetcode 153**
> * 旋转目标值所在的区间进行二分查找

**代码**

```go
func search(nums []int, target int) int {
    if len(nums)==0{
        return -1
    }
    l,r:=0,len(nums)-1
    p:=spinPoint(nums)
    res:=-1
    if target>=nums[p] && target <=nums[r]{
        res=bsearch(nums,p,r,target)
    }else{
        res=bsearch(nums,l,p-1,target)
    }
    return res
}
// 获取旋转点
func spinPoint(nums []int)int{
    l,r:=0,len(nums)-1
    last:=nums[r]
    for l<r{
        mid:=(l+r)/2
        if nums[mid] > last{
            l=mid+1
        }else{
            r=mid
        }
    }
    return l
}
// 普通二分查找
func bsearch(nums []int,l,r,target int)int{
    if l>r || l<0 || r<0{
        return -1
    }
    for l<r{
        mid:=(l+r)/2
        if nums[mid]<target{
            l=mid+1
        }else{
            r=mid
        }
    }
    if nums[l]!=target{
        return -1
    }
    return l
}
```



### 278. 第一个错误版本

**题目描述**

> 你是产品经理，目前正在带领一个团队开发新的产品。不幸的是，你的产品的最新版本没有通过质量检测。由于每个版本都是基于之前的版本开发的，所以错误的版本之后的所有版本都是错的。
>
> 假设你有 n 个版本 [1, 2, ..., n]，你想找出导致之后所有版本出错的第一个错误的版本。
>
> 你可以通过调用 bool isBadVersion(version) 接口来判断版本号 version 是否在单元测试中出错。实现一个函数来查找第一个错误的版本。你应该尽量减少对调用 API 的次数。
>
> 示例:
>
> 给定 n = 5，并且 version = 4 是第一个错误的版本。
>
> 调用 isBadVersion(3) -> false
> 调用 isBadVersion(5) -> true
> 调用 isBadVersion(4) -> true
>
> 所以，4 是第一个错误的版本。 
>

**解题思路**

> * 按照版本是否错误这一性质划分数组，选用模板1
> * 本题要考察的实际上是 mid=(l+r)/2 会溢出，改写为 mid=l + (r-l)/2 即可

**代码**

```c++
// Forward declaration of isBadVersion API.
bool isBadVersion(int version);

class Solution {
public:
    int firstBadVersion(int n) {
        int l=1,r=n;
        while(l<r){
            int mid=l+(r-l)/2;
            if(!isBadVersion(mid)){
                l=mid+1;
            }else{
                r=mid;
            }
        }
        return l;
    }
};
```



### 162. 寻找峰值

**题目描述**

> 峰值元素是指其值大于左右相邻值的元素。
>
> 给定一个输入数组 nums，其中 nums[i] ≠ nums[i+1]，找到峰值元素并返回其索引。
>
> 数组可能包含多个峰值，在这种情况下，返回任何一个峰值所在位置即可。
>
> 你可以假设 nums[-1] = nums[n] = -∞。
>
> 示例 1:
>
> 输入: nums = [1,2,3,1]
> 输出: 2
> 解释: 3 是峰值元素，你的函数应该返回其索引 2。
> 示例 2:
>
> 输入: nums = [1,2,1,3,5,6,4]
> 输出: 1 或 5 
> 解释: 你的函数可以返回索引 1，其峰值元素为 2；
>      或者返回索引 5， 其峰值元素为 6。
> 说明:
>
> 你的解法应该是 O(logN) 时间复杂度的。
>

**解题思路**

> * 根据 **nums[i-1] < nums[i] < nums[i+1]** ，即递增性质，将数组分成两部分
> * 目标值处于峰值，也就是在该性质的右边，选择模板1
> * 说明: 本题可能有多个峰值，返回其中一个即可 

**代码**

```go
func findPeakElement(nums []int) int {
    if len(nums)==0{
        return -1
    }
    if len(nums)==1{
        return 0
    }
    l,r:=0,len(nums)-1
    for l<r{
        mid:=(l+r)/2
        // nums[i-1] < nums[i] < nums[i+1]  说明还处于递增状态      
        if isGreat(nums,mid,mid-1) && isGreat(nums,mid+1,mid){
            l=mid+1
        }else{
            r=mid
        }

    }
    return l
}

// if nums[i1] > nums[i2] return true else return false
func isGreat(nums []int,i1,i2 int)bool{
    if i2<0{
        return true
    }
    if i1>len(nums)-1{
        return false
    }
    return nums[i1]>nums[i2]
}

```



### 275. H指数

**题目描述**

> 给定一位研究者论文被引用次数的数组（被引用次数是非负整数），数组已经按照升序排列。编写一个方法，计算出研究者的 h 指数。
>
> h 指数的定义: “h 代表“高引用次数”（high citations），一名科研人员的 h 指数是指他（她）的 （N 篇论文中）至多有 h 篇论文分别被引用了至少 h 次。（其余的 N - h 篇论文每篇被引用次数不多于 h 次。）"
>
> 示例:
>
> 输入: citations = [0,1,3,5,6]
> 输出: 3 
> 解释: 给定数组表示研究者总共有 5 篇论文，每篇论文相应的被引用了 0, 1, 3, 5, 6 次。
>      由于研究者有 3 篇论文每篇至少被引用了 3 次，其余两篇论文每篇被引用不多于 3 次，所以她的 h 指数是 3。

**解题思路**

> * 题目花里胡哨地引入了H指数概念，关键还是要找到一个性质划分数组
> * 根据**论文被引用次数<达标篇数**来划分数组，目标值在性质右边，选用模板1
> * Ps: 如果最终的目标被引用次数为0，则返回0

**代码**

```go
func hIndex(citations []int) int {
    if len(citations)==0{
        return 0
    }
    lens:=len(citations)
    l,r:=0,lens-1
    for l<r{
        mid:=(l+r)/2
        if citations[mid] < (lens-mid){
            l=mid+1
        }else{
            r=mid
        }
    }
    if citations[l]!=0{
        return lens-l
    }
    return 0   
}
```

