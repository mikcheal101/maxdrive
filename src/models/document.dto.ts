import DocumentModel from "./document.model";
import IDocumentModel from "./document.type";

class DocumentDto {
    public static Save = async (document: IDocumentModel): Promise<string | null> => {
        // save a document
        const doc = new DocumentModel({ uuid: document.uuid, content: document.content });
        const data = await doc.save();
        return data ? data.uuid : null;
    };

    public static Delete = async (uuid: string): Promise<boolean> => {
        const deleted = await DocumentModel.deleteOne({ uuid });
        return deleted.deletedCount > 0 ? true : false;
    };

    public static Update = async (param: IDocumentModel): Promise<boolean> => {
        const updated = await DocumentModel.updateOne({ uuid: param.uuid }, { $set: { content: param.content } });
        return updated.upsertedCount > 0;
    };

    public static GetById = async (uuid: string | null): Promise<IDocumentModel | null> => {
        let documentExists: IDocumentModel | null = null;

        if (uuid !== null) {
            documentExists = await DocumentModel.findOne({ uuid: uuid });
            console.log(`document found: ${documentExists}.`);
        }

        return documentExists;
    };

    public static GetAll = async (): Promise<Array<IDocumentModel>> => {
        const documentExists: Array<IDocumentModel> | null = await DocumentModel.find();

        return documentExists;
    };
};

export default DocumentDto;