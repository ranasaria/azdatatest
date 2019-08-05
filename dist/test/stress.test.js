/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
require("mocha");
const stress_1 = require("../stress");
const utils_1 = require("../utils");
const assert = require("assert");
const assert_1 = require("assert");
const debug = require('debug')('unittest:stress');
const trace = require('debug')('unittest:stress:trace');
;
class StressifyTester {
    constructor() {
        this.t = 0;
        this.f = 0;
        this.e = 0;
    }
    setenvironmentVariableiableSuiteType(suiteType) {
        process.env.SuiteType = suiteType;
        debug(`environment variable SuiteType set to ${process.env.SuiteType}`);
    }
    basicTest() {
        return __awaiter(this, void 0, void 0, function* () {
            yield utils_1.bear(); // yield to other operations.
            this.t++;
        });
    }
    testStressStats() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.failedErroredExecutions();
        });
    }
    passThresholdFailed() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.failedErroredExecutions();
        });
    }
    failedErroredExecutions() {
        return __awaiter(this, void 0, void 0, function* () {
            this.t++;
            if (this.t % 7 === 0) { //for every 7th invocation
                this.f++;
                assert.strictEqual(true, false, `failing the ${this.t}th invocation`);
            }
            else if (this.t % 11 === 0) { //for every 11th invocation
                this.e++;
                throw new Error(`Erroring out ${this.t}th invocation`);
            }
            yield utils_1.sleep(2); // sleep for 2 ms without spinning
        });
    }
    passThresholdMet() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.failedErroredExecutions();
        });
    }
    timeOutTest() {
        return __awaiter(this, void 0, void 0, function* () {
            yield utils_1.bear(); // yield to other operations.
            this.t++;
        });
    }
}
StressifyTester.dop = 5;
StressifyTester.iter = 6;
StressifyTester.runtime = 0.05; //seconds
__decorate([
    utils_1.runOnCodeLoad(StressifyTester.prototype.setenvironmentVariableiableSuiteType, 'Stress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StressifyTester.prototype, "setenvironmentVariableiableSuiteType", null);
__decorate([
    stress_1.stressify({ dop: StressifyTester.dop, iterations: StressifyTester.iter, passThreshold: 1 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StressifyTester.prototype, "basicTest", null);
__decorate([
    stress_1.stressify({ dop: StressifyTester.dop, iterations: StressifyTester.iter, passThreshold: 0 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StressifyTester.prototype, "testStressStats", null);
__decorate([
    stress_1.stressify({ dop: StressifyTester.dop, iterations: StressifyTester.iter, passThreshold: 0.88 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StressifyTester.prototype, "passThresholdFailed", null);
__decorate([
    stress_1.stressify({ dop: StressifyTester.dop, iterations: StressifyTester.iter, passThreshold: 0.5 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StressifyTester.prototype, "passThresholdMet", null);
__decorate([
    stress_1.stressify({ runtime: StressifyTester.runtime, dop: StressifyTester.dop, iterations: stress_1.Stress.MaxIterations, passThreshold: 1 }, false /* collectCounters */),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StressifyTester.prototype, "timeOutTest", null);
before('Stress automation setup', function () {
    if (process.env.DontCleanupTestGeneratedFiles) {
        debug(`process.env.DontCleanupTestGeneratedFiles: set to ${process.env.DontCleanupTestGeneratedFiles}, skipping temporary files for cleanup`);
        temp.track(false);
    }
    else {
        debug(`marking temporary files for cleanup`);
        // Automatically track and cleanup files at exit
        temp.track();
    }
    process.env.CountersOutputDirectory = temp.mkdirSync('StressUnitTests_');
    debug('temp output directory', process.env.CountersOutputDirectory);
});
beforeEach('Stress automation beforeEach Test Setup', function () {
    process.env.CountersCollectionInterval = '10'; // collect every 10 milliseconds
});
afterEach('Stress automation afterEach Test Cleanup', function () {
    delete process.env.CountersCollectionInterval; // collect every 10 milliseconds
});
suite('Stress automation unit tests', function () {
    // set a higher timeout value
    this.timeout(10000); // allow 10 seconds for each test to complete
    //Environment Variable Tests
    //
    const absentValues = ['deleted', undefined, null, ''];
    let testId = 1;
    // Test values to verify StressOptions configured by environment variables and or constructor parameters
    //
    function getStressParams() {
        return [
            {
                environmentVariableName: 'StressRuntime',
                stressOptionName: 'runtime',
                tooLow: -0.1 / Math.random(),
                tooHigh: stress_1.Stress.MaxRuntime + 0.1 / Math.random(),
                valid: Math.random() * stress_1.Stress.MaxRuntime,
                invalid: 'abracadabra'
            },
            {
                environmentVariableName: 'StressDop',
                stressOptionName: 'dop',
                tooLow: Math.floor(-0.1 / Math.random()),
                tooHigh: Math.ceil(stress_1.Stress.MaxDop + 0.1 / Math.random()),
                valid: Math.min(1, Math.floor(Math.random() * stress_1.Stress.MaxDop)),
                invalid: 'abracadabra'
            },
            {
                environmentVariableName: 'StressIterations',
                stressOptionName: 'iterations',
                tooLow: Math.floor(-0.1 / Math.random()),
                tooHigh: Math.ceil(stress_1.Stress.MaxIterations + 0.1 / Math.random()),
                valid: Math.floor(Math.random() * stress_1.Stress.MaxIterations),
                invalid: 'abracadabra'
            },
            {
                environmentVariableName: 'StressPassThreshold',
                stressOptionName: 'passThreshold',
                tooLow: -0.1 / Math.random(),
                tooHigh: stress_1.Stress.MaxPassThreshold + 0.1 / Math.random(),
                valid: Math.random() * stress_1.Stress.MaxPassThreshold,
                invalid: 'abracadabra'
            }
        ];
    }
    const stressParams = getStressParams();
    // Tests for environment variable corresponding to StressOptions not specified (absent)
    //
    stressParams.forEach(x => {
        [...absentValues, x.invalid].forEach(valueDim => {
            test(`environmentStressOption Test:${testId++}:: environmentVariable ${x.environmentVariableName} set to ##{${valueDim}}## should default to ${stress_1.DefaultStressOptions[x.stressOptionName]}`, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let origEnvironmentVariableValue = process.env[x.environmentVariableName];
                    try {
                        if (valueDim === 'deleted') {
                            delete process.env[x.environmentVariableName];
                            trace(`deleing env[${x.environmentVariableName}]`);
                        }
                        else {
                            process.env[x.environmentVariableName] = valueDim;
                            trace(`setting env[${x.environmentVariableName}] to: ${valueDim}`);
                        }
                        const actualOption = (new stress_1.Stress())[x.stressOptionName];
                        trace(`Actual ${x.stressOptionName} on a newly constructed Stress object evaluated to: ${actualOption}`);
                        assert.equal(actualOption, stress_1.DefaultStressOptions[x.stressOptionName]);
                    }
                    finally {
                        process.env[x.environmentVariableName] = origEnvironmentVariableValue;
                    }
                });
            });
        });
    });
    // Tests for environment variable corresponding to StressOptions set to a invalid, too high or too low value
    //
    stressParams.forEach(x => {
        [x.tooLow, x.tooHigh].forEach(invalidValue => {
            test(`environmentStressOption Test:${testId++}:: environmentVariable ${x.environmentVariableName} set to ##{${invalidValue}}## should result in a ValidationError`, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let origEnvironmentVariableValue = process.env[x.environmentVariableName];
                    try {
                        process.env[x.environmentVariableName] = invalidValue.toString();
                        trace(`setting env[${x.environmentVariableName}] to: ${invalidValue}`);
                        new stress_1.Stress();
                        assert(false, "The test did not throw when it was expected to");
                    }
                    catch (errors) {
                        trace(`Exception caught:${errors}::${utils_1.jsonDump(errors)}, each is being verified to be ValidationError type and is being swallowed`);
                        [...errors].forEach(err => assert(err instanceof class_validator_1.ValidationError));
                    }
                    finally {
                        process.env[x.environmentVariableName] = origEnvironmentVariableValue;
                    }
                });
            });
        });
    });
    // Tests for environment variable corresponding to StressOptions set to a valid value
    //
    stressParams.forEach(x => {
        [x.valid].forEach(validValue => {
            test(`environmentStressOption Test:${testId++}:: environmentVariable ${x.environmentVariableName} set to ##{${validValue}}## should set the created object's ${x.stressOptionName} property to ${validValue}`, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let origEnvironmentVariableValue = process.env[x.environmentVariableName];
                    try {
                        process.env[x.environmentVariableName] = validValue.toString();
                        trace(`setting env[${x.environmentVariableName}] to: ${validValue}`);
                        const actualOption = (new stress_1.Stress())[x.stressOptionName];
                        trace(`Actual ${x.stressOptionName} on a newly constructed Stress object evaluated to: ${actualOption}`);
                        assert.equal(actualOption, validValue);
                    }
                    finally {
                        process.env[x.environmentVariableName] = origEnvironmentVariableValue;
                    }
                });
            });
        });
    });
    // Tests for passing null/empty, too high, too low or invalid value as StressOption paratmeter to Stress constructor
    //
    stressParams.forEach(x => {
        [...absentValues, x.tooLow, x.tooHigh, x.invalid].filter(s => s !== 'deleted').forEach(badValue => {
            test(`constructorStressOption Test:${testId++}:: constructor parameter ${x.stressOptionName} set to ##{${badValue}}## should result in a ValidationError`, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let option = stress_1.DefaultStressOptions;
                        option[x.stressOptionName] = badValue;
                        trace(`StressOptions object being passed to stress constructor is:${utils_1.jsonDump(option)}`);
                        trace(`Constructing a Stress object with constructor parameter ${x.stressOptionName} set to ##{${badValue}}##`);
                        new stress_1.Stress(option);
                        assert(false, "The test did not throw when it was expected to");
                    }
                    catch (errors) {
                        trace(`Exception caught:${errors}::${utils_1.jsonDump(errors)}, each is being verified to be ValidationError type and is being swallowed`);
                        [...errors].forEach(err => assert(err instanceof class_validator_1.ValidationError));
                    }
                });
            });
        });
    });
    // Tests for passing a valid value as StressOption parameter to Stress constructor
    // Corresponding environment variables are as set to random default valid values as well. These tests ensure that the values passed into
    // constructor are the ones that are finally set.
    //
    const environmentVariableValidValuesForStressOptions = getStressParams();
    trace(`environmentVariableValidValuesForStressOptions::${utils_1.jsonDump(environmentVariableValidValuesForStressOptions)}`);
    stressParams.forEach(x => {
        test(`constructorStressOption Test:${testId++}:: constructor parameter ${x.stressOptionName} set to ##{${x.valid}}## should set the created object's ${x.stressOptionName} property to ${x.valid}`, function () {
            return __awaiter(this, void 0, void 0, function* () {
                const origEnvironmentValues = {};
                try {
                    environmentVariableValidValuesForStressOptions.forEach(x => {
                        trace(`saving origEnvironmentValues process.env[x.environmentVariableName]=${process.env[x.environmentVariableName]} in origEnvironmentValues[x.environmentVariableName]`);
                        origEnvironmentValues[x.environmentVariableName] = process.env[x.environmentVariableName];
                        trace(`origEnvironmentValues[x.environmentVariableName] is now ${origEnvironmentValues[x.environmentVariableName]}`);
                        trace(`setting process.env[x.environmentVariableName] to ${x.valid}`);
                        process.env[x.environmentVariableName] = x.valid.toString();
                    });
                    let option = { runtime: undefined, dop: undefined, iterations: undefined, passThreshold: undefined };
                    option[x.stressOptionName] = x.valid;
                    trace(`Constructing a Stress object with constructor parameter ${x.stressOptionName} set to ##{${x.valid}}##`);
                    const actualOption = (new stress_1.Stress(option))[x.stressOptionName];
                    trace(`Actual ${x.stressOptionName} on a newly constructed Stress object evaluated to: ${actualOption}`);
                    assert.equal(actualOption, x.valid);
                }
                finally {
                    environmentVariableValidValuesForStressOptions.forEach(x => {
                        process.env[x.environmentVariableName] = origEnvironmentValues[x.environmentVariableName];
                    });
                }
            });
        });
    });
    // Basic Positive test for canonical use case.
    //
    test(`Positive Test:${testId++}:: ensures multiple threads and iterations gets performed as expected`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            debug('invoking basicTest()');
            const stressifier = new StressifyTester();
            let retVal = yield stressifier.basicTest();
            debug(`test basicTest done, total invocations=${stressifier.t}`);
            debug(`test retVal is ${utils_1.jsonDump(retVal)}`);
            assert(retVal.numPasses === StressifyTester.dop * StressifyTester.iter, `total invocations should be ${StressifyTester.dop * StressifyTester.iter}`);
        });
    });
    // Positive test to verify the error and fail counts returned are accurate.
    //
    test(`Positive Test:${testId++}:: verifies Pass, Fail, Error counts of stress execution`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            debug('invoking testStressStats()');
            const stressifier = new StressifyTester();
            let retVal = yield stressifier.testStressStats();
            debug(`test testStressStats done, total invocations=${stressifier.t}`);
            debug(`test retVal is ${utils_1.jsonDump(retVal)}`);
            assert(retVal.numPasses + retVal.fails.length + retVal.errors.length === StressifyTester.dop * StressifyTester.iter, `total invocations should be ${StressifyTester.dop * StressifyTester.iter}`);
            assert.equal(retVal.fails.length, stressifier.f, `Number of failures does not match the expected`);
            assert.equal(retVal.errors.length, stressifier.e, `Number of errors does not match the expected`);
        });
    });
    // Positive test to verify that the passThreshold not exceeded results in a pass.
    //
    test(`Positive Test:${testId++}:: verifies passThreshold met does not result in error being thrown`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            assert.doesNotThrow(() => __awaiter(this, void 0, void 0, function* () {
                debug('invoking passThresholdMet()');
                const stressifier = new StressifyTester();
                let retVal = yield stressifier.passThresholdMet();
                debug(`test testStressStats done, total invocations=${stressifier.t}`);
                debug(`test retVal is ${utils_1.jsonDump(retVal)}`);
                assert(retVal.numPasses + retVal.fails.length + retVal.errors.length === StressifyTester.dop * StressifyTester.iter, `total invocations should be ${StressifyTester.dop * StressifyTester.iter}`);
                assert.equal(retVal.fails.length, stressifier.f, `Number of failures does not match the expected`);
                assert.equal(retVal.errors.length, stressifier.e, `Number of errors does not match the expected`);
            }), `passThreshold should have been met and the test should have passed`);
        });
    });
    // Positive test to verify that the passThreshold not met results in an assertion.
    //
    test(`Positive Test:${testId++}:: verifies passThreshold failed does result in error being thrown`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const stressifier = new StressifyTester();
            try {
                debug('invoking passThresholdFailed()');
                yield stressifier.passThresholdFailed();
                assert(false, "Error was not thrown when one was expected");
            }
            catch (err) {
                debug(`test testStressStats done, total invocations=${stressifier.t}`);
                trace(`Exception caught:${err}::${utils_1.jsonDump(err)}, each is being verified to be AssertionError type and is being swallowed`);
                assert(err instanceof assert_1.AssertionError);
            }
        });
    });
    // Verifies that timer fires to end the test when runTime expires and number of iterations are not up.
    //
    test(`Positive Test:${testId++}:: verifies that timer fires to end the test when runTime expires and number of iterations are not up.`, function () {
        return __awaiter(this, void 0, void 0, function* () {
            debug('invoking timerTest()');
            let timeOut = StressifyTester.runtime + 60000; //60 additional seconds beyond expiry of runtime.
            let timeOutExceeded = false;
            let testDone = false;
            // setup a timer to flag timeOutExceeded when we have waited for timeOut amount of time.
            // This test also asserts that the test is done when this timeout expires.
            //
            let timer = setTimeout(() => {
                timeOutExceeded = true;
                assert(testDone, `test was not done even after ${timeOut} seconds when runtime configured was ${StressifyTester.runtime} seconds`);
            }, timeOut);
            const stressifier = new StressifyTester();
            let retVal = yield stressifier.timeOutTest();
            testDone = true;
            clearTimeout(timer);
            timer.unref();
            debug(`test timeOutTest done, total invocations=${stressifier.t}`);
            debug(`test retVal is ${utils_1.jsonDump(retVal)}`);
            assert(!timeOutExceeded, `timeOut of ${timeOut} seconds has been exceeded while executing the test and configured runtime  was: ${StressifyTester.runtime}`);
            assert(retVal.numPasses <= stress_1.Stress.MaxIterations, `total invocations should less than ${stress_1.Stress.MaxIterations}`);
        });
    });
});
//# sourceMappingURL=stress.test.js.map