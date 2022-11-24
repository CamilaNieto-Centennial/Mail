document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      // Create div for each email
      emails.forEach(email => {
        console.log(email)
        let newEmail = document.createElement('div');

        // If email is unread set background to white, else to gray
        if (email.read === false) {
          newEmail.className = 'alert alert-light';
        }
        else {
          newEmail.className = 'alert alert-dark';
        }
        
        // Personalized styles
        newEmail.style.color = 'black';
        newEmail.style.borderColor = 'black';
        newEmail.style.borderWidth = '2px';

        // Contents of the div
        newEmail.innerHTML = 
        `<h5 style="color: Navy">${email.sender}</h5>
         <p><strong>${email.subject}</strong></p>
         <p>${email.timestamp}</p>
          `

        // Click event to check the new email
        newEmail.addEventListener('click', function() {
            console.log('This element has been clicked!')
        });
        
        document.querySelector('#emails-view').append(newEmail);
      });

      

    });
}

// Send Email from 'Compose' page
function send_email(event) {
  event.preventDefault();

  // Get values submitted
  let recipients = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value;
  let body = document.querySelector('#compose-body').value;

  // Send email using the POST request to /emails route
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);

      // Redirect to the sent page
      load_mailbox('sent')
    });

  console.log(recipients);
  console.log(subject);
  console.log(body);
}

// 
function a() {

}