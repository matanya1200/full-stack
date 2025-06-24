const express = require('express');
const homeRoutes = require('./routes/home');
const pagesRoutes = require('./routes/pages');
const filesRoutes = require('./routes/files');
const contactsRoutes = require('./routes/contacts');
const compsRoutes = require('./routes/comps');

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;

// Routes
app.use('/', homeRoutes);
app.use('/pages', pagesRoutes);
app.use('/files', filesRoutes);
app.use('/contacts', contactsRoutes);
app.use('/comps', compsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});