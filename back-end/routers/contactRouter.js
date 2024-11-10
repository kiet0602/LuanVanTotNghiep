import express from "express";
import { createContact, getContacts } from "../controller/contactController.js";

const contactRouter = express();

contactRouter.post(`/createContact`, createContact);
contactRouter.get(`/getAllcontact`, getContacts);

export default contactRouter;
