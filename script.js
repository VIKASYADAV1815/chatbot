// Select the input field where the user types their message
let promptInput = document.querySelector("#prompt"); 

// Select the button that the user clicks to send their message
let btn = document.querySelector("#btn");

// Select the container that holds the chat messages
let chatcont = document.querySelector(".chatcont"); 

// Select a parent container, likely for layout purposes
let container = document.querySelector(".container"); 

// Initialize a variable to store the user's message
let usermsg = null;

// Store the URL for the API that generates content based on user input
let Api_Url ='https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCKNXxTCl9AQucfT9QwtF6sfrHhnQ4KJMI';

// Function to create a chat box for messages
function createChatbox(html, className) {
    // Create a new div element
    let div = document.createElement("div");
    
    // Add the specified class name to the div
    div.classList.add(className); 
    
    // Set the inner HTML of the div to the provided HTML
    div.innerHTML = html;
    
    // Return the created div
    return div;
}

// Async function to get the API response
async function getApiResponse(aibox) {
    // Select the text element within the AI chat box
    let textElement = aibox.querySelector(".text");

    try {
        // Send a POST request to the API with the user's message
        let response = await fetch(Api_Url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Set the content type to JSON
            },
            body: JSON.stringify({
                "contents": [
                    {
                        "role": "user", // Specify the role as user
                        "parts": [{ text: usermsg }] // Include the user's message
                    }
                ]
            })
        });

        // Parse the JSON response from the API
        let data = await response.json();
        
        // Extract the API response text
        let ApiResponse = data?.candidates[0]?.content?.parts[0]?.text;

        // If there is a valid response, display it; otherwise, show an error message
        if (ApiResponse) {
            textElement.innerText = ApiResponse;
        } else {
            textElement.innerText = "No response from API.";
        }
    } catch (error) {
        // Log any errors that occur during the fetch
        console.log(error);
    } finally {
        // Hide the loading animation once the response is received
        aibox.querySelector(".loading").style.display = "none";
    }
}

// Function to show a loading animation for the AI response
function showLoading() {
    // Create HTML for the loading state
    let html = `<div class="img">
                    <img src="ai.png" alt="" width="50px">
                </div>
                <p class="text"></p>
                <img class="loading" src="anim.gif" alt="" height="80" width="80">`;
    
    // Create a chat box for the AI loading state
    let aiChatbox = createChatbox(html, "aibox");
    
    // Append the AI chat box to the chat container
    chatcont.appendChild(aiChatbox);
    
    // Call the function to get the API response
    getApiResponse(aiChatbox);
}

// Add an event listener to the button for click events
btn.addEventListener("click", () => {
    // Get the trimmed value of the user input
    usermsg = promptInput.value.trim();

    // If the user message is empty, do nothing and return
    if (!usermsg) {
        container.style.display = "flex"; // Show the container
        return; // Exit the function
    }

    // Hide the container if the message is valid
    container.style.display = "none";

    // Create HTML for the user message box
    let html = `<div class="img">
                   <img src="my.jpeg" alt="" width="50" style="border-radius: 50%;">
                </div>
                <p class="text"></p>`;
                
    // Create a chat box for the user message
    let userbox = createChatbox(html, "userbox");
    
    // Set the text of the user message box to the user's message
    userbox.querySelector(".text").innerText = usermsg; 
    
    // Append the user message box to the chat container
    chatcont.appendChild(userbox);
    
    // Clear the input field
    promptInput.value = ""; 
    
    // Show the loading animation after a brief delay
    setTimeout(showLoading, 500); 
});

// Optional: Add an event listener for the Enter key
promptInput.addEventListener('keypress', function(event) {
    // If the Enter key is pressed, simulate a button click
    if (event.key === 'Enter') {
        btn.click(); // Trigger the button click event
    }
});
