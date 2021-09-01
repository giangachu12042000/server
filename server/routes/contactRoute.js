const ContactController = require('../controllers/contactController');

const contactRouter =(router)=> {
    router.post('/contact/create', ContactController.createContact);
    router.get('/contact/fetch-all', ContactController.fetchAll);
    router.put('/contact/edit', ContactController.updateContact);
    router.delete('/contact/delete', ContactController.deleteContact);
    router.get('/contact/get-contact', ContactController.findContactByid);
}

module.exports.connect = contactRouter;