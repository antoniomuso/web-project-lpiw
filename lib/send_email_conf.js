
var nodemailer = require('nodemailer')



module.exports = (email, sale, id, crypto, options) => {
    console.log(`${email} ${sale} ${id}`)
    var transporter = nodemailer.createTransport({
        service: options.emailService,
        auth: {
            user: options.email,
            pass: options.password
        }
    })

    const hash = crypto.createHash('sha256')
    let str = hash.update(id + sale).digest('hex')
    var mailOptions = {
        from: options.email,
        to: email,
        subject: `SuperChat Registration`,
        text: options.uri + ':' + options.port + '/conf?id=' + id + '&hash=' + str
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })

}