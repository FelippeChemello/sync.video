import { ConnectionOptions, createConnections } from 'typeorm';

import ormConfig from '../../../config/ormconfig';

async function startDatabase() {
    await createConnections(ormConfig as ConnectionOptions[]);

    console.log('🛸 Database connection created');
}

export default startDatabase;
