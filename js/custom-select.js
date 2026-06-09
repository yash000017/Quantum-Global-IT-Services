/* ==========================================================================
   CUSTOM-SELECT.JS — Accessible themed dropdown for native <select>
   ========================================================================== */

class CustomSelect {
  static instances = [];

  constructor(selectEl) {
    this.select = selectEl;
    this.options = [...selectEl.options].filter(opt => !opt.disabled || opt.value !== '');
    this.placeholder = selectEl.querySelector('option[value=""]')?.textContent.trim() || 'Select…';
    this.isOpen = false;
    this.focusIndex = -1;

    this.build();
    this.syncFromNative();
    this.bindEvents();
    CustomSelect.instances.push(this);
  }

  static initAll() {
    document.querySelectorAll('select.form-select').forEach(el => {
      if (!el.closest('.custom-select')) {
        new CustomSelect(el);
      }
    });
  }

  static closeAll(except) {
    CustomSelect.instances.forEach(instance => {
      if (instance !== except) instance.close();
    });
  }

  build() {
    const group = this.select.closest('.form-group');
    const label = group?.querySelector('.form-label');
    const uid = `custom-select-${Math.random().toString(36).slice(2, 9)}`;

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'custom-select';

    this.trigger = document.createElement('button');
    this.trigger.type = 'button';
    this.trigger.className = 'custom-select__trigger form-input';
    this.trigger.id = uid;
    this.trigger.setAttribute('aria-haspopup', 'listbox');
    this.trigger.setAttribute('aria-expanded', 'false');

    if (label) {
      if (!label.id) label.id = `${uid}-label`;
      this.trigger.setAttribute('aria-labelledby', label.id);
    }

    this.labelEl = document.createElement('span');
    this.labelEl.className = 'custom-select__label';
    this.labelEl.textContent = this.placeholder;

    this.chevron = document.createElement('span');
    this.chevron.className = 'custom-select__chevron';
    this.chevron.setAttribute('aria-hidden', 'true');
    this.chevron.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;

    this.trigger.append(this.labelEl, this.chevron);

    this.menu = document.createElement('ul');
    this.menu.className = 'custom-select__menu';
    this.menu.setAttribute('role', 'listbox');
    this.menu.setAttribute('tabindex', '-1');
    this.menu.hidden = true;

    if (this.select.required) {
      this.menu.setAttribute('aria-required', 'true');
    }

    this.optionEls = this.options
      .filter(opt => opt.value !== '')
      .map(opt => {
        const li = document.createElement('li');
        li.className = 'custom-select__option';
        li.setAttribute('role', 'option');
        li.dataset.value = opt.value;
        li.textContent = opt.textContent.trim();
        if (opt.selected && opt.value !== '') {
          li.setAttribute('aria-selected', 'true');
          li.classList.add('is-selected');
        } else {
          li.setAttribute('aria-selected', 'false');
        }
        this.menu.appendChild(li);
        return li;
      });

    this.select.classList.add('custom-select__native');
    this.select.setAttribute('tabindex', '-1');
    this.select.setAttribute('aria-hidden', 'true');

    const parent = this.select.parentNode;
    parent.insertBefore(this.wrapper, this.select);
    this.wrapper.append(this.select, this.trigger, this.menu);
  }

  bindEvents() {
    this.trigger.addEventListener('click', () => this.toggle());
    this.trigger.addEventListener('keydown', (e) => this.onTriggerKeydown(e));

    this.menu.addEventListener('keydown', (e) => this.onMenuKeydown(e));

    this.optionEls.forEach((el, index) => {
      el.addEventListener('click', () => this.selectOption(index));
      el.addEventListener('mouseenter', () => this.setFocusIndex(index));
    });

    document.addEventListener('click', (e) => {
      if (!this.wrapper.contains(e.target)) this.close();
    });

    this.select.form?.addEventListener('reset', () => {
      requestAnimationFrame(() => this.syncFromNative());
    });

    this.select.addEventListener('change', () => this.syncFromNative());
  }

  onTriggerKeydown(e) {
    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        this.open();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.open();
        this.setFocusIndex(0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.open();
        this.setFocusIndex(this.optionEls.length - 1);
        break;
      default:
        break;
    }
  }

  onMenuKeydown(e) {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.close();
        this.trigger.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.setFocusIndex(Math.min(this.focusIndex + 1, this.optionEls.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.setFocusIndex(Math.max(this.focusIndex - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.focusIndex >= 0) this.selectOption(this.focusIndex);
        break;
      case 'Tab':
        this.close();
        break;
      default:
        break;
    }
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    CustomSelect.closeAll(this);
    this.isOpen = true;
    this.wrapper.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');
    this.menu.hidden = false;

    const selectedIndex = this.optionEls.findIndex(el => el.classList.contains('is-selected'));
    this.setFocusIndex(selectedIndex >= 0 ? selectedIndex : 0);
    this.menu.focus();
  }

  close() {
    this.isOpen = false;
    this.wrapper.classList.remove('is-open');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.menu.hidden = true;
    this.clearFocus();
  }

  setFocusIndex(index) {
    this.focusIndex = index;
    this.optionEls.forEach((el, i) => {
      el.classList.toggle('is-focused', i === index);
    });
    this.optionEls[index]?.scrollIntoView({ block: 'nearest' });
  }

  clearFocus() {
    this.focusIndex = -1;
    this.optionEls.forEach(el => el.classList.remove('is-focused'));
  }

  selectOption(index) {
    const el = this.optionEls[index];
    if (!el) return;

    const value = el.dataset.value;
    this.select.value = value;
    this.select.dispatchEvent(new Event('change', { bubbles: true }));

    this.syncFromNative();
    this.close();
    this.trigger.focus();
  }

  syncFromNative() {
    const value = this.select.value;
    const hasValue = value !== '';

    this.labelEl.textContent = hasValue
      ? this.select.selectedOptions[0]?.textContent.trim()
      : this.placeholder;

    this.trigger.classList.toggle('is-placeholder', !hasValue);

    this.optionEls.forEach(el => {
      const selected = el.dataset.value === value;
      el.classList.toggle('is-selected', selected);
      el.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }
}
