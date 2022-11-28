export const up = async (db, client) => {
    await db.collection('profiles').createIndex({ "name": 1 }, { index: true });
    await db.collection('profiles').createIndex({ "country": 1 }, { index: true });
    await db.collection('profiles').createIndex({ "age": 1 }, { index: true });
    await db.collection('profiles').createIndex({ "user_id": 1 }, { index: true });
};

export const down = async (db, client) => {
    await db.collection('profiles').drop();
};
