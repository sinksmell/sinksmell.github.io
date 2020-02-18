---
title: "LeetCode 二叉树专题练习"
date: 2020-02-04T14:07:22+08:00
draft: false
tags:
  - "二叉树"
categories:
  - "LeetCode"
---

### 98.验证二叉搜索树

**题目描述**

> 给定一个二叉树，判断其是否是一个有效的二叉搜索树。
>
> 假设一个二叉搜索树具有如下特征：
>
> 节点的左子树只包含小于当前节点的数。
> 节点的右子树只包含大于当前节点的数。
> 所有左子树和右子树自身必须也是二叉搜索树。
> 示例 1:
>
> 输入:
>     2
>    / \
>   1   3
> 输出: true
> 示例 2:
>
> 输入:
>     5
>    / \
>   1   4
>      / \
>     3   6
> 输出: false
> 解释: 输入为: [5,1,4,null,null,3,6]。
>      根节点的值为 5 ，但是其右子节点值为 4 。

**解题思路**

> * 二叉搜索树的性质： left.val<root.val<right.val
> * 最小情况应该是: 当前根节点满足上面性质，且左右子树的极值也满足
> * 空树也是二叉搜索树

**代码**

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func isValidBST(root *TreeNode) bool {
    if root==nil || root.Left==nil && root.Right==nil{
        return true
    }
    res:=true
    // 检验当前节点左子树的右边是否都小于根节点
    if root.Left!=nil {
        for p:=root.Left;p!=nil;p=p.Right{
            res = res && (p.Val < root.Val)
            if !res{
                return false
            }
        }
    }
    // 检验当前节点右子树的左边是否都小于根节点
    if root.Right!=nil{
        for p:=root.Right;p!=nil;p=p.Left{
            res = res && (p.Val > root.Val)
            if !res{
                return false
            }
        }
    }
    // 走到这里 res 为 true
    return res && isValidBST(root.Left) && isValidBST(root.Right)
}
```

### 101. 对称二叉树

**题目描述**

> 给定一个二叉树，检查它是否是镜像对称的。
>
> 例如，二叉树 [1,2,2,3,4,4,3] 是对称的。
>
>    1
>    / \
>   2   2
>  / \ / \
> 3  4 4  3
> 但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:
>
>    1
>    / \
>   2   2
>    \   \
>    3    3

**解题思路**

> * 镜像对称，说明把这颗树按照镜像对称后的结果与原树相同
> * 可以想象成有两棵树，一个是原树，一个是镜像树，原树的左边对影镜像树的右边。。。

**代码**

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func isSymmetric(root *TreeNode) bool {
    if root==nil {
        return true
    }
    return symFromRoot(root,root)
}

func symFromRoot(root1 ,root2 *TreeNode)bool{
    if root1==nil || root2==nil{
        return root1==nil && root2==nil
    }
  // 对比原树左边与镜像树右边...
    return root1.Val==root2.Val && 
        symFromRoot(root1.Left,root2.Right) && 
        symFromRoot(root1.Right,root2.Left)
}
```

### 144. 二叉树的前序遍历

**题目描述**

> 给定一个二叉树，返回它的 前序 遍历。
>
>  示例:
>
> 输入: [1,null,2,3]  
>    1
>     \
>      2
>     /
>    3 
>
> 输出: [1,2,3]
> 进阶: 递归算法很简单，你可以通过迭代算法完成吗？

**解题思路**

> * 递归, root -> left -> right
> * 非递归

**代码**

> * 递归写法

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
var res []int

func preorderTraversal(root *TreeNode) []int {
    res=make([]int,0)
    return preTraversal(root)
}

func preTraversal(root *TreeNode) []int {
    if root!=nil{
        visit(root)
        preTraversal(root.Left)
        preTraversal(root.Right)
    }
    return res
}

func visit(root *TreeNode){
    res=append(res,root.Val)
}
```



> * 非递归写法

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
var res []int
func preorderTraversal(root *TreeNode) []int {
    res=make([]int,0)
    return preTraversal(root)
}

func preTraversal(root *TreeNode) []int {
    stk:=NewStack()
    for p:=root;p!=nil;{
        visit(p)
        if p.Right!=nil{
            stk.Push(p.Right)
        }
        p=p.Left
        if p==nil && !stk.Empty(){
            p=stk.Pop().(*TreeNode)
        }
    }
    return res
}

func visit(root *TreeNode){
    res=append(res,root.Val)
}

type  Stack  struct{
    data [] interface{}
    top int
}

func NewStack()*Stack{
    return &Stack{
        data: []interface{}{},
        top:-1,
    }
}

func(s *Stack)Empty()bool{
    return s.top==-1
}

func(s *Stack)Size()int{
    return s.top+1
}

func (s *Stack) Push(elem interface{}) {
    s.top++
    lens := len(s.data)
    if s.top > lens-1 {
        newd := make([]interface{}, lens*2+1)
        copy(newd, s.data)
        s.data=newd
    }
    s.data[s.top] = elem
}

func (s *Stack)Pop()interface{}{
    if s.top!=-1 {
        res := s.data[s.top]
        s.top--
        return res
    }
    panic(s.top)
}

```



### 105. 从先序序列和中序序列重建二叉树

**题目描述**

> 根据一棵树的前序遍历与中序遍历构造二叉树。
>
> 注意:
> 你可以假设树中没有重复的元素。
>
> 例如，给出
>
> 前序遍历 preorder = [3,9,20,15,7]
> 中序遍历 inorder = [9,3,15,20,7]
> 返回如下的二叉树：
>
>    3
>    / \
>   9  20
>     /  \
>    15   7

**解题思路**

> * 手工模拟思想, 先序是 root,left,right  中序是 left,root,right
> * 1. 若序列不为空，根据先序序列，找到根节点，然后根据中序序列确定左右子树所在的两个子序列
>   2. 获取到正取的区间（子序列）后，重复1

**代码**

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func buildTree(preorder []int, inorder []int) *TreeNode {
    lens:=len(preorder)
    if lens==0{
        return nil
    }
    return build(preorder,inorder,0,lens-1,0,lens-1)
}

func build(preorder,inorder []int,pl,pr,il,ir int)*TreeNode{
    if pl>pr || il>ir{
        return nil
    }
    root:=&TreeNode{}
    root.Val=preorder[pl]
    i:=index(inorder,root.Val)
    llen:=i-il // 左子树节点数量
      // 先序 [pl+1,pl+llen] 和 [pl+llen+1,pr]
      // 中序 [il,i-1] 和 [i+1,ir]
    root.Left=build(preorder,inorder,pl+1,pl+llen,il,i-1)
    root.Right=build(preorder,inorder,pl+llen+1,pr,i+1,ir)
    return root
}


func index(nums []int,elem int)int{
    for i:=0;i<len(nums);i++{
        if nums[i]==elem{
            return i
        }
    }
    return -1
}
```

