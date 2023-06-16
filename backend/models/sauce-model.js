const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
}, { timestamps: true });


sauceSchema.post('findOneAndUpdate', async function(doc) {
    const { stock } = doc;

    // Check if stock is below 20
    if (stock < 20) {
        // Send an email to the user
        console.log("EMail jana chaiye");
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'Low stock alert',
            text: `The stock for ${doc.name} ssuces has gone below 20. Please take action.`
        };
        await mailService.sendMail(mailOptions);
    }
});

const Sauce = mongoose.model('Sauce', sauceSchema);

module.exports = Sauce;