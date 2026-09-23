
function createTask(name) {
  let count = 0;
  let status = "idle";
  let lastTime = 0;

  function run() {
    status = "loading";
    render();

    const delay = Math.floor(Math.random() * 1500) + 500;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        count++;
        lastTime = delay;

        const isFail = Math.random() < 0.3; 

        if (isFail) {
          status = "failed";
          render();
          reject(new Error(name + " failed"));
        } else {
          status = "completed";
          render();
          resolve(name + " completed");
        }
      }, delay);
    });
  }

  function getCount() {
    return count;
  }

  function getStatus() {
    return status;
  }

  function reset() {
    count = 0;
    status = "idle";
    lastTime = 0;
    render();
  }

  function render() {
    const el = document.getElementById("task-" + name);
    if (!el) return;
    const statusEl = el.querySelector(".task-status");
    statusEl.textContent = status + (lastTime ? " (" + lastTime + " ms)" : "");
    statusEl.className = "task-status status-" + status;
  }

  return { name, run, getCount, getStatus, reset };
}

const taskNames = ["Load Users", "Load Posts", "Load Comments"];
const tasks = taskNames.map((n) => createTask(n));

const tasksContainer = document.getElementById("tasks");

tasks.forEach((task) => {
  const div = document.createElement("div");
  div.className = "task";
  div.id = "task-" + task.name;
  div.innerHTML =
    '<span class="task-name">' + task.name + '</span>' +
    '<span class="task-status status-idle">idle</span>' +
    '<button>Run</button>';

  const btn = div.querySelector("button");
  btn.addEventListener("click", () => {
    task.run().catch(() => {}); 
  });

  tasksContainer.appendChild(div);
});


document.getElementById("runAllBtn").addEventListener("click", () => {
  document.getElementById("allDoneMsg").textContent = "";

  const promises = tasks.map((task) => task.run());

  Promise.allSettled(promises).then(() => {
    document.getElementById("allDoneMsg").textContent = "All tasks finished";
  });
});

async function runSequential() {
  const start = performance.now();

  for (const task of tasks) {
    await task.run().catch(() => {});
  }

  const time = Math.round(performance.now() - start);
  showTiming("Sequential", time);
}

async function runConcurrent() {
  const start = performance.now();

  const promises = tasks.map((task) => task.run().catch(() => {}));
  await Promise.all(promises);

  const time = Math.round(performance.now() - start);
  showTiming("Concurrent", time);
}

function showTiming(label, time) {
  document.getElementById("timingResult").textContent =
    label + " execution time: " + time + " ms";
}

document.getElementById("sequentialBtn").addEventListener("click", runSequential);
document.getElementById("concurrentBtn").addEventListener("click", runConcurrent);


function eventLoopDemo() {
  console.log("1: start (sync)");

  setTimeout(() => {
    console.log("2: setTimeout 0ms (macrotask)");
  }, 0);

  Promise.resolve().then(() => {
    console.log("3: Promise.then (microtask)");
  });

  setTimeout(() => {
    console.log("4: setTimeout 10ms (macrotask)");
  }, 10);

  asyncFunc();

  console.log("5: end (sync)");
}

async function asyncFunc() {
  console.log("6: Start of an async function (sync, no await yet)");
  await null;
  console.log("7: after await (microtask)");
}

document.getElementById("eventLoopBtn").addEventListener("click", eventLoopDemo);