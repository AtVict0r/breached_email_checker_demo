function checkBreach() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const breachList = document.getElementById('breach-list');
    const noBreachesMessage = document.getElementById('no-breaches');
    const errorMessage = document.getElementById('error-message');

    // Clear previous results and hide messages
    breachList.innerHTML = '';
    noBreachesMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    if (!email) {
        alert('Please enter an email address.');
        return;
    }

    const apiUrl = `https://api.xposedornot.com/v1/check-email/${email}`;
    const request = new XMLHttpRequest();

    request.open('GET', apiUrl);

    request.onload = function() {
        console.log('API Response:', request.responseText); // Added console log for debugging
        
        if (request.status >= 200 && request.status < 300) {
            try {
                const response = JSON.parse(request.responseText);
                if (response && response.breaches && response.breaches.length > 0) {
                    response.breaches.forEach(breach => {
                        const listItem = document.createElement('li');
                        listItem.textContent = breach.Name;
                        breachList.appendChild(listItem);
                    });
                } else {
                    noBreachesMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                errorMessage.style.display = 'block';
            }
        } else {
            console.error('Request failed. Returned status of ' + request.status);
            errorMessage.style.display = 'block';
        }
    };

    request.onerror = function() {
        console.error('There was a network error.');
        errorMessage.style.display = 'block';
    };

    request.send();
}
