class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    this.arr = arr;
    this.root = null;
  }

  prepareArray(arr) {
    arr.sort((a, b) => a - b);
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }

  buildTree(fixedArr = this.prepareArray(this.arr)) {
    if (fixedArr.length === 1) {
      return new Node(fixedArr[0]);
    } else if (fixedArr.length === 0) {
      return null;
    }
    const middleIndex = parseInt(fixedArr.length / 2);
    const middle = new Node(fixedArr[middleIndex]);
    if (this.root === null) {
      this.root = middle;
    }
    middle.left = this.buildTree(fixedArr.slice(0, middleIndex));
    middle.right = this.buildTree(fixedArr.slice(middleIndex + 1));
    return middle;
  }

  insert(data) {
    const newNode = new Node(data);
    let currentNode = this.root;
    while (currentNode !== newNode) {
      if (currentNode.data > newNode.data) {
        if (currentNode.left === null) {
          currentNode.left = newNode;
        }
        currentNode = currentNode.left;
      } else if (currentNode.data < newNode.data) {
        if (currentNode.right === null) {
          currentNode.right = newNode;
        }
        currentNode = currentNode.right;
      } else if (currentNode.data === newNode.data) {
        return new Error("Data already exists");
      }
    }
  }

  find(data) {
    let parentNode = null;
    let currentNode = this.root;
    while (currentNode.data !== data) {
      parentNode = currentNode;
      currentNode.data > data
        ? (currentNode = currentNode.left)
        : (currentNode = currentNode.right);
    }
    const parentDirectionLeft = parentNode
      ? parentNode.left === currentNode
      : null;
    return { currentNode, parentNode, parentDirectionLeft };
  }

  delete(data) {
    function deleteFromParent(parentNode, isLeft) {
      isLeft ? (parentNode.left = null) : (parentNode.right = null);
    }

    const nodeInfo = this.find(data);
    if (!nodeInfo.currentNode.right && !nodeInfo.currentNode.left) {
      deleteFromParent(nodeInfo.parentNode, nodeInfo.parentDirectionLeft);
      return;
    }
    if (!nodeInfo.currentNode.right || !nodeInfo.currentNode.left) {
      const child = !nodeInfo.currentNode.right
        ? nodeInfo.currentNode.left
        : nodeInfo.currentNode.right;
      if (nodeInfo.parentDirectionLeft) {
        nodeInfo.parentNode.left = child;
      } else {
        nodeInfo.parentNode.right = child;
      }
      return;
    }
    if (!!nodeInfo.currentNode.right && !!nodeInfo.currentNode.left) {
      let replacingNode = nodeInfo.currentNode.right;
      let replacingNodeParent = nodeInfo.currentNode;
      let toLeft = false;
      while (!!replacingNode.left) {
        replacingNodeParent = replacingNode;
        replacingNode = replacingNode.left;
        toLeft = true;
      }
      deleteFromParent(replacingNodeParent, toLeft);
      if (nodeInfo.currentNode === this.root) {
        replacingNode.left = nodeInfo.currentNode.left;
        replacingNode.right = nodeInfo.currentNode.right;
        this.root = replacingNode;
      } else if (nodeInfo.parentDirectionLeft) {
        nodeInfo.parentNode.left = replacingNode;
        replacingNode.left = nodeInfo.currentNode.left;
        replacingNode.right = nodeInfo.currentNode.right;
      } else {
        nodeInfo.parentNode.right = replacingNode;
        replacingNode.left = nodeInfo.currentNode.left;
        replacingNode.right = nodeInfo.currentNode.right;
      }
    }
  }

  _treeArray = [];

  printTreeArray = (node) => {
    this._treeArray.push(node.data);
  };

  levelOrderIteration(callback = this.printTreeArray, initialNode = this.root) {
    let queue = [initialNode];
    this._treeArray = [];

    while (queue.length !== 0) {
      callback(queue[0]);
      if (queue[0].left) {
        queue.push(queue[0].left);
      }
      if (queue[0].right) {
        queue.push(queue[0].right);
      }
      queue.shift();
    }
    if ((callback = this.printTreeArray)) {
      return this._treeArray;
    }
  }

  inorder(callback = this.printTreeArray, initialNode = this.root) {
    this._treeArray = [];

    function travel(node) {
      callback(node);
      if (node.left) {
        travel(node.left);
      }
      if (node.right) {
        travel(node.right);
      }
    }

    travel(initialNode);

    if ((callback = this.printTreeArray)) {
      return this._treeArray;
    }
  }

  preorder(callback = this.printTreeArray, initialNode = this.root) {
    this._treeArray = [];

    function travel(node) {
      if (node.left) {
        travel(node.left);
      }
      callback(node);
      if (node.right) {
        travel(node.right);
      }
    }

    travel(initialNode);

    if ((callback = this.printTreeArray)) {
      return this._treeArray;
    }
  }

  postorder(callback = this.printTreeArray, initialNode = this.root) {
    this._treeArray = [];

    function travel(node) {
      if (node.left) {
        travel(node.left);
      }
      if (node.right) {
        travel(node.right);
      }
      callback(node);
    }

    travel(initialNode);

    if ((callback = this.printTreeArray)) {
      return this._treeArray;
    }
  }

  depth(node = this.root, level = [this.root]) {
    if (level.includes(node)) {
      return 0;
    }
    let newLevel = [];
    const children = (element) => {
      if (element.left && element.right) {
        return [element.left, element.right];
      } else if (element.left) {
        return [element.left];
      } else if (element.right) {
        return [element.right];
      } else {
        return [];
      }
    };
    level.forEach((element) => newLevel.push(...children(element)));
    return this.depth(node, newLevel) + 1;
  }

  height(node = this.root) {
    if (node === null) {
      return -1;
    }
    const leftHeight = this.height(node.left) + 1;
    const rightHeight = this.height(node.right) + 1;

    return leftHeight > rightHeight ? leftHeight : rightHeight;
  }

  isBalanced(node = this.root) {
    if (node === null) return true;
    const leftNodeBalanced = this.isBalanced(node.left);
    const rightNodeBalanced = this.isBalanced(node.right);
    const differenceOfHeights = Math.abs(
      this.height(node.left) - this.height(node.right)
    );
    if (leftNodeBalanced && rightNodeBalanced && differenceOfHeights <= 1) {
      return true;
    } else {
      return false;
    }
  }

  rebalance() {
    this.arr = this.levelOrderIteration();
    this.root = null;
    this.buildTree();
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "|  " : "  "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "|   "}`, true);
  }
};

function logTree(node) {
  console.log(node.data);
}

const randomArray = (number = 10) => {
  let result = [];
  let i = 0;
  while (i < number) {
    result.push(parseInt(Math.random() * 100));
    i++;
  }
  console.log(result);
  return result;
};
//create tree with random array and print it
const arbol = new Tree(randomArray(20));
prettyPrint(arbol.buildTree());
//check if balanced
console.log(arbol.isBalanced());
//Print data of tree in arrays
console.log(
  arbol.levelOrderIteration() +
    "\r\n" +
    arbol.inorder() +
    "\r\n" +
    arbol.preorder() +
    "\r\n" +
    arbol.postorder() +
    "\r\n"
);
//Add 101 new data to the tree and print it
randomArray(101).forEach((data) => arbol.insert(data));
prettyPrint(arbol.root);
//Check i ftree is balanced
console.log(arbol.isBalanced());
//Rebalance tree and print
arbol.rebalance();
prettyPrint(arbol.root);
//Check if tree is balanced
console.log(arbol.isBalanced());
//Print data of tree in arrays
console.log(
  arbol.levelOrderIteration() +
    "\r\n" +
    arbol.inorder() +
    "\r\n" +
    arbol.preorder() +
    "\r\n" +
    arbol.postorder() +
    "\r\n"
);
