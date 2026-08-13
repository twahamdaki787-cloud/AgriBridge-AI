// Weka Gemini API Key yako hapa ndani ya alama za nukuu
const GEMINI_API_KEY = "WEKA_API_KEY_YAKO_HAPA";

document.getElementById('agriForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const messageText = userInput.value.trim();

    if (messageText === '') return;

    // 1. Onyesha Ujumbe wa Mtumiaji
    const userDiv = document.createElement('div');
    userDiv.classList.add('message', 'user-message');
    userDiv.textContent = messageText;
    chatBox.appendChild(userDiv);

    userInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Onyesha Ujumbe wa Subira (Loading...)
    const aiDiv = document.createElement('div');
    aiDiv.classList.add('message', 'ai-message');
    aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> <em>Inafikiria na kutafuta majibu...</em>";
    chatBox.appendChild(aiDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. Tuma Swali Kwenye Gemini AI API
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Wewe ni mshauri wa kilimo na mifugo Afrika Mashariki anayeitwa AgriBridge-AI. Jibu swali hili kwa Kiswahili fasaha, kwa kutoa ushauri sahihi na wa kitaalamu wa kilimo/mifugo: ${messageText}`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let aiReply = data.candidates[0].content.parts[0].text;
            // Badilisha nyota za markdown kuwa vianzio vya mistari vizuri
            aiReply = aiReply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
            aiDiv.innerHTML = `<strong>AgriBridge AI:</strong><br>${aiReply}`;
        } else {
            aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> Samahani, sikuweza kupata jibu kwa sasa. Jaribu tena.";
        }
    } catch (error) {
        console.error(error);
        aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> Kuna hitilafu ya mtandao au API Key haiko sahihi.";
    }

    chatBox.scrollTop = chatBox.scrollHeight;
});

