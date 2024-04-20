const prompt = document.getElementById('prompt');
// const location = document.getElementById('location');
const typeTrip = document.getElementById('typeTrip');
const replyField = document.getElementById('replyField');
const sendButton = document.getElementById('send-button');
const replyUser = document.getElementById('replyUser');
const container3 = document.getElementById('container3');
const suggestions = document.getElementById('suggestions');


sendButton.addEventListener('click', retrieveMessage);


let messageCounter = parseInt(localStorage.getItem('messageCounter')) || 0;



    document.addEventListener('keydown', function (event) {
        // Check if the pressed key is Enter (key code 13)
        if (event.key === 'Enter') {
            // Call the retrieveMessage function
            retrieveMessage();
        }
    });

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await suggestionsReply();
    }catch (e) {
        console.error('does not work', e)
    }
});

    async function retrieveMessage() {
        container3.style.display = 'none';
        sendButton.style.display = 'none';
        location.style.display = 'none';

        try{
            const responsBot = await sendMessage(
                prompt.value,
                location.value,
                replyUser.value,
                typeTrip.value,
            );

            messageCounter++;
            localStorage.setItem('messageCounter', messageCounter.toString());


            if (messageCounter > 1) {
                // Display AI response
                displayMessage(responsBot, 'ai');

                // Display user reply
                displayMessage(replyUser.value, 'user');
            } else {
                // Display only AI response for the first message
                displayMessage(responsBot, 'ai');
            }

            prompt.value = '';
            location.value = '';
            replyUser.value = '';
            typeTrip.value = '';

            replyField.style.display = 'block';
            container3.style.display = 'block';
            sendButton.style.display = 'inline-block';
            sendButton.disabled = false;

        } catch (e){
            console.error('error message:', e.message);

            suggestions.style.display = 'none';
            sendButton.style.display = 'inline-block';
            sendButton.disabled = false;
            prompt.disabled = false;
            location.disabled = false;
            typeTrip.disabled = false;
            replyField.disabled = false;


        }

    }



async function sendMessage(message,location, typeTrip, replyUser) {
    try {
        const inputPrompt = `message: ${message}, location: ${location}, reply: ${replyUser}, trip type: ${typeTrip}`;
        const response = await fetch('http://localhost:8080/chatting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({inputPrompt: inputPrompt}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData && responseData.kwargs && responseData.kwargs.content) {
            const aiResponseContent = responseData.kwargs.content;
            displayMessage(aiResponseContent, 'ai');
        } else {
            console.error('No valid AI response found in the response:', responseData);
        }

        return responseData.response;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
}


function displayMessage(content, messageType) {
    if (typeof content === 'string') {
        content = content.replace(/^"(.*)"$/, '$1');

        const messageContainer = generateMessageField(content, messageType);
        appendToResponseContainer(messageContainer, container3.id, messageType);
    } else {
        console.error(`Invalid ${messageType} content:`, content);
    }
}


    function generateMessageField (content,messageType){
            const messageField = document.createElement('div');
            messageField.classList.add('response-grid', 'col-span-3', 'mb-2', 'flex');

            const messageIcon = document.createElement('i');
            messageIcon.classList.add('fas', messageType === 'ai' ? 'fa-cat' : 'fa-user', 'text-black');
            messageField.appendChild(messageIcon);

            const messageText = document.createElement('p');
            messageText.classList.add('typewriter', 'pl-4');
            messageText.textContent = content;
            messageField.appendChild(messageText);

            messageField.classList.add(messageType === 'ai' ? 'ai-message' : 'user-message');

            return messageField;

    }



    function addResponseField (messageField, containerId, messageType){

        const responseField = document.getElementById(containerId);
        if (responseField) {
            const messageOrganiser = document.createElement('div');
            messageOrganiser.classList.add('response-field');

            messageOrganiser.classList.add(messageType === 'ai' ? 'ai-message' : 'user-message' );

            messageOrganiser.appendChild(messageField);

            responseField.insertBefore(messageOrganiser, responseField.firstChild);
        }

    }
