const prompt = document.getElementById('prompt');
const location = document.getElementById('location');
const typeTrip = document.getElementById('typeTrip');
const replyField = document.getElementById('replyField');
const sendButton = document.getElementById('send-button');
const replyUser = document.getElementById('replyUser');
const container3 = document.getElementById('container3');





    document.addEventListener('keydown', function (event) {
        // Check if the pressed key is Enter (key code 13)
        if (event.key === 'Enter') {
            // Call the retrieveMessage function
            retrieveMessage();
        }
    });

    async function retrieveMessage() {
        container3.style.display = 'none';
        sendButton.style.display = 'none';
        location.style.display = 'none';

        try{
            const responsBot = await sendChatMessage(
                prompt.value,
                location.value,
                replyUser.value,
                typeTrip.value,
            );

            prompt.value = '';
            location.value = '';
            replyUser.value = '';
            typeTrip.value = '';

        };

    }

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await suggestionsReply();
        }catch (e) {
            console.error('does not work', e)
        }
    });



async function sendChatMessage(message, gender, userLocation, userReply) {
    try {
        const userPrompt = `message: ${message}, gender: ${gender}, userLocation: ${userLocation}, reply: ${userReply}`;
        const response = await fetch('http://localhost:8001/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userPrompt: userPrompt}),
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


