
import * as chai from 'chai';
let expect = chai.expect;
// or you could do this import { expect } from 'chai'
import {Utils} from '../../app/utils';

describe('Utils', () => {
    let subject: Utils;

    beforeEach(function () {
        subject = new Utils();
    });

    describe('levelBound()', () => {
        it('it should leave in-bounds integers alone', (done) => {
            let result: number = subject.levelBound(2);
            expect(subject.levelBound(2)).to.equals(2);
            expect(subject.levelBound(0)).to.equals(0);
            expect(subject.levelBound(10)).to.equals(10);
            done();
        });
        it('it should round up to nearest int', (done) => {
            let result: number = subject.levelBound(2);
            expect(subject.levelBound(2.5)).to.equals(3);
            expect(subject.levelBound(2.7)).to.equals(3);
            done();
        });
         it('it should round down to nearest int', (done) => {
            let result: number = subject.levelBound(2);
            expect(subject.levelBound(2.2)).to.equals(2);
            expect(subject.levelBound(2.49)).to.equals(2);
            expect(subject.levelBound(2.1)).to.equals(2);
            expect(subject.levelBound(2.0)).to.equals(2);
            done();
        });
         it('it should convert negatives to zero', (done) => {
            let result: number = subject.levelBound(2);
            expect(subject.levelBound(-5)).to.equals(0);
            expect(subject.levelBound(-0.1)).to.equals(0);
            expect(subject.levelBound(-100)).to.equals(0);
            done();
        });
          it('it should convert numbers above 99 to 99', (done) => {
            let result: number = subject.levelBound(2);
            expect(subject.levelBound(99)).to.equals(99);
            expect(subject.levelBound(100)).to.equals(99);
            expect(subject.levelBound(10000)).to.equals(99);
            done();
        });
    });
});
