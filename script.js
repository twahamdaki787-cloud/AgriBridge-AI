// Weka Gemini API Key yako hapa ndani ya alama za nukuu
const GEMINI_API_KEY = "AQ.Ab8RN6K958c1Qaa5kdQ4FmVeoR9Z60fJXHl9Ys8wvmOYKmwA6w";

document.getElementById('agriForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const messageText = userInput.value.trim();

    if (messageText === '') return;

    // 1. Onyesha ujumbe wa mtumiaji
    const userDiv = document.createElement('div');
    userDiv.classList.add('message', 'user-message');
    userDiv.textContent = messageText;
    chatBox.appendChild(userDiv);

    userInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Onyesha ujumbe wa subira
    const aiDiv = document.createElement('div');
    aiDiv.classList.add('message', 'ai-message');
    aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> <em>Inafikiria na kutafuta majibu...</em>";
    chatBox.appendChild(aiDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. Tuma ombi kwenda Gemini API
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Wewe ni mshauri mtaalamu wa kilimo na mifugo Afrika Mashariki anayeitwa AgriBridge-AI. Jibu swali hili kwa Kiswahili fasaha na kinachoeleweka vizuri: ${messageText}`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Kama kuna kosa lililorereshwa na Google API
        if (data.error) {
            console.error("Gemini API Error:", data.error);
            aiDiv.innerHTML = `<strong>AgriBridge AI:</strong> Hitilafu ya API (${data.error.message || 'Key haijatambuliwa'}). Hakikisha API Key iko sahihi.`;
            return;
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let aiReply = data.candidates[0].content.parts[0].text;
            aiReply = aiReply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
            aiDiv.innerHTML = `<strong>AgriBridge AI:</strong><br>${aiReply}`;
        } else {
            aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> Samahani, sikuweza kupata jibu sahihi. Jaribu tena.";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> Imeshindwa kuunganisha na mtandao. Angalia bando au API Key yako.";
    }

    chatBox.scrollTop = chatBox.scrollHeight;
});

docu
