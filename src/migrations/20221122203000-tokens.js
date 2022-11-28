export const up = async (db, client) => {
    await db.collection('tokens').createIndex({ "refreshToken": 1 }, { index: true });
};

export const down = async (db, client) => {
    await db.collection('tokens').drop();
};
