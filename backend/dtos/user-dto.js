class UserDto {
    _id;
    name;
    email;
    isVerified;
    role;

    constructor(user) {
        this._id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.isVerified = user.isVerified;
        this.role = user.role
    }

}


module.exports = UserDto;