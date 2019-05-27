# seq

这是一个简单的方法链式调用库

# 安装

```js
npm i seq-fns

yarn add seq-fns
```

# 使用

```js
const seq = require('seq')

seq([
  x => x + 1,
  async x => x + 2,
  x => new Promise(resolve => setTimeout(() => resolve(x + 3), 500)),
])
  .run(1)
  .then(result => console.log(result))

// 7 (1 + 1 + 2 + 3)
```

你可以通过 `add` 方法动态增加处理函数

```js
seq.add(x => x + 1)
```

seq 会根据传入函数的顺序依次执行，并且把上一次处理的结果作为下一个函数的参数传入，函数可以是同步的也可以是异步的，最终 `run` 方法都会返回的一个 promise 并返回调用结果

# 错误处理

```js
seq([
  x => x + 1,
  x => {
    throw x
  },
])
  .run(1)
  .catch(err => console.log(err))

// 2
```

任何在执行过程中的报错都可以在返回的`promise`中被捕获，包括：

- 同步 `throw` 的错误
- promise `reject` 的错误
- 异步方法 `throw` 的错误

# roadmap

1. 增加多参数的场景
2. 增加回调形式的异步函数
