import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import DocumentDto from "../models/document.dto";
import IDocumentModel from "../models/document.type";

class DocumentController {

    public static saveDocument = async (_: Request, response: Response) => {

        // generate a uuid
        const id: string = uuid();
    
        // save a document
        const data: string | null = await DocumentDto.Save({ uuid: id, content: "" });
    
        response.json({ "id": data });
    }

    public static retrieveDocumentByUUID = async (request: Request, response: Response) => {

        const content_id = request.query.id;
        if (content_id == undefined || content_id == null) {
            return response.status(400).json("invalid id");
        }
        
        const documentExists: IDocumentModel | null = await DocumentDto.GetById(`${content_id}`);
    
        if (documentExists) {
            return response.json(documentExists.content);
        }
    
        return response.status(400).json("invalid id");
    }
};

export default DocumentController;