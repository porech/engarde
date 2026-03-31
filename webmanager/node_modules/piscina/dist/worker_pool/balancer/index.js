"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeastBusyBalancer = LeastBusyBalancer;
function LeastBusyBalancer(opts) {
    const { maximumUsage } = opts;
    return (task, workers) => {
        let candidate = null;
        let checkpoint = maximumUsage;
        for (const worker of workers) {
            if (worker.currentUsage === 0) {
                candidate = worker;
                break;
            }
            if (worker.isRunningAbortableTask)
                continue;
            if (!task.isAbortable &&
                (worker.currentUsage < checkpoint)) {
                candidate = worker;
                checkpoint = worker.currentUsage;
            }
        }
        return candidate;
    };
}
//# sourceMappingURL=index.js.map