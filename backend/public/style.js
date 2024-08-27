//i am fetching the data
// URL of the data you want to fetch
// URL of the data you want to fetch
// Make a fetch request to the server endpoint
// const fetchRequest = async () => {
//   const response = await fetch("http://localhost:3000/view/pannel");
//   console.log(response);
//   const data = response.json();
// };
// fetchRequest();
// fetch("http://localhost:3000/view/pannel", {
//   method: "GET", // Change method to GET
//   headers: {
//     "Content-Type": "application/json",
//   },
// })
//   .then((response) => {
//     // Log the response body for debugging
//     return response.text();
//   })
//   .then((body) => {
//     console.log("Response body:", body);
//     // Now you can parse the response body as JSON if it's valid JSON
//     try {
//       const jsonData = JSON.parse(body);
//       console.log("Parsed JSON data:", jsonData);
//     } catch (error) {
//       console.error("Error parsing JSON:", error);
//     }
//   })
//   .catch((error) => {
//     // Handle any errors that occurred during the fetch
//     console.error("There was a problem with the fetch operation:", error);
//   });

// //-----------------------------------------------------.......

// First of all, we assign w and h to the width and height of the window
var w = window.innerWidth;
var h = window.innerHeight;

// Define the scaling factor
var scaleFactor = 100;

// made the variable for name final
let final;

// here we using if-else to set the final to be width or height
if (w > h) {
  final = h;
} else {
  final = w;
}

// Number of boxes and cell size
let numBoxes = 40;
var cellSize = final / numBoxes;

// Here we made grid lines
var canv = document.createElement("canvas");
canv.width = final;
canv.height = final;
document.body.appendChild(canv);
var ctx = canv.getContext("2d");

ctx.fillStyle = "black";
ctx.fillRect(0, 0, w, h);

ctx.strokeStyle = "green";

for (var c = 1; c < w / cellSize; c++) {
  ctx.beginPath();
  ctx.moveTo(c * cellSize, 0);
  ctx.lineTo(c * cellSize, h);
  ctx.stroke();
}

for (var r = 1; r < final / cellSize; r++) {
  ctx.beginPath();
  ctx.moveTo(0, r * cellSize);
  ctx.lineTo(w, r * cellSize);
  ctx.stroke();
}

// Here we calculate cell width
let cellwidth = scaleFactor / numBoxes;
console.log(cellSize);
console.log(cellwidth);

// Data
// let object = [
//   {
//     name: "pillar1",
//     cordinate: [
//       {
//         x: (20 / cellwidth) * scaleFactor,
//         y: (20 / cellwidth) * scaleFactor,
//       },
//       {
//         x: (10 / cellwidth) * scaleFactor,
//         y: (20 / cellwidth) * scaleFactor,
//       },
//       {
//         x: (10 / cellwidth) * scaleFactor,
//         y: (10 / cellwidth) * scaleFactor,
//       },
//       {
//         x: (20 / cellwidth) * scaleFactor,
//         y: (10 / cellwidth) * scaleFactor,
//       },
//     ],
//     status: "non extracted",
//   },
//   {
//     name: "pillar2",
//     cordinate: [
//       {
//         x: (50 / cellwidth) * scaleFactor,
//         y: (50 / cellwidth) * scaleFactor,
//       },
//       {
//         x: (60 / cellwidth) * scaleFactor,
//         y: (50 / cellwidth) * scaleFactor,
//       },
//       {
//         x: (60 / cellwidth) * scaleFactor,
//         y: (70 / cellwidth) * scaleFactor,
//       },
//       {
//         x: (50 / cellwidth) * scaleFactor,
//         y: (70 / cellwidth) * scaleFactor,
//       },
//     ],
//     status: "extracted",
//   },
// ];

// let object = [
//   {
//     name: "pillar1",
//     cordinate: [
//       {
//         x: 5,
//         y: 5,
//       },
//       {
//         x: 6,
//         y: 5,
//       },
//       {
//         x: 6,
//         y: 4,
//       },
//       {
//         x: 5,
//         y: 4,
//       },
//     ],
//     status: "non extracted",
//   },
//   {
//     name: "pillar2",
//     cordinate: [
//       { x: (50 / cellwidth) * cellSize, y: (50 / cellwidth) * cellSize },
//       { x: (60 / cellwidth) * cellSize, y: (50 / cellwidth) * cellSize },
//       { x: (60 / cellwidth) * cellSize, y: (70 / cellwidth) * cellSize },
//       { x: (50 / cellwidth) * cellSize, y: (70 / cellwidth) * cellSize },
//     ],
//     status: "extracted",
//   },
// ];

// Here we make the polygon using coordinates
function Drawer(canvas) {
  var context = canvas.getContext("2d");
  this.drawPolygon = function (points, status) {
    if (points.length > 0) {
      context.fillStyle = "red";
      context.beginPath();
      var point = points[0];
      context.moveTo(point.x, point.y); // point 1
      for (var i = 1; i < points.length; ++i) {
        point = points[i];
        context.lineTo(point.x, point.y); // point from 2 up to (points.length - 1)
      }
      context.closePath(); // go back to point 1

      if (status == "non extracted") {
        context.fillStyle = "white";
        context.fill();
        context.strokeStyle = "red";
        context.stroke(); // draw stroke line
      } else if (status == "extracted") {
        context.fillStyle = "grey";
        context.fill();
        context.strokeStyle = "red";
        context.stroke(); // draw stroke line
      }
    }
  };
}

// Function to create pillar using coordinates
function createPillar(points, status) {
  let drawer = new Drawer(canv);
  drawer.drawPolygon(points, status);
}

// Function to create pillars using object data
function createPillars(objects) {
  objects.forEach((element) => {
    let points = element.cordinate.map((coord) => ({
      x: (coord.x / cellwidth) * scaleFactor,
      y: (coord.y / cellwidth) * scaleFactor,
    }));
    createPillar(points, element.status);
  });
}

// createPillars(object);

// Get the coordinates div
var coordinatesDiv = document.getElementById("coordinates");

// Add mousemove event listener to the canvas
canv.addEventListener("mousemove", function (e) {
  // Calculate mouse coordinates relative to the canvas
  var mouseX =
    (e.clientX - canv.getBoundingClientRect().left) *
    (scaleFactor / canv.width);
  var mouseY =
    (e.clientY - canv.getBoundingClientRect().top) *
    (scaleFactor / canv.height);

  // Update the coordinates in the div
  coordinatesDiv.innerHTML =
    "X: " + mouseX.toFixed(2) + " units, Y: " + mouseY.toFixed(2) + " units";
});
// console.log(object);
