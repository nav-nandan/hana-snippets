var mail = new $.net.Mail({
	sender: {address: "<senderemailaddress>"},
	to: [{address: "<recipientemailaddress>"}],
	subject: "test",
	parts: [new $.net.Mail.Part({
		type: $.net.Mail.Part.TYPE_TEXT,
		text: "it works",
		contentType: "text/plain"
	})]
});
var returnStatus = mail.send();
var response = "messageId = " + returnStatus.messageId + ", final reply = " + returnStatus.finalReply;
$.response.contentType = "text/plain";
$.response.setBody(response);