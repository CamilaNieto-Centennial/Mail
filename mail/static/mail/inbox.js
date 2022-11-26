document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email('New Email'));

  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email(section, email) {
  document.querySelector('#section').innerHTML = section;

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  if(section === "Reply") {
    console.log("body from Compose: " + email.body);
    document.querySelector('#compose-recipients').value = email.sender;
    let topic = email.subject;
    // If topic didn't start with 'Re:', then display it at the beggining
    if(topic.split(' ', 1)[0] != 'Re:') {
      topic = 'Re: ' + topic;
    }
    document.querySelector('#compose-subject').value = topic;
    document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
  }
}



function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'none';

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

        // View button created and added to the new email
        let viewButton = document.createElement('button');
        viewButton.className = "btn btn-primary";
        viewButton.dataset.email = email.id;
        viewButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-open-fill" viewBox="0 0 16 16">
            <path d="M8.941.435a2 2 0 0 0-1.882 0l-6 3.2A2 2 0 0 0 0 5.4v.314l6.709 3.932L8 8.928l1.291.718L16 5.714V5.4a2 2 0 0 0-1.059-1.765l-6-3.2ZM16 6.873l-5.693 3.337L16 13.372v-6.5Zm-.059 7.611L8 10.072.059 14.484A2 2 0 0 0 2 16h12a2 2 0 0 0 1.941-1.516ZM0 13.373l5.693-3.163L0 6.873v6.5Z"/>
          </svg>
          View
        `;
        viewButton.style.margin = '0em .5em 0em 0em';
        newEmail.appendChild(viewButton)


        // Contents of the div for Inbox
        if (mailbox === 'inbox') {
          // If email is NOT archived...
          if (email.archived === false) {
            // Create and Add Archive button to the 'div'
            let archiveButton = document.createElement('button');
            archiveButton.className = "btn btn-success";
            archiveButton.dataset.email = email.id
            archiveButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
                <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
              </svg>
              Archive
            `;
            newEmail.appendChild(archiveButton)

            //If Archive button is clicked, set 'archived' property to true
            archiveButton.addEventListener('click', function() {
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                  archived: true
                })
              })
              .then(() => { load_mailbox('archive') })
            })

          }
          
          
        }

        // Contents of the div for Archive
        else if (mailbox === 'archive') {
          // If email is archived...
          if (email.archived === true) {
            // Create and Add Unarchive button to the 'div'
            let unarchiveButton = document.createElement('button');
            unarchiveButton.className = "btn btn-danger";
            unarchiveButton.dataset.email = email.id
            unarchiveButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
                <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
              </svg>
              Unarchive
            `;
            newEmail.appendChild(unarchiveButton)

            //If Unarchive button is clicked, set 'archived' property to false
            unarchiveButton.addEventListener('click', function() {
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                  archived: false
                })
              })
              .then(() => { load_mailbox('archive') })
            })

          }
          
          
        }




        // If user clicks on the 'View' button...
        viewButton.addEventListener('click', function () {
          //console.log('This element has been clicked!')
          fetch(`/emails/${email.id}`)
            .then(response => response.json())
            .then(email => {
              // Print email
              console.log(email);

              // Get values of that new email
              let sender = email.sender;
              let recipients = email.recipients;
              let subject = email.subject;
              let timestamp = email.timestamp;
              let body = email.body;

              // Display on the page those values
              single_email(sender, recipients, subject, timestamp, body);

              // Set 'read' property to true, after user clicked the email
              if (email.read === false) {
                fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    read: true
                  })
                })
              }

              // Archive/Unarchive button
              const button = document.createElement('button');
              button.innerHTML = () => { if (email.archived === false) { "Archive" } else { "Unarchive" } }
              button.addEventListener('click', function () {
                console.log('This button has been clicked!')
              });

              
              // If Reply button is clicked, then call the compose form...
              let replyButton = document.querySelector('#email-replyButton');
              replyButton.addEventListener('click', function() {
                console.log('Reply button has been clicked!')
                compose_email("Reply", email);
              });

            });
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

// View Email Feature
function single_email(sender, recipients, subject, timestamp, body) {
  // Show email content and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'block';

  // Initialize ids' to values of: sender, recipients, subject, timestamp, and body
  document.querySelector('#email-sender').textContent = sender;
  document.querySelector('#email-recipients').textContent = recipients;
  document.querySelector('#email-subject').textContent = subject;
  document.querySelector('#email-timestamp').textContent = timestamp;
  document.querySelector('#email-body').textContent = body;
}

