const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";

const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

const emailCampaign = new SibApiV3Sdk.CreateEmailCampaign({
  name: "Campaign sent via the API",
  subject: "My subject",
  sender: {
    name: "From Name",
    email: "ritiksg143@gmail.com",
  },
  type: "classic",
  htmlContent:
    "<html><body><h1>Congratulations!</h1><p>You successfully sent this example campaign via the Brevo API.</p></body></html>",

  scheduledAt: "2025-06-21 15:00:00",
});

apiInstance.createEmailCampaign(emailCampaign).then(
  function (data) {
    console.log("API called successfully. Returned data: ", data);
  },
  function (error) {
    console.error("Error while creating campaign:", error);
  }
);
