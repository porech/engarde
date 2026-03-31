import type { PiscinaTask } from '../../task_queue';
import type { PiscinaWorker } from '..';
export type PiscinaLoadBalancer = (task: PiscinaTask, workers: PiscinaWorker[]) => PiscinaWorker | null;
export type LeastBusyBalancerOptions = {
    maximumUsage: number;
};
export declare function LeastBusyBalancer(opts: LeastBusyBalancerOptions): PiscinaLoadBalancer;
