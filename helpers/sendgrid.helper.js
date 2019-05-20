const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const sendConfirmationEmail = (user) => {
  const msg = {
    to: user.email,
    from: 'info@creativemarket.com',
    from_name: 'Creative Market',
    templateId: 'd-e8475961b3794779965021aad8205376',
    dynamic_template_data: {
      email: user.email,
      verify_link: user.generateConfirmationUrl()
    },
  };
  sgMail.send(msg);
};

module.exports.sendConfirmationEmail = sendConfirmationEmail;