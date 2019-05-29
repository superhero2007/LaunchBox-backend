const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmationEmail = (user) => {
  console.log(user.generateConfirmationUrl());
  const msg = {
    to: user.email,
    from: 'support@brandguide.app',
    from_name: 'BrandGuide',
    templateId: 'd-502c70f187434c7db66c9c1651a6759f',
    dynamic_template_data: {
      email: user.email,
      verify_link: user.generateConfirmationUrl()
    },
  };
  sgMail.send(msg);
};

const sendResetPasswordEmail = (user) => {
  console.log(user.generateResetPasswordLink());
  const msg = {
    to: user.email,
    from: 'support@brandguide.app',
    from_name: 'BrandGuide',
    templateId: 'd-01448366ab014cf09400c66f4f0158a4',
    dynamic_template_data: {
      fullName: user.fullName,
      verify_link: user.generateResetPasswordLink()
    },
  };
  sgMail.send(msg);
};

const sendChangeEmail = (user) => {
  console.log(user.generateEmailUrl());
  const msg = {
    to: user.email,
    from: 'support@brandguide.app',
    from_name: 'BrandGuide',
    templateId: 'd-72f41c23fc8f49bf99f794e4b0261f23',
    dynamic_template_data: {
      fullName: user.fullName,
      verify_link: user.generateEmailUrl()
    },
  };
  sgMail.send(msg);
};

module.exports = {
  sendConfirmationEmail,
  sendResetPasswordEmail,
  sendChangeEmail
};
