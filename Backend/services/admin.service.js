const adminModel = require('../models/admin.model');


module.exports.createAdmin = async ({ firstname, lastname, email, password }) => {
    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }

    const admin = await adminModel.create({
        fullname: {
            firstname,
            lastname: lastname || '' // Ensure lastname is not undefined
        },
        email,
        password
    });

    return admin;
};
