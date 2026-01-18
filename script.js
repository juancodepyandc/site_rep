(function(){
  emailjs.init("FNOmFW1q3gEntsR0J");
})();

const SERVICE_ID = "service_8r68jtk";
const TEMPLATE_ID = "template_sd7paiv";
const TO_EMAIL = "rabuteaujuandavid@gmail.com";

function bindForm(formId, subject){
  const form = document.getElementById(formId);
  form.addEventListener("submit", function(e){
    e.preventDefault();

    const data = new FormData(form);
    let message = "";
    data.forEach((v,k)=>{ message += k + " : " + v + "\n"; });

    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      subject: subject,
      from_name: data.get("from_name"),
      reply_to: data.get("reply_to"),
      message: message,
      to_email: TO_EMAIL
    }).then(()=>{
      alert("Demande envoyée avec succès.");
      form.reset();
    }, ()=>{
      alert("Erreur lors de l'envoi.");
    });
  });
}

bindForm("form-pc","Demande devis réparation PC");
bindForm("form-mobile","Demande devis réparation mobile");
bindForm("form-contact","Demande de contact / support");
