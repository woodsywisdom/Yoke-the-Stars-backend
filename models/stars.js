var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var ComplexSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  title: String,
  description: String,
  body: String,
  favoritesCount: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  tagList: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

ComplexSchema.plugin(uniqueValidator, {message: 'is already taken'});


ComplexSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

ComplexSchema.methods.updateFavoriteCount = function() {
  var Complex = this;

  return User.count({favorites: {$in: [Complex._id]}}).then(function(count){
    Complex.favoritesCount = count;

    return Complex.save();
  });
};

ComplexSchema.methods.toJSONFor = function(user){
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  };
};


// ComplexSchema.methods.toJSONFor = function(user){
//     return {
//       slug: this.slug,
//       title: this.title,
//       description: this.description,
//       body: this.body,
//       createdAt: this.createdAt,
//       updatedAt: this.updatedAt,
//       tagList: this.tagList,
//       favorited: user ? user.isFavorite(this._id) : false,
//       favoritesCount: this.favoritesCount,
//       author: this.author.toProfileJSONFor(user)
//     };
//   };



mongoose.model('Complex', ComplexSchema);

// tbr