const { v4: uuidv4 } = require("uuid");
const path = require("path");

require("../models");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequestsModel");
const { networkInterfaces } = require("os");
const User = require("../models/userModel");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";

const getPassword = async (req, res) => {
  const user = req.body;

  try {
    const newUser = await User.findOne({ email: user.email });

    const uid = uuidv4();
    const reset = new ForgotPasswordRequest({
      isActive: true,
      UserId: newUser._id,
    });

    await reset.save();

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = {
      email: "ritiksg143@gmail.com",
      name: "TestApp",
    };

    const receivers = [
      {
        email: user.email,
      },
    ];

    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Test Email from Brevo",
      textContent:
        "This is a plain text fallback for email clients that do not support HTML.",
      htmlContent: `
        <html>
          <body>
            <h1>Hello, ${user.email},GET Ready,"http://localhost:4000/password/resetpassword/${reset._id}"</h1>
            <p>This is a test transactional email sent via the Brevo API.</p>
          </body>
        </html>
      `,
    });

    res.status(200).json({ message: "Email sent successfully", sendEmail });
  } catch (error) {
    console.error("Error while sending email:", error);
    res.status(500).json({ error: error.message });
  }
};

const setPassword = async (req, res) => {
  const id = req.params.id;

  console.log(id);

  try {
    const reset = await ForgotPasswordRequest.findOne({ _id: id });
    console.log(reset);

    if (reset && reset.isActive == true) {
      res.sendFile(path.join(__dirname, "..", "public", "index.html"));

      const pass = await ForgotPasswordRequest.updateOne(
        {
          _id: id,
        },
        { $set: { isActive: false } }
      );
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = { getPassword, setPassword };
