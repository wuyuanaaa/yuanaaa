# js 二叉树整理

> 最早接触二叉树是在做 百度前端学院 课程作业的时候，那时接触前端没多久，对基础的数据结构都不是很了解，只是能看的懂，但是无法为自己所用；

> 最近一直在 领扣 上做算法的小题目，涉及到很多二叉树，于是下定决心这个坎必须得跨过去！

---

## 构建二叉排序树

> 根据数组构建二叉排序树：
> - 若左子树不空，则左子树上所有结点的值均小于它的根结点的值；
> - 若右子树不空，则右子树上所有结点的值均大于它的根结点的值；
> - 左、右子树也分别为二叉排序树；

### 一、构造函数

```
function BinaryTree() {
    var Node = function (val) {
        this.val = val;
        this.left = null;
        this.right = null;
    };

    this.root = null;

    var insertNode = function (node, newNode) {
        if (newNode.val < node.val) {   // 如果新节点的值小于当前节点
            if (node.left === null) {
                node.left = newNode;
            } else {   // 如果当前节点的左子树不空，则插入新节点至当前节点的左子树
                insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                insertNode(node.right, newNode);
            }
        }
    };

    this.insert = function (val) {
        // 根据传入的值创建一个新节点
        var newNode = new Node(val);
        if (this.root === null) {   // 如果整棵树的根节点为空，则新节点为根节点
            this.root = newNode;
        } else {    // 否则，添加新节点到根节点
            insertNode(this.root, newNode);
        }
    }
}
```

可以尝试生成一颗二叉排序树

```
var nodes = [8, 3, 10, 58, 4, 6, 1, 18];

var binaryTree = new BinaryTree;

nodes.forEach(key => binaryTree.insert(key));

console.log(binaryTree.root);
```

### 二、二叉排序树的遍历

- __前序遍历（DLR）__：首先访问根结点，然后遍历左子树，最后遍历右子树。简记根-左-右。

```
function preOrder(node, callback) {
    if (node !== null) {
        callback(node.key);
        preOrder(node.left);
        preOrder(node.right);
    }
}
```

- __中序遍历（LDR）__：首先遍历左子树，然后访问根结点，最后遍历右子树。简记左-根-右。

> 可以实现二叉排序树的从小到大排序

```
function inOrder(node, callback) {
    if (node !== null) {
        inOrder(node.left);
        callback(node.key);
        inOrder(node.right);
    }
}
```

- __后序遍历（LRD）__：首先遍历左子树，然后遍历右子树，最后访问根结点。简记左-右-根。

```
function postOrder(node, callback) {
    if (node !== null) {
        postOrder(node.left);
        postOrder(node.right);
        callback(node.key);
    }
}
```

### 三、二叉树的其他方法

> 以下整理自领扣的习题

- __二叉树的最大深度__：每棵树的深度等于左右子树的深度最大值 + 1，递归获得整棵树的最大深度。

```
var maxDepth = function(root) {
    if (root === null) {
        return 0;
    } else {
        let leftDepth = maxDepth(root.left),
            rightDepth = maxDepth(root.right),
            nodeDepth = leftDepth > rightDepth ? leftDepth : rightDepth;

        return 1 + nodeDepth;
    }
};
```

- __翻转二叉树__：将二叉树的每个节点的左右节点互换

```
var invertTree = function(root) {
    if (root !== null) {
        if (root.left !== null || root.right !== null) {
            let o = root.left;
            root.left = root.right;
            root.right = o;
            root.left !== null && invertTree(root.left);
            root.right !== null && invertTree(root.right)
        }
    }
    return root;
};
```

- __合并二叉树__：给定两个二叉树，如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为 NULL 的节点将直接作为新二叉树的节点。

```
var mergeTrees = function(t1, t2) {
    if (t1 !== null && t2 !== null) {
        let result = new TreeNode(t1.val + t2.val);

        result.left = mergeTrees(t1.left, t2.left);
        result.right = mergeTrees(t1.right, t2.right);
        return result;
    } else {
        return t1 === null ? t2 : t1;
    }
}
```

- __二叉搜索树中的搜索__：给定二叉搜索树（BST）的根节点和一个值。 你需要在BST中找到节点值等于给定值的节点。 返回以该节点为根的子树。 如果节点不存在，则返回 NULL。

```
var searchBST = function(root, val) {
    if (root === null) {
        return null;
    }

    let left = searchBST(root.left, val);
    let right = searchBST(root.right, val);
    return left === null && right === null ? (root.val === val ? root : null) : (left === null ? right : left);
};
```

- __平衡二叉树__：给定一个二叉树，判断它是否每个节点的左右两个子树的高度差的绝对值不超过1。

```
var isBalanced = function(root) {
    let flag = getDepth(root);
    function getDepth(node) {
        if (node === null) {
            return 0;
        } else {
            let leftDepth = getDepth(node.left),
                rightDepth = getDepth(node.right);
            if (leftDepth === 'unbalance' || rightDepth === 'unbalance') {
                return 'unbalance';
            }
            let nodeDepth = leftDepth > rightDepth ? leftDepth : rightDepth;
            if (Math.abs(leftDepth - rightDepth) > 1) {
                return 'unbalance';
            }
            return 1 + nodeDepth;
        }
    }
    return flag !== 'unbalance'
};
```

