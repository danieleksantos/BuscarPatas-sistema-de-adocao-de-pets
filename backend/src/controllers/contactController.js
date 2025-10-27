import nodemailer from 'nodemailer';

export const sendContactEmail = async (req, res) => {


    const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 2525,
        secure: false,
        auth: {
            user: 'apikey',       
            pass: process.env.EMAIL_PASS 
        },
        connectionTimeout: 30000
    });

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const mailOptions = {
        from: process.env.VERIFIED_SENDER_EMAIL,
        to: process.env.DESTINATION_EMAIL,   
        replyTo: email,
        subject: `Nova Dúvida/Contato - Site Buscar Patas`,
        html: `
            <p>Nova Mensagem de <strong>${name}</strong></p>
            <hr>
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
            <p>${email}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Sua mensagem foi enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ message: 'Falha ao enviar mensagem. Tente novamente mais tarde.' });
    }
};