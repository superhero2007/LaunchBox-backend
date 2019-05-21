const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmationEmail = (user) => {
  console.log(user.generateConfirmationUrl());
  const msg = {
    to: user.email,
    from: 'info@creativemarket.com',
    from_name: 'Creative Market',
    templateId: 'd-502c70f187434c7db66c9c1651a6759f',
    dynamic_template_data: {
      email: user.email,
      verify_link: user.generateConfirmationUrl()
    },
  };
  sgMail.send(msg);
};

module.exports.sendConfirmationEmail = sendConfirmationEmail;