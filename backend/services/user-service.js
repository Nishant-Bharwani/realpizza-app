const UserModel = require('../models/user-model');
const { validationResult } = require('express-validator');

class UserService {
    checkValidation(req) {
        // try {
        //     const errors = validationResult(req);
        //     console.log(errors);
        //     if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() });
        //     }
        // } catch (err) {
        //     console.log(err);
        //     res.status(500).json({ message: 'Internal server error' });
        // }

        const errors = validationResult(req);
        return errors;
    }

    async findUser(filter) {
        const user = await UserModel.findOne(filter);
        return user;
    }
}


module.exports = new UserService();