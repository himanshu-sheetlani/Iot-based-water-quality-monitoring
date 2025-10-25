import nodemailer from "nodemailer";
import "dotenv/config"; 

export default async function alert(req, res) {
  const { ph, tds, turbidity, temperature } = req.body;

  if (ph < 6.5 || ph > 8.5 || tds > 500 || turbidity > 5) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.RECEIVER,
      subject: "HydroWatch Alert ⚠️",
      text: `Parameter exceeded threshold: ${JSON.stringify(req.body)}`,
    });
  }

  res.send("Checked");
}
