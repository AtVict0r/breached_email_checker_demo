function checkBreach() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const breachList = document.getElementById('breach-list');
    const noBreachesMessage = document.getElementById('no-breaches');
    const errorMessageElement = document.getElementById('error-message');
    const apiErrorMessageElement = document.getElementById('api-error-message');
    const apiErrorDetailsElement = document.getElementById('api-error-details');
    const invalidEmailMessage = document.getElementById('invalid-email');
    const checkButtonText = document.getElementById('check-button-text');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Clear previous results and hide messages
    breachList.innerHTML = '';
    noBreachesMessage.style.display = 'none';
    errorMessageElement.style.display = 'none';
    apiErrorMessageElement.style.display = 'none';
    invalidEmailMessage.style.display = 'none';

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        invalidEmailMessage.style.display = 'flex';
        return;
    }

    // Show loading state
    checkButtonText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';

    const apiUrl = `https://api.xposedornot.com/v1/check-email/${email}`;
    const request = new XMLHttpRequest();

    request.open('GET', apiUrl);

    request.onload = function() {
        console.log('API Response:', request.responseText);

        // Hide loading state
        checkButtonText.style.display = 'inline-block';
        loadingSpinner.style.display = 'none';

        if (request.status >= 200 && request.status < 300) {
            try {
                const response = JSON.parse(request.responseText);
                if (response && response.breaches && response.breaches.length > 0) {
                    const breachNames = response.breaches[0];
                    if (breachNames && breachNames.length > 0) {
                        breachNames.forEach(breachName => {
                            const listItem = document.createElement('li');
                            listItem.textContent = breachName;
                            breachList.appendChild(listItem);
                        });
                    } else {
                        noBreachesMessage.style.display = 'flex';
                    }
                } else {
                    noBreachesMessage.style.display = 'flex';
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                errorMessageElement.style.display = 'flex';
            }
        } else {
            console.error('Request failed. Returned status of ' + request.status);
            apiErrorMessageElement.style.display = 'flex';
            apiErrorDetailsElement.textContent = `Status: ${request.status}`;
            if (request.responseText) {
                try {
                    const errorResponse = JSON.parse(request.responseText);
                    if (errorResponse && errorResponse.message) {
                        apiErrorDetailsElement.textContent += ` - ${errorResponse.message}`;
                    }
                } catch (parseError) {
                    apiErrorDetailsElement.textContent += ` - ${request.statusText}`;
                }
            } else {
                apiErrorDetailsElement.textContent += ` - ${request.statusText}`;
            }
        }
    };

    request.onerror = function() {
        console.error('There was a network error.');
        // Hide loading state
        checkButtonText.style.display = 'inline-block';
        loadingSpinner.style.display = 'none';
        errorMessageElement.style.display = 'flex';
    };

    request.send();
}
