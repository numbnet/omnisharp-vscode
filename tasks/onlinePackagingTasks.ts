/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as del from 'del';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as unzip from 'unzip2';
import { onlineVscodeignorePath, unpackedVsixPath, vscePath, vscodeignorePath } from './projectPaths';
import { getPackageJSON } from './packageJson';
import spawnNode from './spawnNode';

gulp.task('vsix:release:unpackage', () => {
    const packageJSON = getPackageJSON();
    const name = packageJSON.name;
    const version = packageJSON.version;
    const packageName = `${name}-${version}.vsix`;

    del.sync(unpackedVsixPath);
    fs.createReadStream(packageName).pipe(unzip.Extract({ path: unpackedVsixPath }));
});

gulp.task('vsix:release:package', (onError) => {
    del.sync(vscodeignorePath);

    fs.copyFileSync(onlineVscodeignorePath, vscodeignorePath);

    return spawnNode([vscePath, 'package'])
        .then(() => {
            del(vscodeignorePath);
        }, (error) => {
            del(vscodeignorePath);
            throw error;
        });
});