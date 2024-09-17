import { Task } from "../types/task.type.js";

export class ConcurrencyUtility {
  private static readonly MAX_CONCURRENT_TASKS = 2;

  private static tasksQueue: Array<Task<any>> = [];
  private static activeTasksCount = 0;

  static limitConcurrency<T>(fn: () => Promise<T>): Promise<T> {
    const nextTask = () => {
      if (
        ConcurrencyUtility.activeTasksCount <
          ConcurrencyUtility.MAX_CONCURRENT_TASKS &&
        ConcurrencyUtility.tasksQueue.length > 0
      ) {
        ConcurrencyUtility.activeTasksCount++;
        const { resolve, reject, fn } = ConcurrencyUtility.tasksQueue.shift()!; // Use non-null assertion since the queue has items (queue.length > 0)

        fn()
          .then((res) => {
            ConcurrencyUtility.activeTasksCount--;
            resolve(res);
          })
          .catch((err) => {
            ConcurrencyUtility.activeTasksCount--;
            reject(err);
          })
          .finally(() => {
            nextTask(); // Process the next task after the current task is settled
          });
      }
    };

    return new Promise((resolve, reject) => {
      ConcurrencyUtility.tasksQueue.push({ resolve, reject, fn }); // Add task to queue
      nextTask(); // try to process the next task
    });
  }
}
