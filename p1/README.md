# Async Tasks Demo — README

## How a closure makes the counter private

Inside `createTask(name)`, a variable called `count` is created. It is declared with `let` inside the function, so there is no direct access to it from outside — there is no `task.count`.

The only way to read its value is by calling `task.getCount()`, and the only way to change it is by calling `task.run()`.

The functions `run`, `getCount`, and `reset` "remember" the `count` variable from their outer function. This is called a **closure**.

Each call to `createTask()` creates a new and separate `count` variable, so different tasks have their own counters and do not affect each other.

## How the call stack works (example from the project)

When the **"Run Event Loop Demo"** button is clicked, `eventLoopDemo()` is called and added to the call stack.

Inside it, `console.log(...)`, `setTimeout(...)`, and `.then(...)` are called. Each function call is added to the stack, executed, and then removed from the stack.

When `eventLoopDemo()` reaches the `asyncFunc()` line, this function is also added to the stack. It executes its synchronous code (`console.log("6: ...")`) and then reaches `await`.

At this point, the function pauses and is removed from the stack. The code after `await` will continue later as a **microtask**.

## How JavaScript continues working while waiting for setTimeout

`setTimeout` does not block the call stack. It passes the callback and the delay to the browser's **Web API** (which is outside the JavaScript engine), and the call stack is immediately freed so the rest of the code can continue.

When the delay is over, the Web API puts the callback into the **task queue**. The Event Loop takes it from the queue and puts it into the call stack, but only when the stack is completely empty.

That is why all the other synchronous code can finish before the `setTimeout` callback runs.

## Predicted and actual output of the Event Loop Demo

The predicted order, written in the code in `script.js` before running the demo, is:

```text
1, 6, 5, 3, 7, 2, 4
```

The actual order in the console matches the prediction.

First, all synchronous code runs (`1, 6, 5`). Then all microtasks run in order (`3, 7`). Finally, the macrotasks run according to their timing (`2`, then `4`).

## Difference between a task (macrotask) and a microtask

`setTimeout` creates a **macrotask (task)**, which is added to the task queue.

`Promise.then` and the code after `await` create **microtasks**, which are added to the microtask queue.

When the call stack becomes empty, the Event Loop first processes all available microtasks and only then takes one task from the task queue.

Because of this, microtasks are executed before the next macrotask, even if `setTimeout` has a delay of `0` ms.

## How multiple promises and errors are handled

The **"Run All Tasks"** button starts all three tasks using `Promise.allSettled()`.

Unlike `Promise.all()`, `allSettled()` does not stop when one of the tasks fails. It waits until every promise finishes, whether it is resolved or rejected, and then shows **"All tasks finished"**.

Errors from individual tasks are handled with `.catch()` near each `run()` call. This prevents one failed task from breaking the others and avoids an `Uncaught (in promise)` error in the console.

## Difference between sequential and concurrent execution

With **sequential** execution (`for` + `await`), each task starts only after the previous task has finished. The total time is approximately the sum of the execution times of all tasks.

With **concurrent** execution (`Promise.all` with all `run()` calls started at the same time), all tasks start almost simultaneously. The total time is approximately the time taken by the slowest task, rather than the sum of all tasks.

This can be seen with the **"Run Sequential"** and **"Run Concurrent"** buttons — the concurrent version should finish noticeably faster.
