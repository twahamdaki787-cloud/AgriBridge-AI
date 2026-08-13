// 1. Weka API Key yako mpya hapa ndani ya quotes
const GEMINI_API_KEY = "AQ.Ab8RN6K5EpmY4hNxdI5VZTKgJTcUHzeW-t-CJRcJZQzM6TPNkA";

document.getElementById('agriForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const messageText = userInput.value.trim();

    if (messageText === '') return;

    // Onyesha ujumbe wa mtumiaji
    const userDiv = document.createElement('div');
    userDiv.classList.add('message', 'user-message');
    userDiv.textContent = messageText;
    chatBox.appendChild(userDiv);

    userInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Onyesha ujumbe wa subira
    const aiDiv = document.createElement('div');
    aiDiv.classList.add('message', 'ai-message');
    aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> <em>Inafikiria na kutafuta majibu...</em>";
    chatBox.appendChild(aiDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Tumia URL rasmi ya Google Gemini v1beta yenye gemini-1.5-flash-latest
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Wewe ni mshauri mtaalamu wa kilimo na mifugo Afrika Mashariki anayeitwa AgriBridge-AI. Jibu swali hili kwa Kiswahili fasaha, kutoa ushauri bora wa mbolea, mbegu, au masoko: ${messageText}`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            aiDiv.innerHTML = `<strong>AgriBridge AI:</strong> Hitilafu ya API (${data.error.message}). Hakikisha API Key yako iko sahihi.`;
            return;
        }

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
            let aiReply = data.candidates[0].content.parts[0].text;
            // Rekebisha muonekano wa text
            aiReply = aiReply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
            aiDiv.innerHTML = `<strong>AgriBridge AI:</strong><br>${aiReply}`;
        } else {
            aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> Samahani, sikuweza kupata jibu sahihi kwa sasa. Jaribu tena.";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> Imeshindwa kuunganisha na mtandao. Angalia bando lako.";
    }

    chatBox.scrollTop = chatBox.scrollHeight;
});

