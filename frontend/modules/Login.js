import validator from 'validator'


export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);

        this.init();
    }
    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener("submit", e => {
            e.preventDefault();

            this.validate(e)
        });
    }

    validate(e) {

      const el = e.target
      const emailInput = el.querySelector('input[name="email"]');
      const passwordInput = el.querySelector('input[name="password"]');
      let error = false

      if (!validator.isEmail(emailInput.value)) {
        const emailError = el.querySelector('#emailHelp')
        emailError.classList.add('text-danger')
        emailError.textContent = "Invalid E-mail"

        error = true
      }


      if (passwordInput.value.length < 4 || passwordInput.value.length > 20) {
        const passowrdError = el.querySelector('#passwordHelp')
        passowrdError.classList.add('text-danger')
        passowrdError.textContent = "Invalid Password"

        error = true
      }

      if (!error) el.submit()
    }
}
