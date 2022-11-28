export class TodoDto {
    id;
    title;
    completed;
    updatedAt;
    email;
    userId

    constructor(model) {
        let { _id, title, completed, updatedAt, user } = model;
        this.id = _id;
        this.title = title;
        this.completed = completed;
        this.updatedAt = updatedAt;
        this.userId = user[0]._id;
        this.email = user[0].email;
    }
}