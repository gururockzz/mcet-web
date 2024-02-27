class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatbox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };
        this.state = false;
        this.messages = [];
    }

    
    

    display() {
        const { openButton, chatbox, sendButton } = this.args;
            
        openButton.addEventListener('click', () => this.toggleState(chatbox));
        sendButton.addEventListener('click', () => this.onSendButton(chatbox));
            
        const node = chatbox.querySelector('input');
        node.addEventListener('keyup', ({ key }) =>  {
            if (key === "Enter") {
                this.onSendButton(chatbox);
            }
        });
    }  
    
    toggleState(chatbox) {
        this.state = !this.state;
    
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }
    
    onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        const text1 = textField.value;
        
        if (text1 === "") {
            return;
        }
    
        const msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);
    
        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(response => {
            const msg2 = { name: "iris", message: response.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            textField.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            textField.value = '';
        });
    }

    updateChatText(chatbox) {
        let html = '';
        this.messages.slice().reverse().forEach(item => {
            const messageClass = item.name === "iris" ? 'messages__item--visitor' : 'messages__item--operator';
            html += `<div class="messages__item ${messageClass}">${item.message}</div>`;
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();
'use strict';

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function
const modalCloseFunc = function () { modal.classList.add('closed') }

// modal eventListener
modalCloseOverlay.addEventListener('click', modalCloseFunc);
modalCloseBtn.addEventListener('click', modalCloseFunc);





// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
  notificationToast.classList.add('closed');
});





// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

  // mobile menu function
  const mobileMenuCloseFunc = function () {
    mobileMenu[i].classList.remove('active');
    overlay.classList.remove('active');
  }

  mobileMenuOpenBtn[i].addEventListener('click', function () {
    mobileMenu[i].classList.add('active');
    overlay.classList.add('active');
  });

  mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  overlay.addEventListener('click', mobileMenuCloseFunc);

}





// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {

    const clickedBtn = this.nextElementSibling.classList.contains('active');

    for (let i = 0; i < accordion.length; i++) {

      if (clickedBtn) break;

      if (accordion[i].classList.contains('active')) {

        accordion[i].classList.remove('active');
        accordionBtn[i].classList.remove('active');

      }

    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');

  });

}




