var nodemailer = require('nodemailer');
const { google } = require('googleapis')
require('dotenv').config();
const refreshtoken = process.env.SMTP_REFRESHTOKEN;
const { deleteLocal } = require('../routes/filesCtrl');
var rnmaLogo = 'https://www.maisonsdesassociations.fr/images/rnma.gif';
var SvCvLogo ='https://foot49.fff.fr/wp-content/uploads/sites/36/2020/07/Logo_Service_civique.svg_2.jpg';

const oAuth2Client = new google.auth.OAuth2(process.env.SMTP_CLIENTID, process.env.SMTP_CLIENTSECRET, process.env.SMTP_REDIRECTURI)
oAuth2Client.setCredentials({ refresh_token: refreshtoken })

module.exports = {
    send: async function(req, res, message, email, attachment) {
        try{
            var mailOptions = {
                from: 'Maison des Associations de Saint-Benoît <maisondesassociations.sb@gmail.com>',
                to: email,
                subject: 'Ne pas répondre',
                html: 
                    `<div style='text-align: center; color: black; width: 50%; margin-left: auto; margin-right: auto;font-size:1.2em;'>
                        <img src='https://www.saint-benoit.re/media/glide/news/e7052dfe7a56bbd248267f8d8fb901c4.jpg?w=695&h=&fit=crop-center&s=aa2c0f878dce7174a13a80f4c655db40' alt='logo-mda' width='150px'/>
                        ${message}
                    </div>
                    <div>
                        <div style='margin-bottom: 0%;'>
                            <a href='https://www.facebook.com/pg/MDAdeStBenoit/posts/'><img src='https://sens-public.org/static/git-articles/SP1245/media/arton1245.png' alt='logo-facebook' width='3%'/></a>
                            <p style='font-family: sans-serif; float: left'>Rejoignez notre page :</p>
                        </div>
                        <div>
                            <div style='text-align: center; padding-left: 64px;'>
                                <a href='https://www.maisonsdesassociations.fr/'>
                                    <img src='${rnmaLogo}' alt='rnma' width='60px'/>
                                </a>

                                <a style='margin-left: 8px;' href='http://mda-saintbenoit.re/' >
                                        <img width='110px' src='https://www.saint-benoit.re/media/glide/news/e7052dfe7a56bbd248267f8d8fb901c4.jpg?w=695&h=&fit=crop-center&s=aa2c0f878dce7174a13a80f4c655db40' alt='logo-mda'/>
                                </a>
                                <a href='https://www.service-civique.gouv.fr/' style='margin-left: 8px;'>
                                    <img width='140px' src='${SvCvLogo}' alt='service-civique' />
                                </a>
                            </div>
                            <hr style='border-top: 1px solid rgba(100, 100, 100, 0.233); width: 20%;'></hr>
                            <h3 style='text-align: center; font-family: sans-serif; color: rgb(0, 0, 0);'><span style='color: rgb(139, 23, 23);'>Maison Des Associations</span> de Saint-Benoît</h3>
                            <div>
                                <p style='color: rgb(104, 104, 104); text-align: center;font-family: sans-serif; font-size: 0.8em;'>
                                    <strong>
                                        <span style='margin-right: 30px;'>Tel: 02 62 41 34 04</span> 
                                        <span style='margin-right: 30px;'>Fax: 02 62 41 67 14</span>
                                        <br>6 rue Le Corbusier - Bras-Fusil - BP102 97470 Saint-Benoît
                                    </strong>
                                </p>
                            </div>
                        </div>
                    </div>`,
                    attachments: attachment ? attachment : null
            }
            
            const accessToken = await oAuth2Client.getAccessToken()

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                type: 'OAuth2',
                user: process.env.SMTP_USER,
                clientId: process.env.SMTP_CLIENTID,
                clientSecret: process.env.SMTP_CLIENTSECRET,
                refreshToken: process.env.SMTP_REFRESHTOKEN,
                accessToken: accessToken
                }
            });

            const result = await transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    return false;
                } else{
                    console.log('Email sent: ' + email)
                    if(attachment){
                        attachment.forEach(val =>
                            deleteLocal(req, res, val.path)
                        )
                    }
                    return true;
                }
            })
            return result;
        }
        catch(error){
            console.log(error);
        }
    }
}