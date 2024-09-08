import { NextRequest, NextResponse } from 'next/server';

import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.GMAIL,
		pass: process.env.GMAIL_PASSWORD,
	},
});

async function sendEmail(email: string, code: string) {
	const mailData = {
		to: email,
		subject: `[MEDU] 가입 인증 메일`,
		from: process.env.GMAIL,
		//	html 옵션 또는 text 옵션 둘중 하나만 사용해야함
		html: `
    <h2 style="color: black;"><span style="color: #FFBD59;">[MEDU]</span> 가입 인증 메일</h2>
    <h3 style="color: black;"><span style="font-weight: bold;">인증코드:</span> ${ code }</h3>
     
    <p style="color: #f12929;">*외부 유출에 주의해 주세요!</p>
    `,
	};
 
	return transporter.sendMail(mailData);
}

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const data = await req.json(); // This line will parse the JSON correctly if the input is valid JSON
		const code = Math.random().toString(36).substring(2, 8).toUpperCase();

		console.log('data', data);

		await sendEmail(data.email, code);

		return NextResponse.json({
			success: true,
			data: {
				email: data.email,
				code,
			},
		}, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		});
	} catch (error) {
		console.error('Error processing the request:', error);
		return NextResponse.json({ success: false, error: 'Invalid request format' }, {
			status: 400, headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		});
	}
}

