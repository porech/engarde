"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThresholdSeverity = exports.BYTES_IN_KILOBYTE = exports.BudgetType = void 0;
exports.calculateThresholds = calculateThresholds;
exports.checkBudgets = checkBudgets;
exports.checkThresholds = checkThresholds;
const schema_1 = require("../builders/application/schema");
Object.defineProperty(exports, "BudgetType", { enumerable: true, get: function () { return schema_1.Type; } });
const format_bytes_1 = require("./format-bytes");
exports.BYTES_IN_KILOBYTE = 1000;
var ThresholdType;
(function (ThresholdType) {
    ThresholdType["Max"] = "maximum";
    ThresholdType["Min"] = "minimum";
})(ThresholdType || (ThresholdType = {}));
var ThresholdSeverity;
(function (ThresholdSeverity) {
    ThresholdSeverity["Warning"] = "warning";
    ThresholdSeverity["Error"] = "error";
})(ThresholdSeverity || (exports.ThresholdSeverity = ThresholdSeverity = {}));
function* calculateThresholds(budget) {
    if (budget.maximumWarning) {
        yield {
            limit: calculateBytes(budget.maximumWarning, budget.baseline, 1),
            type: ThresholdType.Max,
            severity: ThresholdSeverity.Warning,
        };
    }
    if (budget.maximumError) {
        yield {
            limit: calculateBytes(budget.maximumError, budget.baseline, 1),
            type: ThresholdType.Max,
            severity: ThresholdSeverity.Error,
        };
    }
    if (budget.minimumWarning) {
        yield {
            limit: calculateBytes(budget.minimumWarning, budget.baseline, -1),
            type: ThresholdType.Min,
            severity: ThresholdSeverity.Warning,
        };
    }
    if (budget.minimumError) {
        yield {
            limit: calculateBytes(budget.minimumError, budget.baseline, -1),
            type: ThresholdType.Min,
            severity: ThresholdSeverity.Error,
        };
    }
    if (budget.warning) {
        yield {
            limit: calculateBytes(budget.warning, budget.baseline, -1),
            type: ThresholdType.Min,
            severity: ThresholdSeverity.Warning,
        };
        yield {
            limit: calculateBytes(budget.warning, budget.baseline, 1),
            type: ThresholdType.Max,
            severity: ThresholdSeverity.Warning,
        };
    }
    if (budget.error) {
        yield {
            limit: calculateBytes(budget.error, budget.baseline, -1),
            type: ThresholdType.Min,
            severity: ThresholdSeverity.Error,
        };
        yield {
            limit: calculateBytes(budget.error, budget.baseline, 1),
            type: ThresholdType.Max,
            severity: ThresholdSeverity.Error,
        };
    }
}
/**
 * Calculates the sizes for bundles in the budget type provided.
 */
function calculateSizes(budget, stats) {
    const calculatorMap = {
        all: AllCalculator,
        allScript: AllScriptCalculator,
        any: AnyCalculator,
        anyScript: AnyScriptCalculator,
        anyComponentStyle: AnyComponentStyleCalculator,
        bundle: BundleCalculator,
        initial: InitialCalculator,
    };
    const ctor = calculatorMap[budget.type];
    const { chunks, assets } = stats;
    if (!chunks) {
        throw new Error('Webpack stats output did not include chunk information.');
    }
    if (!assets) {
        throw new Error('Webpack stats output did not include asset information.');
    }
    const calculator = new ctor(budget, chunks, assets);
    return calculator.calculate();
}
class Calculator {
    budget;
    chunks;
    assets;
    constructor(budget, chunks, assets) {
        this.budget = budget;
        this.chunks = chunks;
        this.assets = assets;
    }
    /** Calculates the size of the given chunk for the provided build type. */
    calculateChunkSize(chunk) {
        // No differential builds, get the chunk size by summing its assets.
        if (!chunk.files) {
            return 0;
        }
        return chunk.files
            .filter((file) => !file.endsWith('.map'))
            .map((file) => {
            const asset = this.assets.find((asset) => asset.name === file);
            if (!asset) {
                throw new Error(`Could not find asset for file: ${file}`);
            }
            return asset.size;
        })
            .reduce((l, r) => l + r, 0);
    }
    getAssetSize(asset) {
        return asset.size;
    }
}
/**
 * A named bundle.
 */
class BundleCalculator extends Calculator {
    calculate() {
        const budgetName = this.budget.name;
        if (!budgetName) {
            return [];
        }
        const size = this.chunks
            .filter((chunk) => chunk?.names?.includes(budgetName))
            .map((chunk) => this.calculateChunkSize(chunk))
            .reduce((l, r) => l + r, 0);
        return [{ size, label: this.budget.name }];
    }
}
/**
 * The sum of all initial chunks (marked as initial).
 */
class InitialCalculator extends Calculator {
    calculate() {
        return [
            {
                label: `bundle initial`,
                size: this.chunks
                    .filter((chunk) => chunk.initial)
                    .map((chunk) => this.calculateChunkSize(chunk))
                    .reduce((l, r) => l + r, 0),
            },
        ];
    }
}
/**
 * The sum of all the scripts portions.
 */
class AllScriptCalculator extends Calculator {
    calculate() {
        const size = this.assets
            .filter((asset) => asset.name.endsWith('.js'))
            .map((asset) => this.getAssetSize(asset))
            .reduce((total, size) => total + size, 0);
        return [{ size, label: 'total scripts' }];
    }
}
/**
 * All scripts and assets added together.
 */
class AllCalculator extends Calculator {
    calculate() {
        const size = this.assets
            .filter((asset) => !asset.name.endsWith('.map') && !asset.componentStyle)
            .map((asset) => this.getAssetSize(asset))
            .reduce((total, size) => total + size, 0);
        return [{ size, label: 'total' }];
    }
}
/**
 * Any script, individually.
 */
class AnyScriptCalculator extends Calculator {
    calculate() {
        return this.assets
            .filter((asset) => asset.name.endsWith('.js'))
            .map((asset) => ({
            size: this.getAssetSize(asset),
            label: asset.name,
        }));
    }
}
/**
 * Any script or asset (images, css, etc).
 */
class AnyCalculator extends Calculator {
    calculate() {
        return this.assets
            .filter((asset) => !asset.name.endsWith('.map') && !asset.componentStyle)
            .map((asset) => ({
            size: this.getAssetSize(asset),
            label: asset.name,
        }));
    }
}
/**
 * Any compoonent stylesheet
 */
class AnyComponentStyleCalculator extends Calculator {
    calculate() {
        return this.assets
            .filter((asset) => asset.componentStyle)
            .map((asset) => ({
            size: this.getAssetSize(asset),
            label: asset.name,
        }));
    }
}
/**
 * Calculate the bytes given a string value.
 */
function calculateBytes(input, baseline, factor = 1) {
    const matches = input.trim().match(/^(\d+(?:\.\d+)?)[ \t]*(%|[kmg]?b)?$/i);
    if (!matches) {
        return NaN;
    }
    const baselineBytes = (baseline && calculateBytes(baseline)) || 0;
    let value = Number(matches[1]);
    switch (matches[2] && matches[2].toLowerCase()) {
        case '%':
            value = (baselineBytes * value) / 100;
            break;
        case 'kb':
            value *= exports.BYTES_IN_KILOBYTE;
            break;
        case 'mb':
            value *= exports.BYTES_IN_KILOBYTE * exports.BYTES_IN_KILOBYTE;
            break;
        case 'gb':
            value *= exports.BYTES_IN_KILOBYTE * exports.BYTES_IN_KILOBYTE * exports.BYTES_IN_KILOBYTE;
            break;
    }
    if (baselineBytes === 0) {
        return value;
    }
    return baselineBytes + value * factor;
}
function* checkBudgets(budgets, stats, checkComponentStyles) {
    // Ignore AnyComponentStyle budgets as these are handled in `AnyComponentStyleBudgetChecker` unless requested
    const computableBudgets = checkComponentStyles
        ? budgets
        : budgets.filter((budget) => budget.type !== schema_1.Type.AnyComponentStyle);
    for (const budget of computableBudgets) {
        const sizes = calculateSizes(budget, stats);
        for (const { size, label } of sizes) {
            yield* checkThresholds(calculateThresholds(budget), size, label);
        }
    }
}
function* checkThresholds(thresholds, size, label) {
    for (const threshold of thresholds) {
        switch (threshold.type) {
            case ThresholdType.Max: {
                if (size <= threshold.limit) {
                    continue;
                }
                const sizeDifference = (0, format_bytes_1.formatSize)(size - threshold.limit);
                yield {
                    severity: threshold.severity,
                    label,
                    message: `${label} exceeded maximum budget. Budget ${(0, format_bytes_1.formatSize)(threshold.limit)} was not met by ${sizeDifference} with a total of ${(0, format_bytes_1.formatSize)(size)}.`,
                };
                break;
            }
            case ThresholdType.Min: {
                if (size >= threshold.limit) {
                    continue;
                }
                const sizeDifference = (0, format_bytes_1.formatSize)(threshold.limit - size);
                yield {
                    severity: threshold.severity,
                    label,
                    message: `${label} failed to meet minimum budget. Budget ${(0, format_bytes_1.formatSize)(threshold.limit)} was not met by ${sizeDifference} with a total of ${(0, format_bytes_1.formatSize)(size)}.`,
                };
                break;
            }
            default: {
                throw new Error(`Unexpected threshold type: ${ThresholdType[threshold.type]}`);
            }
        }
    }
}
