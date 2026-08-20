const models = [];

export function registerModel(model) {
  models.push(model);
}

export function listModels() {
  return models;
}

export function getModel(id) {
  return models.find(
    model => model.id === id
  );
}
