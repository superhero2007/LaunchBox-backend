const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

const sendConfirmationEmail = (user) => {
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