declare module 'nodemailer-sendgrid-transport' {
  import { Transport } from 'nodemailer';

  interface SendGridOptions {
    auth: {
      api_key: string;
    };
  }

  function sendgridTransport(options: SendGridOptions): Transport;

  export default sendgridTransport;
}