export const up = async (db, client) => {
    await db.collection('todos').createIndex({ "title": 1 }, { index: true });
    await db.collection('todos').createIndex({ "user_id": 1 }, { index: true });
};

export const down = async (db, client) => {
    await db.collection('todos').drop();
};
