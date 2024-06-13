const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1000, 1000]
};

class Bar {
  constructor(x, y, width, height, value) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.value = value;
    this.setColor([0, 128, 0]);  // Green color for bars
  }

  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.font = "20px serif";
    context.fillStyle = 'black';
    context.fillText(this.value, this.x + this.width / 4, this.y - 10); 
  }

  setColor([r, g, b]) {
    this.color = "rgb(" + r + "," + g + "," + b + ")";
  }
}

class BarChart {
  constructor(width, height, data) {
    this.width = width;
    this.height = height;
    this.data = data;
    this.bars = [];
    this.border = 0.1;
    this.padding = 10;
    this.bottomPadding = 50; 
    this.prepareData();
  }

  prepareData() {
    const barWidth = (this.width / this.data.length) - this.padding;
    const maxValue = Math.max(...this.data.map(d => d.value));

    this.data.forEach((d, i) => {
      const scaledHeight = (d.value / maxValue) * (this.height * 0.8);
      const x = i * (barWidth + this.padding);
      this.bars.push(new Bar(x, this.height - scaledHeight - this.bottomPadding, barWidth, scaledHeight, d.label));
    });
  }

  draw(context) {
    context.clearRect(0, 0, this.width, this.height);  // Clear the canvas
    context.save();
    context.translate(this.border * this.width, this.border * this.height);
    this.drawAxis(context);
    this.drawBars(context);
    context.restore();
  }

  drawAxis(context) {
    // X-Axis
    context.beginPath();
    context.moveTo(0, this.height - this.bottomPadding);
    context.lineTo(this.width, this.height - this.bottomPadding);
    context.stroke();

    // Y-Axis
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, this.height - this.bottomPadding);
    context.stroke();

    // Label for Y-Axis
    context.save();
    context.translate(-50, (this.height - this.bottomPadding) / 2);
    context.rotate(-Math.PI / 2);
    context.textAlign = "center";
    context.font = "30px serif";
    context.fillStyle = 'black';
    context.fillText('Total Pendapatan', 0, 0);
    context.restore();

    // Label for X-Axis
    context.textAlign = "center";
    context.font = "20px serif";
    this.bars.forEach((bar, index) => {
      context.fillText(this.data[index].year, bar.x + bar.width / 2, this.height - this.bottomPadding + 30);
    });
  }

  drawBars(context) {
    this.bars.forEach(bar => {
      bar.draw(context);
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
    const chart = new BarChart(width - 100, height - 100, data);  // Adjusting chart size for padding
    chart.draw(context);
  };
};

canvasSketch(sketch, settings);
