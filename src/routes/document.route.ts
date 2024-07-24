import express, { Router } from "express";
import DocumentController from "../controllers/document.controller";

const DocumentRoute: Router = express.Router();

//Retrieve the content of a specific document.
DocumentRoute.get(`/api/documents`, DocumentController.retrieveDocumentByUUID); 

// Create a new document and return its unique identifier.
DocumentRoute.post(`/api/documents`, DocumentController.saveDocument);

export default DocumentRoute;