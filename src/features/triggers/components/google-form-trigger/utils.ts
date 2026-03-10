
export const getGoogleAppsScript = (webhookUrl: string): string => `function onFormSubmit(e) {
  const WEBHOOK_URL = "${webhookUrl}";

  const formResponse = e.response;
  const itemResponses = formResponse.getItemResponses();

  const data = {
    submittedAt: new Date().toISOString(),
    responses: {}
  };

  itemResponses.forEach((itemResponse) => {
    const question = itemResponse.getItem().getTitle();
    const answer = itemResponse.getResponse();
    data.responses[question] = answer;
  });

  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(data),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log("Webhook response: " + response.getContentText());
  } catch (error) {
    Logger.log("Error sending webhook: " + error.toString());
  }
}`;

export const GOOGLE_FORM_SETUP_STEPS = [
  { emoji: "①", text: "Open your Google Form" },
  { emoji: "②", text: "Click the ⋮ three-dot menu → Script editor" },
  { emoji: "③", text: "Copy & paste the Apps Script below" },
  { emoji: "④", text: "Replace YOUR_WEBHOOK_URL_HERE with the URL above" },
  { emoji: "⑤", text: 'Save (Ctrl+S) → Click "Triggers" (⏰ icon)' },
  { emoji: "⑥", text: "Add Trigger → From form → On form submit → Save" },
];
