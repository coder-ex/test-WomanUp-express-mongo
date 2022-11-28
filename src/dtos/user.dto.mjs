export class UserDto {
    email;
    id;
    isActivated;
    role;

    constructor(model) {
        let { email, id, isActivated, role } = model;
        this.email = email;
        this.id = id;
        this.isActivated = isActivated;
        this.role = role;
    }
}