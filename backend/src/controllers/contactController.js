import nodemailer from 'nodemailer';

export const sendContactEmail = async (req, res) => {


    const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 2525,
        secure: false,
        auth: {
            user: 'apikey',        // Nome de usuário padrão para SendGrid
            pass: process.env.EMAIL_PASS // chave de API do SendGrid
        },
        connectionTimeout: 30000
    });

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Configuração do email a ser enviado
    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.DESTINATION_EMAIL,    //  (buscarpatas@gmail.com)
        subject: `Nova Dúvida/Contato - Site Buscar Patas`,
        html: `
            <h3>Nova Mensagem de Contato</h3>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr>
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
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