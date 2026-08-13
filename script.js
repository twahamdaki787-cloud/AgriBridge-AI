document.getElementById('agriForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // 1. Chukua API Key kutoka kwenye Input Box
    let userApiKey = document.getElementById('apiKeyInput')?.value.trim();

    // Kama aliweka mwanzo, i-save kwenye browser (localStorage)
    if (userApiKey) {
        localStorage.setItem('my_gemini_key', userApiKey);
    } else {
        userApiKey = localStorage.getItem('my_gemini_key');
    }

    if (!userApiKey) {
        alert("Tafadhali weka Gemini API Key yako kwenye kisanduku cha juu kwanza!");
        return;
    }

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

    try {
        // Hili ndilo jina la model na URL sahihi 100%
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${userApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Wewe ni mshauri mtaalamu wa kilimo na mifugo Afrika Mashariki anayeitwa AgriBridge-AI. Jibu swali hili kwa Kiswahili fasaha: ${messageText}`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            aiDiv.innerHTML = `<strong>AgriBridge AI:</strong> Hitilafu ya API: ${data.error.message}`;
            return;
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let aiReply = data.candidates[0].content.parts[0].text;
            aiReply = aiReply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
            aiDiv.innerHTML = `<strong>AgriBridge AI:</strong><br>${aiReply}`;
        } else {
            aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> Sikuweza kupata jibu. Jaribu tena.";
        }
    } catch (error) {
        aiDiv.innerHTML = "<strong>AgriBridge AI:</strong> Hitilafu ya mtandao.";
    }

    chatBox.scrollTop = chatBox.scrollHeight;
});
