const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb')
const app = express();
const mongoose = require('mongoose');

app.use(express.json());

app.listen(3000, () => console.log('Listening at 3000'))
app.use(express.static('public'));


//connect to MondoDB----------------------------------------------------------------

const mongoURI = "mongodb+srv://wg2428:u%40U5410154@penny-cluster.63zpcok.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connection successful'))
    .catch(err => console.error('MongoDB connection error:', err));


const commentSchema = new mongoose.Schema({
        comment: String,
        email: String
});

const UserComment = mongoose.model('UserComment', commentSchema);


//post data to MongoDB----------------------------------------------

app.post('/api', async (request,response) => {
    console.log(request.body); 
    try {
        const newComment = new UserComment({
            comment: request.body.comment,
            email: request.body.email
        });

        // Save the new comment to MongoDB
        const savedComment = await newComment.save();
        response.json({ message: 'Data saved to MongoDB', data: savedComment });
    } catch (err) {
        console.error('Error saving data to MongoDB:', err);
        response.status(500).json({ message: 'Failed to save data' });
    }
//--------------------------------------------------------------------


//retrieve data from MongoDB--------------------------------------------------

app.get('/api/comments', async (request, response) => {
    try {
        const comments = await UserComment.find(); // Get all comments from MongoDB
        response.json(comments); // Send them back as a JSON response
        console.log('Retrived data is : ' + comments)

    } catch (err) {
        response.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
    
});

//--------------------------------------------------------------------------
   

// ---------- Delete Button ----------------------------------------------------------------

app.delete('/api/comments/:id', async (request, response) => {
    try {
        const result = await UserComment.findByIdAndDelete(request.params.id);
        if (!result) {
            return response.status(404).json({ message: 'Comment not found' });
        }
        response.json({ message: 'Comment deleted successfully', id: request.params.id });
    } catch (err) {
        console.error('Error deleting comment:', err);
        response.status(500).json({ message: 'Failed to delete comment' });
    }
});

// -------------------------------------------------------------------------------


// ---------- Edit Button ----------------------------------------------------------------

app.put('/api/comments/:id', async (request, response) => {
    try {
        const updatedComment = await UserComment.findByIdAndUpdate(
            request.params.id,
            { $set: { comment: request.body.comment, email: request.body.email } },
            { new: true }
        );
        if (!updatedComment) {
            return response.status(404).json({ message: 'Comment not found' });
        }
        response.json({ message: 'Comment updated successfully', comment: updatedComment });
    } catch (err) {
        console.error('Error updating comment:', err);
        response.status(500).json({ message: 'Failed to update comment' });
    }
});



// -------------------------------------------------------------------------------
});


