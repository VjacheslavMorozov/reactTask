import jqueryUiGenerationBlocks from './jqueryUiGenerationBlocks';
import {openDialog} from './jqueryUiGenerationBlocks';
import {
    onEmail,
    onEmpty,
    onPassword,
    onCheckSelect,
    checkFieldset,
    onDate,
    onValidTextWithoutQuotes,
    sendForm
} from "./validator";

const form = document.querySelector('.js-form');

const firstNameInput = form.querySelector('.js-first-name-input');
const lastNameInput = form.querySelector('.js-last-name-input');
const birthdayInput = form.querySelector('.js-birthday-input');
const fieldsetBlock = form.querySelector('.js-fields-container');
const countryInput = form.querySelector('.js-country-select');
const emailInput = form.querySelector('.js-Email');
const passwordInput = form.querySelector('.js-Password');
const listOfSexInputs = Array.from(form.querySelectorAll('.js-radio-check'));
const addressInput = form.querySelector('.js-address');
const textAreaInput = form.querySelector('.js-text-area');


const showErrorMassage = (input, validationResult) => {
    const inputContainer = input.closest('.js-input-container');
    const inputErrorMassage = inputContainer.querySelector('.js-error');
    inputErrorMassage.textContent = validationResult.errorMessage;
    input.classList.toggle('active', validationResult.error);
    inputErrorMassage.classList.toggle('active', validationResult.error);
};

const formValidation = () => {
    const resultValidationFirstName = onEmpty(firstNameInput.value, firstNameInput.getAttribute('data-field-name'));
    const resultValidationLastName = onEmpty(lastNameInput.value, lastNameInput.getAttribute('data-field-name'));
    const resultValidationEmail = onEmail(emailInput.value, emailInput.getAttribute('data-field-name'));
    const resultValidationPassword = onPassword(passwordInput.value, passwordInput.getAttribute('data-field-name'));
    const resultValidationAddress = onPassword(addressInput.value, passwordInput.getAttribute('data-field-name'));
    const resultValidationCounty = onCheckSelect(countryInput.value, "");
    const resultValidationDate = onDate(birthdayInput.value, birthdayInput.getAttribute('data-field-name'));
    const resultValidationFieldSet = checkFieldset(listOfSexInputs);
    const resultValidationTextArea = onValidTextWithoutQuotes(textAreaInput.value, textAreaInput.getAttribute('data-field-name'));

    showErrorMassage(firstNameInput, resultValidationFirstName);
    showErrorMassage(lastNameInput, resultValidationLastName);
    showErrorMassage(emailInput, resultValidationEmail);
    showErrorMassage(passwordInput, resultValidationPassword);
    showErrorMassage(addressInput, resultValidationAddress);
    showErrorMassage(countryInput, resultValidationCounty);
    showErrorMassage(fieldsetBlock, resultValidationFieldSet);
    showErrorMassage(birthdayInput, resultValidationDate);
    showErrorMassage(textAreaInput, resultValidationTextArea);

};

const checkFullFormValidation = () => {
    const arrayOfAllErorsContainers = Array.from(document.querySelectorAll('.js-error'));
    const isFormDataValid = !arrayOfAllErorsContainers.some(elem => elem.classList.contains('active'));
    return isFormDataValid;
};


form.addEventListener('submit', (event) => {
    event.preventDefault();
    formValidation();
    if(checkFullFormValidation()){
        sendForm({
            url: 'http://test',
            body: new FormData(form),
            datatype: 'json',
        });
        openDialog();
    }


});


