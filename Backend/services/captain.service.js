const captainModel = require('../models/captain.model');


module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }
    const captain = captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    })

    return captain;
}



// const activateCaptain = async (captainId) => {
//   try {
//     const updatedCaptain = await captainModel.updateOne(
//       { _id: captainId },
//       { $set: { status: 'active' } }
//     );

//     if (updatedCaptain.nModified === 0) {
//       return { message: 'Captain already active or not found.' };
//     }

//     return { message: 'Captain has been activated.' };
//   } catch (error) {
//     console.error('Error activating captain:', error);
//     throw new Error('Error activating captain');
//   }
// };

// module.exports = { activateCaptain };