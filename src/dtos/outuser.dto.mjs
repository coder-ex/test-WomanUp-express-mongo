export class OutUserDto {
    id;
    email;
    role;
    isActivated;
    profCount;
    profile;

    constructor(data) {
        let { _id, email, role, isActivated, profile = [] } = data;
        this.id = _id;
        this.email = email;
        this.role = role;
        this.isActivated = isActivated;
        this.profCount = profile.length;
        this.profile = profile;
    }
}