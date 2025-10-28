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
<!doctype html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Buscar Patas - Adoção de pets email</title>
</head>

<body bgcolor="#ffffff" text="#000000"
    style="-webkit-text-size-adjust: none; background-color: #ffffff; font-family: Arial, helvetica, sans-serif; line-height: 100%; font-size: 16px; color: #000000; padding: 0px;">
    <table width="100%" role="presentation" align="center" cellpadding="0" cellspacing="0" border="0"
        style="margin: 0px auto; max-width: 600px; background-color: #F7F7FA;">
        <tr>
            <td align="center" valign="top" style="padding: 16px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td class="responsive-td" width="80" align="center" valign="top" style="padding: 0px 0px 16px;">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" valign="top">
                                        <img src="https://i.postimg.cc/d0JYWM4G/logo.png" alt="Logo Buscar Patas"
                                            width="80" style="
                                            max-width: 72px; 
                                            height: auto; 
                                            display: block; 
                                            border: 0; 
                                            margin: 0; 
                                            padding: 0; 
                                            outline: none; 
                                            font-family: Arial, Sans-serif; 
                                            font-size: 16px; 
                                            color: #000000; 
                                            line-height: 24px; 
                                            font-weight: 400;
                                            " />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>


        <tr>
            <td align="center" valign="top" style="padding: 0px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center" valign="top">
                            <p
                                style="font-family: Arial, Sans-serif; font-size: 24px; color: #2F6C9B; line-height: 32px; font-weight: 700; margin: 0px; text-align: left;">
                                Nova mesagem de <span style="font-weight: 700;">${name}:</span>
                            </p>
                            <p
                                style="font-family: Arial, Sans-serif; font-size: 18px; color: #000000; line-height: 25px; font-weight: 400; margin: 30px 0px; text-align: left;">
                                ${message}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" valign="top">
                            <p
                                style="font-family: Arial, Sans-serif; font-size: 10px; color: #636769; line-height: 15px; font-weight: 300; margin: 40px 0px 30px; text-align: left;">
                                Este é um e-mail automático enviado pelo formulário de contato do site Buscar Patas.
                                Para responder ao usuário, use o e-mail no campo Responder Para.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>


        <tr>
            <td align="center" valign="top" style="padding: 0px 32px 16px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center" valign="top">
                            <p
                                style="font-family: Arial, Sans-serif; font-size: 14px; color: #86C89A; line-height: 18.2px; font-weight: 400; margin: 40px 0 0;">
                                <span style="font-weight: 800;">Este é um canal oficial Buscar Patas</span>
                                <br>
                                © 2025 Copyright. Todos os direitos reservados Buscar Patas.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
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