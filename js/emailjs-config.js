/* ==========================================================================
   EMAILJS-CONFIG.JS — EmailJS credentials
   ==========================================================================
   Template: use email-templates/form-notification.html
   Preview:  open email-templates/preview.html in your browser

   EmailJS dashboard setup:
   1. Email Services → Gmail → contact.quantum-it@gmail.com
   2. Email Templates → Create template → Content → HTML editor
   3. Paste the HTML from email-templates/form-notification.html
   4. Subject:  New {{form_type}} enquiry from {{from_name}}
   5. Reply To: {{reply_to}}
   ========================================================================== */

const EMAILJS_DEFAULTS = {
  publicKey:  'YOUR_PUBLIC_KEY',
  serviceId:  'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
};

const EMAILJS_CONFIG = {
  publicKey:  'eQKLHJ_WJi01mnFYt',
  serviceId:  'service_n6ivesd',
  templateId: 'template_yafxdca',
};

function isEmailJsConfigured() {
  return typeof emailjs !== 'undefined' &&
    Object.keys(EMAILJS_DEFAULTS).every(
      (key) => EMAILJS_CONFIG[key] && EMAILJS_CONFIG[key] !== EMAILJS_DEFAULTS[key]
    );
}
