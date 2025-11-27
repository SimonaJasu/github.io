// custom.js
// Kontaktų forma su validacija, telefono numerio tikrinimu (pradžia +370 ir 11 skaitmenų), rezultatų atvaizdavimu, vidurkiu ir pop-up pranešimu

document.addEventListener('DOMContentLoaded', () => {
    const contactSection = document.getElementById('contact');
    contactSection.innerHTML = '';

    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = 'Kontaktų forma';
    contactSection.appendChild(sectionTitle);

    const form = document.createElement('form');
    form.id = 'contactForm';
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '15px';
    form.style.maxWidth = '400px';
    form.style.margin = '0 auto';
    form.style.padding = '20px';
    form.style.border = '1px solid #ccc';
    form.style.borderRadius = '10px';
    form.style.backgroundColor = '#f9f9f9';

    const personalFields = [
        {label: 'Vardas', id: 'firstName', type: 'text', validate: value => /^[A-Za-z]+$/.test(value), errorMsg: 'Vardas turi būti tik iš raidžių'},
        {label: 'Pavardė', id: 'lastName', type: 'text', validate: value => /^[A-Za-z]+$/.test(value), errorMsg: 'Pavardė turi būti tik iš raidžių'},
        {label: 'El. paštas', id: 'email', type: 'email', validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), errorMsg: 'Neteisingas el. pašto formatas'},
        {label: 'Telefono numeris', id: 'phone', type: 'tel', validate: value => value.startsWith('+370') && value.replace(/\D/g,'').length === 11, errorMsg: 'Telefono numeris turi prasidėti "+370" ir turėti 11 skaitmenų'}
    ];

    personalFields.forEach(f => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';

        const label = document.createElement('label');
        label.htmlFor = f.id;
        label.textContent = f.label + ':';
        label.style.marginBottom = '5px';

        const input = document.createElement('input');
        input.type = f.type;
        input.id = f.id;
        input.name = f.id;
        input.required = true;
        input.style.padding = '8px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '5px';

        const errorText = document.createElement('small');
        errorText.style.color = 'red';
        errorText.style.display = 'none';
        errorText.textContent = f.errorMsg || 'Laukas negali būti tuščias';
        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(errorText);
        form.appendChild(container);

        input.addEventListener('input', () => {
            if(f.id === 'phone') {
                const val = input.value.trim();
                if(f.validate(val)) {
                    input.style.borderColor = '#ccc';
                    errorText.style.display = 'none';
                } else {
                    input.style.borderColor = 'red';
                    errorText.style.display = 'block';
                }
                return;
            }
            if(f.validate(input.value)) {
                input.style.borderColor = '#ccc';
                errorText.style.display = 'none';
            } else {
                input.style.borderColor = 'red';
                errorText.style.display = 'block';
            }
        });
    });

    const h3 = document.createElement('h3');
    h3.textContent = 'Vertinimo klausimai (1-10):';
    form.appendChild(h3);

    const questions = ['Kaip įvertintumėte svetainės funkcionalumą ir stabilumą?', 'Kaip lengva buvo surasti reikiamą informaciją svetainėje?', 'Kaip vertinate svetainės vizualinį dizainą ir estetiką?'];

    questions.forEach((q, index) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';
        container.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.htmlFor = 'q' + (index+1);
        label.textContent = q + ':';
        label.style.flex = '1';

        const input = document.createElement('input');
        input.type = 'range';
        input.id = 'q' + (index+1);
        input.name = 'q' + (index+1);
        input.min = 1;
        input.max = 10;
        input.value = 5;
        input.style.flex = '2';

        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = '5';
        valueDisplay.style.width = '25px';
        valueDisplay.style.textAlign = 'center';
        input.addEventListener('input', () => { valueDisplay.textContent = input.value; });

        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(valueDisplay);
        form.appendChild(container);
    });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Submit';
    submitBtn.style.padding = '10px';
    submitBtn.style.border = 'none';
    submitBtn.style.borderRadius = '5px';
    submitBtn.style.backgroundColor = '#007BFF';
    submitBtn.style.color = '#fff';
    submitBtn.style.cursor = 'pointer';
    form.appendChild(submitBtn);

    contactSection.appendChild(form);

    const resultDiv = document.createElement('div');
    resultDiv.id = 'formResults';
    resultDiv.style.marginTop = '20px';
    resultDiv.style.padding = '15px';
    resultDiv.style.border = '1px solid #007BFF';
    resultDiv.style.borderRadius = '10px';
    resultDiv.style.backgroundColor = '#e6f0ff';
    contactSection.appendChild(resultDiv);

    const popupMsg = document.createElement('div');
    popupMsg.id = 'popupMessage';
    popupMsg.style.position = 'fixed';
    popupMsg.style.top = '20px';
    popupMsg.style.right = '20px';
    popupMsg.style.padding = '15px 25px';
    popupMsg.style.backgroundColor = '#28a745';
    popupMsg.style.color = '#fff';
    popupMsg.style.borderRadius = '8px';
    popupMsg.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    popupMsg.style.display = 'none';
    popupMsg.style.zIndex = '1000';
    popupMsg.textContent = 'Duomenys pateikti sėkmingai!';
    document.body.appendChild(popupMsg);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        personalFields.forEach(f => {
            if(!f.validate(document.getElementById(f.id).value)) valid = false;
        });
        if(!valid) return;

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });
        console.log('Formos duomenys:', data);

        const avg = ((parseFloat(data.q1) + parseFloat(data.q2) + parseFloat(data.q3)) / 3).toFixed(1);

        resultDiv.innerHTML = '<h3>Jūsų įvesti duomenys:</h3>' +
                              `<p><strong>Vardas:</strong> ${data.firstName}</p>` +
                              `<p><strong>Pavardė:</strong> ${data.lastName}</p>` +
                              `<p><strong>El. paštas:</strong> ${data.email}</p>` +
                              `<p><strong>Telefono numeris:</strong> ${data.phone}</p>` +
                              `<p><strong>Klausimas 1:</strong> ${data.q1}</p>` +
                              `<p><strong>Klausimas 2:</strong> ${data.q2}</p>` +
                              `<p><strong>Klausimas 3:</strong> ${data.q3}</p>` +
                              `<p><strong>Vidurkis:</strong> ${data.firstName} ${data.lastName}: ${avg}</p>`;

        popupMsg.style.display = 'block';
        setTimeout(() => { popupMsg.style.display = 'none'; }, 3000);
        form.reset();
        for(let i = 1; i <= 3; i++) {
            const slider = document.getElementById('q' + i);
            slider.value = 5;
            slider.nextSibling.textContent = '5';
        }
    });

    console.log('custom.js sėkmingai įkeltas!');
});
