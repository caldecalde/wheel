const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2, label: 'Noche de\ncine' },
  { minDegree: 31, maxDegree: 90, value: 1, label: 'Tarde de\npaseo' },
  { minDegree: 91, maxDegree: 150, value: 6, label: 'Paseo de\nplaya' },
  { minDegree: 151, maxDegree: 210, value: 5, label: 'Tour de\nfiesta' },
  { minDegree: 271, maxDegree: 330, value: 3, label: 'Día de\npicnic' },
  { minDegree: 211, maxDegree: 270, value: 4, label: 'Parrillada\n en la\nmontaña' },
  { minDegree: 271, maxDegree: 330, value: 3, label: 'Día de\npicnic' },
  { minDegree: 331, maxDegree: 360, value: 2, label: 'Noche de\ncine' },
];
const imageURLs = [
  'images/interna.png',
];
const images = imageURLs.map(v => {
  var image = new Image();
  image.src = v;
  return image;
});
//Size of each piece
const data = [16, 16, 16, 16, 16, 16];
//background color for each piece
var pieColors = [
];
//Create chart
let myChart = new Chart(wheel, {
  //Plugin for displaying text on pie chart
  plugins: [{
    afterDatasetsDraw: chart => {
      var ctx = chart.ctx;
      ctx.save();
      var xCenter = chart.canvas.width / 2;
      var yCenter = chart.canvas.height / 2;
      var r = Math.min(xCenter, yCenter);
      var image = images[0]; // Assuming images is an array and you want to use the first image
      var aspectRatio = image.width / image.height;
      var scaledWidth, scaledHeight;
      if (aspectRatio > 1) {
        scaledWidth = 2 * r;
        scaledHeight = 2 * r / aspectRatio;
      } else {
        scaledHeight = 2 * r;
        scaledWidth = 2 * r * aspectRatio;
      }
      ctx.drawImage(image, xCenter - scaledWidth / 2, yCenter - scaledHeight / 2, scaledWidth, scaledHeight);
      ctx.restore();
    }
  }],
  //Chart Type Pie
  type: "pie",
  data: {
    //Labels(values which are to be displayed on chart)
    labels: [`Tarde de\npaseo`, "Noche de\ncine", "Día de\npicnic", "Parrillada\n en la\nmontaña", "Tour de\nfiesta", "Paseo de\nplaya"],
    //Settings for dataset/pie
    datasets: [
      {
        backgroundColor: null,
        data: data,
      },
    ],
  },
  options: {
    //Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      //hide tooltip and legend
      tooltip: false,
      legend: {
      display: false,
      },
      //display labels inside pie chart
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 22 },
        }
      },
    },
},);


//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Ganaste: ${i.label}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  //Empty final value
  finalValue.innerHTML = `<p>...</p>`;
  //Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    //If rotation>360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});