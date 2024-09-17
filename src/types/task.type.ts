export type Task<T = unknown> = {
  resolve: (value?: T) => void;
  reject: (reason?: any) => void;
  fn: () => Promise<T>;
};
