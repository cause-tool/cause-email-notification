'use strict';

const _ = require('lodash');
const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');
const htmlToText = require('nodemailer-html-to-text').htmlToText;


function send(transporter, mail, cb) {
	transporter.use('compile', htmlToText({}));
	transporter.sendMail(mail, cb);
}


function main(step, context, config, input, done) {
	const title = _.template(config.title)(context);
	const message = _.template(config.message)(context);
	const mail = {
		from: config.from,
		to: config.to,
		subject: title,
		html: message
	};

	const transporter = nodemailer.createTransport(
		mailgun(config.mailgun)
	);

	send(transporter, mail, (err, info) => {
		if (err) {
			return done(err);
		}
		const output = input;
		done(null, output, null);
	});
}


module.exports = {
	main: main,
	defaults: {
		config: {
			title: '’cause: <%=task.name%>',
			message: '<%=prevStep.block%>: <%=input%>',
			from: undefined,
			to: undefined
		},
		data: {},
		description: 'email'
	}
};
