---
title: "二叉树常见模板"
date: 2020-02-04T15:33:40+08:00
draft: true
tags:
  - "二叉树"
categories:
  - "算法模板"
---

### 二叉树的遍历

#### 先序遍历（递归）

> * 核心思想
>
>   > 若当前节点不为空，先访问当前节点，再递归访问左右子树

#### 先序遍历（非递归）

> * 核心思想
>
>   > 1. 令 p= root
>   > 2. 若 p !=nil ，访问 p，若 p.Right!=nil ，将 p.Right 压入栈中 
>   > 3. 若 p.Left!=nil , 令 p=p.Left 重复2
>   > 4. 若p.Left==nil,重栈中弹出元素，即 p=stack.pop(),重复2,3
>
> * 需要一个辅助栈

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
```

**辅助栈**

```go
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



