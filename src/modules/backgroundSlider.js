export class BackgroundColorSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    // Create background slider component
    this.shadowRoot.innerHTML = `  
      <style>
        .slider { width: 150px; accent-color: #38bdf8; }
        .label { margin-left: 1rem; font-weight: bold; color: #38bdf8; }
        .container { display: flex; align-items: center; margin-bottom: 1rem; }
      </style>
      <div class="container">
        <input type="range" min="0" max="2" value="0" class="slider">
        <span class="label" id="label">Blue</span>
      </div>
    `;
    this.slider = this.shadowRoot.querySelector('input');
    this.label = this.shadowRoot.querySelector('#label');
    this.slider.addEventListener('input', () => this.changeBackground());
  }
  // Configure slider color change info with labels
  changeBackground() {
    const val = this.slider.value;
    let color, label;
    if (val == 0) { color = "linear-gradient(to bottom right, #1e3a8a, #0ea5e9)"; label = "Blue Skies"; }
    if (val == 1) { color = "linear-gradient(to bottom right, #fbbf24 60%, #f59e42 100%, #fde68a 0%)"; label = "Sunny"; }
    if (val == 2) { color = "linear-gradient(to bottom right, #64748b, #334155)"; label = "Stormy"; }
    document.body.style.background = color;
    this.label.textContent = label;
  }
}
customElements.define('background-color-slider', BackgroundColorSlider);