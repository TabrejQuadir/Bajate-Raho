const mongoose = require('mongoose');

// Album schema
const AlbumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    backgroundColor: { type: String },
    image: { type: String },
    description: { type: String, default: '', maxlength: 500 },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    totalDuration: { type: Number, default: 0 }, // stored in seconds
    averageRating: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true }
);

// Virtual field for formatted duration (mm:ss)
AlbumSchema.virtual('formattedDuration').get(function () {
  const mins = Math.floor(this.totalDuration / 60);
  const secs = this.totalDuration % 60;
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
});

// Enable virtuals in JSON output
AlbumSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Album', AlbumSchema);
