export default class CustomSelect {
  constructor(optionsElement){
    this.optionsElement = optionsElement;

  }
  handleOptionChange(e){
    const price = usdConversions[e.target.value];
    document.querySelector('label[for="local_price"]').innerText = e.target.value.toUpperCase();
    updateCurrency({ price });
  }
  handleClick(e){
    e.target.querySelector('.arrow').classList.toggle('arrow--open');
    e.target.querySelector('.custom-select__options').classList.toggle('open');
  }
  addAllOptions(){
    Object.keys(currencies).forEach(key => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('custom-option');
      if(key === 'ves') optionElement.classList.add('selected');
      optionElement.dataset.value = key;
      optionElement.innerText = currencies[key];
      this.optionsElement.append(optionElement);
    });
  }
  addOption(){
    const optionElement = document.createElement('div');
    optionElement.classList.add('custom-option');
    if(key === 'ves') optionElement.classList.add('selected');
    optionElement.dataset.value = key;
    optionElement.innerText = currencies[key];
    this.optionsElement.append(optionElement);
  }
  selectOption(){
    if (!e.target.classList.contains('selected')) {
      e.target.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
      e.target.classList.add('selected');
      e.target.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.dataset.value.toUpperCase();
    }
  }

}