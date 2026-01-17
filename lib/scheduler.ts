// lib/scheduler.ts
type IntervalID = number;

class IntervalScheduler {
  private intervals = new Set<IntervalID>();

  register(fn: () => void, delay: number) {
    const id = window.setInterval(fn, delay);
    this.intervals.add(id);
    return id;
  }

  clear(id: IntervalID) {
    clearInterval(id);
    this.intervals.delete(id);
  }

  clearAll() {
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals.clear();
  }
}

export const scheduler = new IntervalScheduler();
