export class UpdateUserDto {
    email;
    password;
    name;
    country;
    age;
    originName;

    constructor(data) {
        let { email, password, name, country, age, originName } = data;
        this.email = email;
        this.password = password.toString();
        this.name = name;
        this.country = country;
        this.age = age;
        this.originName = originName;
    }
}
