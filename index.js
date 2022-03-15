const Joi = require('joi');
const express = require('express');
const { response } = require('express');
const app = express();
app.use(express.json());

const genres = [
    { id: 0, name: 'Dont look up' },
    { id: 1, name: 'Boyka' },
    { id: 2, name: '100 Shades of Gray' },
    { id: 3, name: 'Doktori i mrekullive' },
];

app.get('/', (request, response) => {
    response.send('Hello there!');
});

app.get('/vidly.com/api/genres', (request, response) => {
    response.send(genres);
});

app.get('/vidly.com/api/genres/:id', (request, response) => {
    let movie = genres.find(movie => movie.id === parseInt(request.params.id));

    // not found
    if (!movie) {
        return response.status(404).send('The course with the given ID was not found!');
    } else {
        response.send(`Course name: ${movie.name} with ID: ${movie.id}`)
    }
});


// -------------------------------------------------------------------------------------------------------------------------------


app.post('/vidly.com/api/genres', (request, response) => {
    const { error } = validateCourse(request.body);

    if (error) {
        return response.status(404).send('The course with the given ID was not found!');
    }


    const movie = {
        id: genres.length + 1,
        name: request.body.name
    }
    genres.push(movie);
    response.send(movie);
});


// -------------------------------------------------------------------------------------------------------------------------------


app.put('/vidly.com/api/genres/:id', (request, response) => {
    const movie = genres.find(movie => movie.id === parseInt(request.params.id));

    const Validation = validateCourse(request.body);
    const { error } = validateCourse(request.body);

    if (error) {
        return response.status(404).send('The course with the given ID was not found!');
    }

    // update
    movie.name = request.body.name;

    // return updated movie to the client
    response.send(movie);
});

function validateCourse(movie) {
    // validate
    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });

    return schema.validate(movie.body);
}

// -------------------------------------------------------------------------------------------------------------------------------


app.delete('/vidly.com/api/genres/:id', (request, response) => {
    // look up for the course
    const movie = genres.find(movie => movie.id === parseInt(request.params.id));

    // not existing send 404 error
    if (!movie) {
        return response.status(404).send('The course with the given ID was not found!')
    }

    // delete
    const index = genres.indexOf(movie);
    genres.splice(index, 1);

    // return the same course
    response.send(movie);
});


// -------------------------------------------------------------------------------------------------------------------------------


const port = process.env.PORT || 30;

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}...`);
});