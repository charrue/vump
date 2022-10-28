let queued = false;
const queue: ((...args: any[]) => any)[] = [];
const p = Promise.resolve();

const flushJobs = () => {
  queue.forEach((job) => {
    job();
  });

  queue.length = 0;
  queued = false;
};

export const nextTick = (fn?: () => void) => {
  if (fn) {
    return p.then(fn);
  }
  return Promise.resolve();
};

export const queueJob = (job: (...args: any[]) => any) => {
  if (!queue.includes(job)) {
    queue.push(job);
  }

  if (!queued) {
    queued = true;
    nextTick(flushJobs);
  }
};
