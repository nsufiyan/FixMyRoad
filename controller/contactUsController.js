
const { sendEmail } = require("../utils/sendEmail");

const add = async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: "Message Send Successfully",
            data: userData
        });
        await sendEmail({
            to: `${process.env.ADMIN_EMAIL}`,
            subject: `📩 New Message from ${req.body.name}`,

            text: `Hello,

        You have received a new message from ${req.body.name ?? "Someone"} (${req.body.email ?? "No email provided"}).

        Message:
        ${req.body.message ?? "No message provided"}

        Please respond to the sender if necessary.

        Thank you,
        Team FixMyRoad
        `,

            html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2 style="color:#2E86C1;">📩 New Message from ${req.body.name ?? "Someone"}</h2>

          <p><strong>Name:</strong> ${req.body.name ?? "N/A"}</p>
          <p><strong>Email:</strong> ${req.body.email ?? "N/A"}</p>

          <p><strong>Message:</strong></p>
          <p style="padding:10px; background-color:#f1f1f1; border-radius:5px;">${req.body.message ?? "No message provided"}</p>

          <p style="margin-top:30px;">Thank you,<br>
          <strong>Team FixMyRoad</strong></p>
        </div>
        `,

        });
    }
    catch (err) {
        res.json({ success: false, message: error.message });
    }

}

module.exports = { add }