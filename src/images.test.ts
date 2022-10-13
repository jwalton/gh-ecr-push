/**
 * @jest-environment node
 */

import chai from 'chai';
import { getImagesToPush } from './images';

const { expect } = chai;

describe('images', () => {
    beforeEach(() => {
        // TODO: Uncomment this if you're using `jest.spyOn()` to restore mocks between tests
        // jest.restoreAllMocks();
    });

    it('should do the thing', () => {
        // TODO
    });

    it('should push an image', () => {
        const images = getImagesToPush('local:15.16.17', 'remote:15.16.17', false);

        expect(images).to.eql([{ localImage: 'local:15.16.17', remoteImage: 'remote:15.16.17' }]);
    });
    it('should generate semver style images', () => {
        const images = getImagesToPush('local:15.16.17', 'remote:15.16.17', true);

        expect(images).to.eql([
            { localImage: 'local:15.16.17', remoteImage: 'remote:15' },
            { localImage: 'local:15.16.17', remoteImage: 'remote:15.16' },
            { localImage: 'local:15.16.17', remoteImage: 'remote:15.16.17' },
        ]);
    });
    it('should generate semver style images with a v prefix', () => {
        const images = getImagesToPush('local:v15.16.17', 'remote:v15.16.17', true);

        expect(images).to.eql([
            { localImage: 'local:v15.16.17', remoteImage: 'remote:v15' },
            { localImage: 'local:v15.16.17', remoteImage: 'remote:v15.16' },
            { localImage: 'local:v15.16.17', remoteImage: 'remote:v15.16.17' },
        ]);
    });
    it('should generate multiple images', () => {
        const images = getImagesToPush('local:15.16.17', 'remote:15.16.17, remote:latest', false);

        expect(images).to.eql([
            { localImage: 'local:15.16.17', remoteImage: 'remote:15.16.17' },
            { localImage: 'local:15.16.17', remoteImage: 'remote:latest' },
        ]);
    });
    it('should generate multiple semver images', () => {
        const images = getImagesToPush('local:15.16.17', 'remote:15.16.17, remote2:latest', true);

        expect(images).to.eql([
            { localImage: 'local:15.16.17', remoteImage: 'remote:15' },
            { localImage: 'local:15.16.17', remoteImage: 'remote:15.16' },
            { localImage: 'local:15.16.17', remoteImage: 'remote:15.16.17' },
            { localImage: 'local:15.16.17', remoteImage: 'remote2:15' },
            { localImage: 'local:15.16.17', remoteImage: 'remote2:15.16' },
            { localImage: 'local:15.16.17', remoteImage: 'remote2:15.16.17' },
        ]);
    });
});
