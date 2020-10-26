exports.register = (req, res) => {
    console.log(req.body); //Grab all the data from the <form>
    res.send("Form Summitted");
}