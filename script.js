document.getElementById('agriForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const messageText = userInput.value.trim();

    if (messageText === '') return;

    // 1. Onyesha Ujumbe wa Mtumiaji (User)
    const userDiv = document.createElement('div');
    userDiv.classList.add('message', 'user-message');
    userDiv.textContent = messageText;
    chatBox.appendChild(userDiv);

    // Safisha Input Box
    userInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Weka Ujumbe wa Mfumo Unao-process (Loading...)
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'ai-message');
    loadingDiv.textContent = 'AgriBridge AI inafikiria...';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. Simulated Response (Hapa unaweza kuunganisha na Gemini API Key yako)
    setTimeout(() => {
        loadingDiv.innerHTML = `<strong>AgriBridge AI:</strong> Asante kwa swali lako kuhusu "<em>${messageText}</em>". Mfumo wetu wa AI unapendekeza kufuata mbinu za kisasa za udongo na matumizi sahihi ya mbolea.`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1500);
});

