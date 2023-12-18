const Image = require("../models/Image");

class ImageRepository {
  constructor() {
    this.model = Image;
  }

  async createImage(data) {
    try {
      const image = new this.model(data);
      await image.save();
      return image;
    } catch (err) {
      console.err("createImage", err);
      throw err;
    }
  }

  async getAllImages() {
    try {
      return await this.model.find({});
    } catch (err) {
      console.err("getAllImages", err);
      throw err;
    }
  }

  async getImageById(id) {
    try {
      return await this.model.findById(id);
    } catch (err) {
      console.err("getImageById", err);
      throw err;
    }
  }

  async updateImage(id, data) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
      console.err("updateImage", err);
      throw err;
    }
  }

  async deleteImage(id) {
    try {
      return await this.model.findByIdAndRemove(id);
    } catch (err) {
      console.err("deleteImage", err);
      throw err;
    }
  }
}

module.exports = ImageRepository;
