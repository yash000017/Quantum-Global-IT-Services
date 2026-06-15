/* ==========================================================================
   FORM-VALIDATION.JS — Themed client-side validation for data-form
   ========================================================================== */

class FormValidation {
  static init() {
    document.querySelectorAll('[data-form]').forEach(form => {
      form.setAttribute('novalidate', '');
      FormValidation.markRequiredLabels(form);

      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', () => FormValidation.validateField(field));
        field.addEventListener('change', () => FormValidation.validateField(field));
        field.addEventListener('blur', () => {
          if (form.classList.contains('was-validated') || field.closest('.form-group')?.classList.contains('is-invalid')) {
            FormValidation.validateField(field, { show: true });
          }
        });
      });

      form.addEventListener('reset', () => {
        requestAnimationFrame(() => {
          form.classList.remove('was-validated');
          FormValidation.clearForm(form);
        });
      });
    });
  }

  static markRequiredLabels(form) {
    form.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
      const group = field.closest('.form-group');
      const label = group?.querySelector('.form-label');
      if (!label || label.querySelector('.form-required')) return;

      const labelText = label.textContent.trim().replace(/\s*\*$/, '');
      label.textContent = labelText;

      const mark = document.createElement('span');
      mark.className = 'form-required';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = ' *';
      label.appendChild(mark);
    });
  }

  static validateForm(form) {
    const fields = [...form.querySelectorAll('input, textarea, select')];
    let firstInvalid = null;

    fields.forEach(field => {
      const valid = FormValidation.validateField(field, { show: true });
      if (!valid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      form.classList.add('was-validated');
      const target = FormValidation.getFocusTarget(firstInvalid);
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.focus({ preventScroll: true });
      return false;
    }

    form.classList.remove('was-validated');
    return true;
  }

  static validateField(field, { show = false } = {}) {
    const group = field.closest('.form-group');
    if (!group) return field.checkValidity();

    const shouldShow = show || group.classList.contains('is-invalid');

    if (field.checkValidity()) {
      FormValidation.clearField(field);
      return true;
    }

    if (shouldShow) {
      FormValidation.setInvalid(field, FormValidation.getMessage(field));
    }

    return false;
  }

  static getMessage(field) {
    const { validity } = field;

    if (validity.valueMissing) {
      if (field.tagName === 'SELECT') return 'Please select an option.';
      return 'This field is required.';
    }
    if (validity.typeMismatch) {
      if (field.type === 'email') return 'Please enter a valid email address.';
      if (field.type === 'url') return 'Please enter a valid URL.';
      return 'Please enter a valid value.';
    }
    if (validity.tooShort) {
      return `Please enter at least ${field.minLength} characters.`;
    }
    if (validity.tooLong) {
      return `Please enter no more than ${field.maxLength} characters.`;
    }
    if (validity.patternMismatch) return 'Please match the requested format.';
    if (validity.rangeUnderflow) return `Value must be at least ${field.min}.`;
    if (validity.rangeOverflow) return `Value must be no more than ${field.max}.`;

    return field.validationMessage || 'Please check this field.';
  }

  static setInvalid(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;

    group.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');

    const customSelect = field.closest('.custom-select');
    if (customSelect) {
      customSelect.classList.add('is-invalid');
      const trigger = customSelect.querySelector('.custom-select__trigger');
      if (trigger) trigger.setAttribute('aria-invalid', 'true');
    }

    let error = group.querySelector('.form-error');
    if (!error) {
      error = document.createElement('p');
      error.className = 'form-error';
      error.setAttribute('role', 'alert');
      group.appendChild(error);
    }

    const errorId = error.id || `error-${FormValidation.uid()}`;
    error.id = errorId;
    error.textContent = message;

    field.setAttribute('aria-describedby', errorId);
    const trigger = customSelect?.querySelector('.custom-select__trigger');
    if (trigger) trigger.setAttribute('aria-describedby', errorId);
  }

  static clearField(field) {
    const group = field.closest('.form-group');
    if (!group) return;

    group.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');

    const customSelect = field.closest('.custom-select');
    if (customSelect) {
      customSelect.classList.remove('is-invalid');
      const trigger = customSelect.querySelector('.custom-select__trigger');
      if (trigger) {
        trigger.removeAttribute('aria-invalid');
        trigger.removeAttribute('aria-describedby');
      }
    }

    group.querySelector('.form-error')?.remove();
  }

  static clearForm(form) {
    form.querySelectorAll('input, textarea, select').forEach(field => {
      FormValidation.clearField(field);
    });
  }

  static getFocusTarget(field) {
    if (field.matches('select.form-select')) {
      return field.closest('.custom-select')?.querySelector('.custom-select__trigger') || field;
    }
    return field;
  }

  static uid() {
    return Math.random().toString(36).slice(2, 9);
  }
}
