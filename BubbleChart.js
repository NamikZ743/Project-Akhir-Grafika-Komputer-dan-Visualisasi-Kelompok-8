const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1000, 1000]
};

class Bubble {
  constructor(x, y, radius, label) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.label = label;
    this.setColor([0, 128, 0]); 
  }

  draw(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fill();
    context.font = "20px serif";
    context.fillStyle = 'black';
    context.fillText(this.label, this.x - this.radius / 2, this.y - this.radius - 10); 
  }

  setColor([r, g, b]) {
    this.color = "rgb(" + r + "," + g + "," + b + ")";
  }
}

class BubbleChart {
  constructor(width, height, data) {
    this.width = width;
    this.height = height;
    this.data = data;
    this.bubbles = [];
    this.border = 0.1;
    this.prepareData();
  }

  prepareData() {
    const maxValue = Math.max(...this.data.map(d => d.value));
    
    this.data.forEach((d) => {
      const scaledRadius = (d.value / maxValue) * (this.height * 0.1); 
      const x = random.range(this.border * this.width, (1 - this.border) * this.width);
      const y = random.range(this.border * this.height, (1 - this.border) * this.height);
      this.bubbles.push(new Bubble(x, y, scaledRadius, d.year.toString())); 
    });
  }

  draw(context) {
    context.clearRect(0, 0, this.width, this.height); 
    context.save();
    context.translate(this.border * this.width, this.border * this.height);
    this.drawBubbles(context);
    context.restore();
  }

  drawBubbles(context) {
    this.bubbles.forEach(bubble => {
      bubble.draw(context);
    });
  }
}

const data = [
  { year: 2018, value: 10.1, label: '$10.1 billion' },
  { year: 2019, value: 14.69, label: '$14.69 billion' },
  { year: 2020, value: 22.59, label: '$22.59 billion' },
  { year: 2021, value: 34.87, label: '$34.87 billion' },
  { year: 2022, value: 51.27, label: '$51.27 billion' },
  { year: 2023, value: 70.94, label: '$70.94 billion' },
  { year: 2024, value: 94.41, label: '$94.41 billion' },
  { year: 2025, value: 126, label: '$126 billion' }
];

const sketch = ({ context, width, height }) => {
  return ({ context, width, height }) => {
    const chart = new BubbleChart(width, height, data);
    chart.draw(context);
  };
};

canvasSketch(sketch, settings);
