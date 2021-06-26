// ml5.js: Save Neural Network Trained Model
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/6.3-ml5-save-model.html
// https://youtu.be/wUrg9Hjkhg0
// https://editor.p5js.org/codingtrain/sketches/RxDbDKGiG

let model;
let targetLabel = 'C';

let state = 'collection';

let notes = {
  C: 261.6256,
  D: 293.6648,
  E: 329.6276,
  F: 349.2282,
  G: 391.9954,
  A: 440.0,
  B: 493.8833
};

let env, wave;

function setup() {
  createCanvas(400, 400);
  const options = {
    inputs: 2,
    outputs: 2,
    debug: true,
    task: 'classification',
    learningRate: 0.8,
  };
  model = ml5.neuralNetwork(options);
}
function keyPressed() {
  if(key === 's') { // Save Training data
    model.saveData('mouse-points', dataSaved);
  } if(key === 'l') { // Load training data
    model.loadData('./6NeuralNetwork/mouse-points.json', dataLoaded);
  } if(key === 't') { // Train neural Network
    state = 'training'
    model.normalizeData();
    const options = {epochs: 200};
    model.train(options, whileTraining, finishTraining);
  } if(key === 'z') { // Save trained model
    model.save();
  } if(key === 'y') { // Load trained model
    loadTrainedModel();
  } else {
    targetLabel = key.toUpperCase();
  }
}
function loadTrainedModel() {
  const modelInfo = {
    model: '6NeuralNetwork/model/model.json',
    metadata: '6NeuralNetwork/model/model_meta.json',
    weights: '6NeuralNetwork/model/model.weights.bin',
  };
  console.log('model Info --- ', modelInfo);
  model.load(modelInfo, modelLoadedCallback);
}
function modelLoadedCallback() {
  console.log('Model loaded successfully');
  state = 'prediction';
}

function whileTraining(epoch, loss) {
  console.log(`epoch: ${epoch}, loss : `, loss);
}
function finishTraining() {
  console.log('Training is finished');
  state = 'prediction';
}
function dataLoaded() {
  console.log('Training data is loaded');
}
function dataSaved() {
  console.log('Data is saved successfully');
}
function mousePressed() {
  const inputs = [mouseX, mouseY];
  if(state === 'collection') {
    const target = [targetLabel];
    model.addData(inputs, target);
  
    stroke(0);
    noFill();
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(targetLabel, mouseX, mouseY);
  } else if (state == 'prediction') {
    model.classify(inputs, gotClassificationResults)
  }
}

function gotClassificationResults(err, results) {
  if(err) {
    console.error(err);
  }
  console.log('Results : ', results);
  const label = results[0].label;
  stroke(0);
  fill(0, 0, 255, 100);
  ellipse(mouseX, mouseY, 24);
  fill(0)
  noStroke();
  textAlign(CENTER, CENTER);
  text(label, mouseX, mouseY);
}
